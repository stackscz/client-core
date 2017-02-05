import { get as g, isUndefined } from 'lodash';
import { call, select, put } from 'redux-saga/effects';
import invariant from 'invariant';
import { takeEvery } from 'redux-saga';
import hash from 'object-hash';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';
import normalize from 'client-core/src/modules/resources/utils/normalize';
import rethrowError from 'client-core/src/utils/rethrowError';

import {
	modelIdPropertyNameSelectorFactory,
} from 'client-core/src/modules/entityDescriptors/selectors';
import { receiveEntities } from 'client-core/src/modules/entityStorage/actions';
import { now } from 'client-core/src/utils/sideEffects';

import {
	resourcesServiceSelector,
	resourcesModuleStateSelector,
} from 'client-core/src/modules/resources/selectors';

import {
	MERGE_RESOURCE,
	persistResource,
	receivePersistResourceSuccess,
	receivePersistResourceFailure,
} from '../actions';
import {
	resolvedLinkSelectorFactory,
	resourceSchemaSelectorFactory,
	resourceSelectorFactory,
} from '../selectors';

import findRelationLinkName from 'client-core/src/modules/resources/utils/findRelationLinkName';

const INTERNAL_ID_PROPERTY_NAME = '_id';

// TODO rename `collectionLink` to `parentLink`
export function *mergeResourceTask({ payload: { link, data, collectionLink } }) {
	// determine model name of resource
	const resourceSchema = link ? yield select(resourceSchemaSelectorFactory(link)) : undefined;
	let collectionResourceSchema;
	if (collectionLink) {
		collectionResourceSchema = yield select(resourceSchemaSelectorFactory(collectionLink));
	}
	let modelName;
	if (resourceSchema && !collectionResourceSchema) {
		modelName = g(resourceSchema, 'x-model', g(resourceSchema, 'items.x-model'));
	} else if (collectionResourceSchema) {
		modelName = g(
			collectionResourceSchema,
			'x-model',
			g(resolveSubschema(collectionResourceSchema, 'items'), 'x-model')
		);
	}

	// determine id property of model by name
	const idPropertyNameSelector = yield call(
		modelIdPropertyNameSelectorFactory,
		modelName,
	);
	let idPropertyName = yield select(idPropertyNameSelector);
	// let entityHasOwnIdProperty = true;
	if (!idPropertyName) {
		idPropertyName = INTERNAL_ID_PROPERTY_NAME;
		// entityHasOwnIdProperty = false;
	}

	const finalResourceSchema = resourceSchema || resolveSubschema(collectionResourceSchema, 'items');

	// determine resource self link
	let entityId;
	const selfLinkName = findRelationLinkName(
		finalResourceSchema,
		'self',
	);
	let selfLink = link;
	if (selfLink) {
		entityId = selfLink.params[idPropertyName];
	} else {
		if (!entityId) {
			const r = yield call(Math.random);
			entityId = hash({ data, r });
		}
		const computedSelfLink = yield select(
			resolvedLinkSelectorFactory(
				{
					name: selfLinkName,
					params: {
						...data,
						[idPropertyName]: entityId,
					},
				}
			)
		);
		invariant(computedSelfLink, 'Could not compute self link for name `%s`', selfLinkName);

		selfLink = {
			name: computedSelfLink.name,
			params: computedSelfLink.params,
		};
	}

	let resource = yield select(resourceSelectorFactory(selfLink));

	//
	// Normalize entity data.
	//
	const {
		result: resultEntityId,
		entities: normalizedEntities,
	} = normalize(
		{
			...data,
			[idPropertyName]: entityId,
		},
		finalResourceSchema,
	);

	const validAtTime = yield call(now);
	yield put(
		receiveEntities(
			{
				refs: {},
				normalizedEntities,
				validAtTime: validAtTime.format(),
			}
		)
	);
	yield put(
		persistResource(
			{
				link: selfLink,
				transient: isUndefined(link) || g(resource, 'transient', false),
				links: {},
				modelName,
				content: resultEntityId,
				collectionLink,
			}
		)
	);

	resource = yield select(resourceSelectorFactory(selfLink));
	const apiDescription = yield select(resourcesModuleStateSelector);

	const ApiService = yield select(resourcesServiceSelector);
	let callResult;
	if (resource && !resource.transient) {
		// we have candidate resource to PUT to
		try {
			callResult = yield call(
				ApiService.putResource,
				{
					apiDescription,
					link: selfLink,
					data,
				}
			);
		} catch (error) {
			rethrowError(error);
			yield put(
				receivePersistResourceFailure(
					{
						link: selfLink,
						error,
					}
				)
			);
			return;
		}
	} else if (collectionLink) {
		// we have candidate collection resource to POST to
		try {
			callResult = yield call(
				ApiService.postResource,
				{
					apiDescription,
					link: collectionLink,
					data,
				}
			);
		} catch (error) {
			rethrowError(error);
			yield put(
				receivePersistResourceFailure(
					{
						link: selfLink,
						error,
					}
				)
			);
			return;
		}
	} else {
		throw 'Could not determine how to merge entity'; // eslint-disable-line
	}

	const resolvedReceivedSelfLink = yield select(
		resolvedLinkSelectorFactory(
			{
				name: selfLinkName,
				params: callResult,
			}
		)
	);
	const receivedSelfLink = {
		name: resolvedReceivedSelfLink.name,
		params: resolvedReceivedSelfLink.params,
	};

	const {
		result: postResultEntityId,
		entities: normalizedPostResultEntities,
	} = normalize(
		callResult,
		finalResourceSchema,
	);

	yield put(
		receiveEntities(
			{
				refs: {},
				normalizedEntities: normalizedPostResultEntities,
				validAtTime: validAtTime.format(),
			}
		)
	);
	yield put(
		receivePersistResourceSuccess(
			{
				link: receivedSelfLink,
				content: postResultEntityId,
				collectionLink,
				transientLink: selfLink,
				transientContent: resultEntityId,
			}
		)
	);
}

export default function *mergeResourceFlow() {
	yield call(takeEvery, MERGE_RESOURCE, mergeResourceTask);
}
