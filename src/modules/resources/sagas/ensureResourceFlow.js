import { takeEvery } from 'redux-saga/effects';
import { put, select } from 'redux-saga/effects';

import {
	ENSURE_RESOURCE,
	fetchResource,
} from '../actions';

import {
	resourceSelectorFactory,
} from '../selectors';

export function* ensureResourceTask(action) {
	const { link, relations } = action.payload;

	// TODO implement invalidation ;)
	console.log('ENSURING RESOURCE', link);
	const resource = yield select(resourceSelectorFactory(link));
	if (!resource || (!resource.content && !resource.fetching)) {
		console.log('FETCHING RESOURCE', link, resource);
		yield put(fetchResource({ link, relations }));
	}
}

export default function* ensureResourceFlow() {
	yield takeEvery(ENSURE_RESOURCE, ensureResourceTask);
}
