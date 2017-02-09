// @flow
import { assign, get as g, mapValues } from 'lodash';
import hash from 'object-hash';

import rethrowError from 'client-core/src/utils/rethrowError';
import isOfType from 'client-core/src/utils/isOfType';
import typeInvariant from 'client-core/src/utils/typeInvariant';

import { takeEvery } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';

import normalize from 'client-core/src/modules/resources/utils/normalize';

import { apiContextSelector, apiServiceSelector } from 'client-core/src/modules/api/selectors';
import { authContextSelector } from 'client-core/src/modules/auth/selectors';
import {
	modelSchemaSelectorFactory,
	modelIdPropertyNameSelectorFactory,
} from 'client-core/src/modules/entityDescriptors/selectors';
import stripReadOnlyProperties from 'client-core/src/modules/resources/utils/stripReadOnlyProperties';
import { now } from 'client-core/src/utils/sideEffects';
import { entityStatusSelectorFactory, denormalizedEntitySelectorFactory } from '../selectors';
import {
	MERGE_ENTITY,
	PERSIST_ENTITY,
	persistEntity,
	receivePersistEntitySuccess,
	receivePersistEntityFailure,
} from '../actions';

import type { ApiService } from 'client-core/src/utils/types/ApiService';
import type { EntityResult } from 'client-core/src/utils/types/EntityResult';
import type { EntityValidationError } from 'client-core/src/utils/types/EntityValidationError';

const INTERNAL_ID_PROPERTY_NAME = '_id';

function expandAssociationsUpdatesTemplate(associationsUpdatesTemplate, entityId) {
	return mapValues(associationsUpdatesTemplate, (entityIdsDict) => {
		return mapValues(entityIdsDict, (entityAssociationsDict) => {
			return mapValues(entityAssociationsDict, () => entityId);
		});
	});
}

export function *mergeEntityTask(action) {
	const { modelName, where, data, noInteraction, associationsUpdatesTemplate } = action.payload;

	const idPropertyNameSelector = yield call(modelIdPropertyNameSelectorFactory, modelName);
	let idPropertyName = yield select(idPropertyNameSelector);
	let entityHasOwnIdProperty = true;
	if (!idPropertyName) {
		idPropertyName = INTERNAL_ID_PROPERTY_NAME;
		entityHasOwnIdProperty = false;
	}

	let entityId = data[idPropertyName];
	if (!entityId) {
		const r = yield call(Math.random);

		entityId = hash({ data, r });
	}

	const denormalizedEntitySelector = yield call(denormalizedEntitySelectorFactory, modelName, entityId, 9999);
	const existingEntity = yield select(denormalizedEntitySelector);
	const updatedEntity = assign({}, existingEntity || {}, data);

	const entitySchema = yield select(modelSchemaSelectorFactory(modelName));

	const blueprintSchemaName = g(entitySchema, 'x-blueprint');
	const blueprintSchema = yield select(modelSchemaSelectorFactory(blueprintSchemaName));

	const {
		entities,
	} = normalize(
		{
			...updatedEntity,
			[idPropertyName]: entityId,
		},
		entityHasOwnIdProperty ?
			entitySchema :
		({
			...entitySchema,
			'x-idPropertyName': INTERNAL_ID_PROPERTY_NAME,
		})
	);

	let blueprintData;
	if (blueprintSchema) {
		blueprintData = stripReadOnlyProperties(
			updatedEntity,
			blueprintSchema
		);
	}

	yield put(
		persistEntity(
			{
				modelName,
				entityId,
				where,
				normalizedEntities: entities,
				blueprintData,
				noInteraction,
				associationsUpdates: associationsUpdatesTemplate ?
				                     (
					                     expandAssociationsUpdatesTemplate(associationsUpdatesTemplate, entityId)
				                     ) :
				                     (
					                     undefined
				                     ),
			}
		)
	);
}

export function *persistEntityTask(action) {
	const { modelName, entityId, where, noInteraction, blueprintData } = action.payload;
	if (noInteraction) {
		// do not call api
		return;
	}

	// ApiService is needed to merge entity
	const apiService = yield select(apiServiceSelector);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// EntityMapping is needed to normalize entity

	const apiContext = yield select(apiContextSelector);
	const authContext = yield select(authContextSelector);
	const entityStatusSelector = yield call(entityStatusSelectorFactory, modelName, entityId);
	const entityStatus = yield select(entityStatusSelector);

	let remoteEntityId = entityId;
	let transientEntityId;
	if (!entityStatus || entityStatus.transient) {
		remoteEntityId = undefined;
		transientEntityId = entityId;
	}

	let denormalizedEntity = blueprintData;
	if (!denormalizedEntity) {
		const denormalizedEntitySelector = yield call(denormalizedEntitySelectorFactory, modelName, entityId, 999);
		denormalizedEntity = yield select(denormalizedEntitySelector);
	}
	// const modelSchema = yield select(modelSchemaSelectorFactory(modelName));
	const strippedEntity = stripReadOnlyProperties(
		denormalizedEntity,
		yield select(modelSchemaSelectorFactory(modelName)),
	);

	let persistResult;
	try {
		const apiServiceMethodName = remoteEntityId ? 'updateEntity' : 'createEntity';
		persistResult = yield call(
			apiService[apiServiceMethodName],
			modelName,
			where,
			strippedEntity,
			apiContext,
			authContext
		);
	} catch (error) {
		rethrowError(error);
		if (!isOfType(error, EntityValidationError)) {
			yield put(receivePersistEntityFailure(
				{
					modelName,
					entityId,
					error: {
						code: 5000,
						message: 'Invalid error',
						data: error,
					},
				}
			));
			return;
		}
		yield put(
			receivePersistEntityFailure(
				{
					modelName,
					entityId,
					error,
				}
			)
		);
		return;
	}

	if (!isOfType(persistResult, EntityResult)) {
		yield put(
			receivePersistEntityFailure(
				{
					modelName,
					entityId,
					error: {
						code: 5000,
						message: 'Invalid entity response',
						data: persistResult,
					},
				}
			)
		);
		return;
	}

	let entitySchema = yield select(modelSchemaSelectorFactory(modelName));
	let entityHasOwnIdProperty = true;
	if (!g(entitySchema, 'x-idPropertyName')) {
		entitySchema = { ...entitySchema, 'x-idPropertyName': INTERNAL_ID_PROPERTY_NAME };
		entityHasOwnIdProperty = false;
	}
	const {
		result: resultEntityId,
		entities,
	} = normalize(
		entityHasOwnIdProperty ?
		(
			persistResult.data
		) :
		({
			...persistResult.data,
			[INTERNAL_ID_PROPERTY_NAME]: entityId,
		}),
		entitySchema
	);

	const time = yield call(now);

	yield put(
		receivePersistEntitySuccess(
			{
				modelName,
				entityId: resultEntityId,
				normalizedEntities: entities,
				transientEntityId,
				validAtTime: time.format(),
			}
		)
	);
}

export default function *mergeEntityFlow() {
	yield [
		call(takeEvery, MERGE_ENTITY, mergeEntityTask),
		call(takeEvery, PERSIST_ENTITY, persistEntityTask),
	];
}
