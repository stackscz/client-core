import { get as g } from 'lodash';
import { call, select, put, takeEvery } from 'redux-saga/effects';
import invariant from 'invariant';
import rethrowError from 'utils/rethrowError';
import getIdPropertyName from 'modules/resources/utils/getIdPropertyName';
import {
	resourcesModuleStateSelector,
	resourcesServiceSelector,
	resourceSelectorFactory,
	resourceSchemaSelectorFactory,
} from '../selectors';

import {
	DELETE_RESOURCE,
	receiveDeleteResourceSuccess,
	receiveDeleteResourceFailure,
	defineResource,
} from '../actions';

export function *deleteResourceTask({ payload: { link, collectionsLinks } }) {
	// const resourceContent = g(resource, 'content');
	const apiDescription = yield select(resourcesModuleStateSelector);
	const resourceSchema = yield select(resourceSchemaSelectorFactory(link));

	// determine id property of model by name
	const idPropertyName = getIdPropertyName(resourceSchema);
	const entityId = g(link, ['params', idPropertyName]);
	// invariant(entityId, 'Couldn\'t determine entityId to delete');

	let resource = yield select(resourceSelectorFactory(link));
	let resourceContent = g(resource, 'content');

	if (!resourceContent) {
		yield put(
			defineResource(
				{
					link,
					// content: entityId,
				}
			)
		);
	}

	resource = yield select(resourceSelectorFactory(link));
	resourceContent = g(resource, 'content');
	const ResourcesService = yield select(resourcesServiceSelector);
	try {
		yield call(
			ResourcesService.deleteResource,
			{
				apiDescription,
				link,
			}
		);
	} catch (error) {
		rethrowError(error);
		yield put(receiveDeleteResourceFailure({ link, error }));
		return;
	}

	yield put(receiveDeleteResourceSuccess({ link, collectionsLinks }));
}

export default function *deleteResourceFlow() {
	yield takeEvery(DELETE_RESOURCE, deleteResourceTask);
}
