import { get as g, isUndefined, identity } from 'lodash';
import { call, select, put, takeEvery } from 'redux-saga/effects';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';
import normalizeResource2 from 'modules/resources/utils/normalizeResource2';
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
	resourceSchemaSelectorFactory,
	resourceSelectorFactory,
} from '../selectors';

const mergeDataMutatorSelector = (state) => g(state, 'resources.mergeDataMutator', (data, link) => data);

export function *mergeResourceTask({ payload: { link, data: inputData, parentLink } }) {
	const apiDescription = yield select(resourcesModuleStateSelector);

	let resource = yield select(resourceSelectorFactory(link));
	if(resource && (resource.fetching || resource.persisting || resource.deleting)) {
		// resource busy
		console.log('resource busy');
		return;
	}

	const resourceSchema = link ? yield select(resourceSchemaSelectorFactory(link)) : undefined;
	let parentResourceSchema;
	if (parentLink) {
		parentResourceSchema = yield select(resourceSchemaSelectorFactory(parentLink));
	}

	let finalResourceSchema = resourceSchema || resolveSubschema(parentResourceSchema, 'items');

	const dataToReceive = stripWriteOnlyProperties(inputData, finalResourceSchema);
	const entities = normalizeResource2(
		finalResourceSchema,
		apiDescription.paths,
		link,
		dataToReceive,
	);

	const validAtTime = yield call(now);
	yield put(
		receiveEntities(
			{
				normalizedEntities: entities,
				validAtTime: validAtTime.format(),
			}
		)
	);
	yield put(
		persistResource(
			{
				link,
				transient: isUndefined(link) || g(resource, 'transient', true),
				parentLink,
			}
		)
	);

	resource = yield select(resourceSelectorFactory(link));

	const ApiService = yield select(resourcesServiceSelector);
	const mergeDataMutator = yield select(mergeDataMutatorSelector);

	const dataToTransfer = mergeDataMutator(stripReadOnlyProperties(inputData, finalResourceSchema), parentLink || link);

	let callResult;
	if (resource && !resource.transient) {
		// we have candidate resource to PUT to
		try {
			callResult = yield call(
				ApiService.putResource,
				{
					apiDescription,
					link,
					data: dataToTransfer,
				}
			);
		} catch (error) {
			rethrowError(error);
			yield put(
				receivePersistResourceFailure(
					{
						link,
						error,
					}
				)
			);
			return;
		}
	} else if (parentLink) {
		// we have candidate collection resource to POST to
		try {
			callResult = yield call(
				ApiService.postResource,
				{
					apiDescription,
					link: parentLink,
					data: dataToTransfer,
				}
			);
		} catch (error) {
			rethrowError(error);
			yield put(
				receivePersistResourceFailure(
					{
						link,
						parentLink,
						error,
					}
				)
			);
			return;
		}
	} else {
		throw new Error('Could not determine how to merge entity');
	}

	const receivedEntities = normalizeResource2(
		finalResourceSchema,
		apiDescription.paths,
		link,
		callResult,
	);

	yield put(
		receiveEntities(
			{
				normalizedEntities: receivedEntities,
				validAtTime: validAtTime.format(),
			}
		)
	);
	yield put(
		receivePersistResourceSuccess(
			{
				link,
				parentLink,
				// transientLink: selfLink,
			}
		)
	);
}

export default function *mergeResourceFlow() {
	yield takeEvery(MERGE_RESOURCE, mergeResourceTask);
}
