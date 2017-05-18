import { get as g, isUndefined } from 'lodash';
import { call, select, put, takeEvery } from 'redux-saga/effects';
import invariant from 'invariant';
import hash from 'utils/hash';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';
import normalizeResource from 'modules/resources/utils/normalizeResource';
import getIdPropertyName from 'modules/resources/utils/getIdPropertyName';
import stripReadOnlyProperties from 'modules/resources/utils/stripReadOnlyProperties';
import stripWriteOnlyProperties from 'modules/resources/utils/stripWriteOnlyProperties';
import rethrowError from 'utils/rethrowError';

import { receiveEntities } from 'modules/entityStorage/actions';
import { now } from 'utils/sideEffects';

import {
	resourcesServiceSelector,
	resourcesModuleStateSelector,
} from 'modules/resources/selectors';

import {
	MERGE_RESOURCE,
	persistResource,
	receivePersistResourceSuccess,
	receivePersistResourceFailure,
} from '../actions';
import {
	normalizedLinkSelectorFactory,
	resourceSchemaSelectorFactory,
	resourceSelectorFactory,
} from '../selectors';

import findRelationLinkName from 'modules/resources/utils/findRelationLinkName';
import { INTERNAL_ID_PROPERTY_NAME } from 'modules/resources/constants';

// TODO rename `collectionLink` to `parentLink`
export function *mergeResourceTask({ payload: { link, data: inputData, collectionLink } }) {
	// determine model name of resource
	const resourceSchema = link ? yield select(resourceSchemaSelectorFactory(link)) : undefined;
	let collectionResourceSchema;
	if (collectionLink) {
		collectionResourceSchema = yield select(resourceSchemaSelectorFactory(collectionLink));
	}

	let finalResourceSchema = resourceSchema || resolveSubschema(collectionResourceSchema, 'items');

	// determine id property of model by name
	let idPropertyName = getIdPropertyName(finalResourceSchema);
	// let resourceHasOwnIdProperty = true;
	if (!idPropertyName) {
		idPropertyName = INTERNAL_ID_PROPERTY_NAME;
		finalResourceSchema = {
			...finalResourceSchema,
			properties: {
				...g(finalResourceSchema, 'properties', {}),
				[INTERNAL_ID_PROPERTY_NAME]: {
					type: 'string',
				},
			},
			'x-idPropertyName': INTERNAL_ID_PROPERTY_NAME,
		};
		// resourceHasOwnIdProperty = false;
	}

	// patch data
	const idValueFormLink = g(link, ['params', idPropertyName]);
	const idValueFormData = g(inputData, idPropertyName);
	invariant(
		!(idValueFormLink && idValueFormData),
		'mergeEntityFlow: do not set both `link` and entity id in merged data',
	);
	let data = inputData;
	if (idValueFormLink) {
		data = {
			...data,
			[idPropertyName]: idValueFormLink,
		};
	}
	if (!g(data, idPropertyName)) {
		const r = yield call(Math.random);
		data = {
			...data,
			[idPropertyName]: hash({ data, r }),
		};
	}


	let selfLink = link;
	let selfLinkName = g(link, 'name');
	if (!selfLink) {
		// determine resource self link
		selfLinkName = findRelationLinkName(
			finalResourceSchema,
			'self',
		);
		selfLink = yield select(
			normalizedLinkSelectorFactory(
				{
					name: selfLinkName,
					params: data,
				}
			)
		);
	}

	invariant(selfLink, 'Could not compute self link for name `%s`', selfLinkName);

	let resource = yield select(resourceSelectorFactory(selfLink));

	//
	// Normalize entity data.
	//
	const dataToReceive = stripWriteOnlyProperties(data, finalResourceSchema);
	const {
		result: resourceNormalizationResult,
		entities: normalizedEntities,
	} = normalizeResource(
		dataToReceive,
		finalResourceSchema,
	);

	const validAtTime = yield call(now);
	yield put(
		receiveEntities(
			{
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
				content: resourceNormalizationResult,
				collectionLink,
			}
		)
	);

	resource = yield select(resourceSelectorFactory(selfLink));
	const apiDescription = yield select(resourcesModuleStateSelector);

	const ApiService = yield select(resourcesServiceSelector);

	const dataToTransfer = stripReadOnlyProperties(data, finalResourceSchema);

	let callResult;
	if (resource && !resource.transient) {
		// we have candidate resource to PUT to
		try {
			callResult = yield call(
				ApiService.putResource,
				{
					apiDescription,
					link: selfLink,
					data: dataToTransfer,
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
					data: dataToTransfer,
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

	callResult = {
		...selfLink.params,
		...callResult,
	};

	const receivedSelfLink = yield select(
		normalizedLinkSelectorFactory(
			{
				name: selfLinkName,
				params: callResult,
			}
		)
	);

	const {
		result: receivedResourceNormalizationResult,
		entities: receivedNormalizedEntities,
	} = normalizeResource(
		callResult,
		finalResourceSchema,
	);

	yield put(
		receiveEntities(
			{
				normalizedEntities: receivedNormalizedEntities,
				validAtTime: validAtTime.format(),
			}
		)
	);
	yield put(
		receivePersistResourceSuccess(
			{
				link: receivedSelfLink,
				content: receivedResourceNormalizationResult,
				collectionLink,
				transientLink: selfLink,
				transientContent: resourceNormalizationResult,
			}
		)
	);
}

export default function *mergeResourceFlow() {
	yield takeEvery(MERGE_RESOURCE, mergeResourceTask);
}
