import { put, select, takeEvery } from 'redux-saga/effects';

import {
	ENSURE_RESOURCE,
	fetchResource,
} from '../actions';

import {
	resourceSelectorFactory,
	resourceDataSelectorFactory,
} from '../selectors';

export function* ensureResourceTask(action) {
	const { link, relations } = action.payload;

	// TODO implement invalidation ;)
	const resource = yield select(resourceSelectorFactory(link));
	const resourceData = yield select(resourceDataSelectorFactory(link));
	if (!resource.fetched && (!resourceData && !resource.error && !resource.fetching)) {
		yield put(fetchResource({ link, relations }));
	}
}

export default function* ensureResourceFlow() {
	yield takeEvery(ENSURE_RESOURCE, ensureResourceTask);
}
