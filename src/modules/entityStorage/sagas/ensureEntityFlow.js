import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import normalize from 'client-core/src/modules/resources/utils/normalize';
import { now } from 'client-core/src/utils/sideEffects';
import hash from 'object-hash';

import rethrowError from 'client-core/src/utils/rethrowError';
import isOfType from 'client-core/src/utils/isOfType';
import typeInvariant from 'client-core/src/utils/typeInvariant';

import { apiContextSelector, apiServiceSelector } from 'client-core/src/modules/api/selectors';
import { authContextSelector } from 'client-core/src/modules/auth/selectors';
import { modelSchemaSelectorFactory } from 'client-core/src/modules/entityDescriptors/selectors';
import {
	ENSURE_ENTITY,
	attemptFetchEntity,
	receiveFetchEntityFailure,
	receiveEntities,
} from '../actions';

import type { ApiService } from 'client-core/src/utils/types/ApiService';
import type { EntityResult } from 'client-core/src/utils/types/EntityResult';
import type { Error } from 'client-core/src/utils/types/Error';

export function *ensureEntityTask(action) {
	const { modelName, where } = action.payload;

	// ApiService is needed to ensure entity
	const apiService = yield select(apiServiceSelector);
	typeInvariant(apiService, ApiService, 'entityStorage module depends on api module');

	// get optional contexts to pass to ApiService
	const apiContext = yield select(apiContextSelector);
	const authContext = yield select(authContextSelector);

	// TODO split lazy and accurate modes of fetching

	yield put(attemptFetchEntity({ modelName, where }));
	let apiCallResult;
	try {
		apiCallResult = yield call(
			apiService.getEntity,
			modelName,
			where,
			apiContext,
			authContext
		);
	} catch (error) {
		rethrowError(error);
		if (!isOfType(error, Error)) {
			yield put(
				receiveFetchEntityFailure(
					{
						modelName,
						where,
						error: { code: 5000, message: 'Invalid error', data: error },
					}
				)
			);
			return;
		}
		yield put(
			receiveFetchEntityFailure(
				{ modelName, where, error }
			)
		);
		return;
	}

	if (!isOfType(apiCallResult, EntityResult)) {
		yield put(
			receiveFetchEntityFailure(
				{
					modelName,
					where,
					error: { code: 5000, message: 'Invalid entity response', data: apiCallResult },
				}
			)
		);
		return;
	}

	const entitySchema = yield select(modelSchemaSelectorFactory(modelName));
	const {
		result: entityId,
		entities,
	} = normalize(
		apiCallResult.data,
		entitySchema,
	);

	const refs = {
		[modelName]: {
			[hash(where)]: {
				where,
				entityId,
			},
		},
	};

	const time = yield call(now);

	yield put(
		receiveEntities(
			{ refs, normalizedEntities: entities, validAtTime: time.format() }
		)
	);
}

export default function *ensureEntityFlow() {
	yield call(takeEvery, ENSURE_ENTITY, ensureEntityTask);
}
