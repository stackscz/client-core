import { takeEvery } from 'redux-saga';
// import { call, put, select } from 'redux-saga/effects';
import { call, put } from 'redux-saga/effects';

import {
	ENSURE_RESOURCE,
	fetchResource,
} from '../actions';

// import {
// 	resourceSelectorFactory,
// } from '../selectors';

export function *ensureResourceTask(action) {
	const { link, relations } = action.payload;

	// TODO implement invalidation ;)
	// const resource = yield select(resourceSelectorFactory(link));
	// if (!resource || (!resource.content && !resource.fetching)) {
	yield put(fetchResource({ link, relations }));
	// }
}

export default function *ensureResourceFlow() {
	yield call(takeEvery, ENSURE_RESOURCE, ensureResourceTask);
}
