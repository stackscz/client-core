import { get as g, map } from 'lodash';
import { delay, eventChannel, END } from 'redux-saga';
import { takeLatest, takeEvery, take, put, select, fork, call, race } from 'redux-saga/effects';

import { resourceSelectorFactory, resourceByIdSelectorFactory } from 'modules/resources/selectors';
import hash from 'utils/hash';

import {
	RECEIVE_FETCH_RESOURCE_FAILURE,
	RECEIVE_RESOURCE,
	fetchResource,
} from 'modules/resources/actions';
// import { setOnlineStatus } from 'modules/connectionSentry/actions';
import {
	reconnectProbeResourceLinkSelector,
	reconnectProbeResourceRetriesCountSelector,
	resourcesFailedOnServerErrorSelector,
	resourcesFailedOnNetworkErrorSelector,
} from 'modules/connectionSentry/selectors';
import {
	CHECK_CONNECTION,
	checkConnection,
} from './actions';

import getBackoffSeconds from './utils/getBackoffSeconds';

const ONLINE_STATUS_ONLINE = 'ONLINE';
const ONLINE_STATUS_OFFLINE = 'OFFLINE';

const takeResourceActionTestFactory = (actionType, actionLink) => ({ type, payload: { link } = {} }) => {
	return type === actionType && hash(link) === hash(actionLink);
};

const createOnlineStatusChannel = () => {
	return eventChannel(
		(emitter) => {
			const unsubOnline = window.addEventListener('offline', (e) => {
				console.log(e);
				emitter({ payload: ONLINE_STATUS_OFFLINE });
			});

			const unsubOffline = window.addEventListener('online', (e) => {
				console.log(e);
				emitter({ payload: ONLINE_STATUS_ONLINE });
			});

			return () => {
				unsubOnline();
				unsubOffline();
			};
		},
	);
};

function* watchOnlineStatus() {
	const ch = createOnlineStatusChannel();
	while (true) {
		const { payload } = yield take(ch);
		if (payload === ONLINE_STATUS_ONLINE) {
			yield put(checkConnection());
		}
	}
}

function* handleReconnectTask() {
	// start watching exponential backoff on failed resource
	const reconnectProbeResourceRetriesCount = yield select(reconnectProbeResourceRetriesCountSelector);
	yield race(
		{
			delay: call(delay, getBackoffSeconds(reconnectProbeResourceRetriesCount + 1) * 1000),
			manualRetry: take(CHECK_CONNECTION),
		},
	);
	const reconnectProbeResourceLink = yield select((state) => state.connectionSentry.reconnectProbeResourceLink);
	if (reconnectProbeResourceLink) {
		yield put(fetchResource({ link: reconnectProbeResourceLink }));
	}

	const { success } = yield race(
		{
			success: take(takeResourceActionTestFactory(RECEIVE_RESOURCE, reconnectProbeResourceLink)),
			failure: take(takeResourceActionTestFactory(RECEIVE_FETCH_RESOURCE_FAILURE, reconnectProbeResourceLink)),
		}
	);

	if (success) {
		// console.warn('REFETCH ALL FAILED RESOURCES');
		const s = yield select(resourcesFailedOnServerErrorSelector);
		const n = yield select(resourcesFailedOnNetworkErrorSelector);
		const failedResources = { ...s, ...n };
		const r = map(
			failedResources,
			(failedResource) => put(fetchResource({ link: failedResource.link })),
		);
		yield r;
	}
}

function* watchServerOrNetworkFetchError() {
	// watch for severely failed (err. code 500 er 5000) resource GET
	yield takeEvery(
		({ type, payload }) => {
			if (type === RECEIVE_FETCH_RESOURCE_FAILURE) {
				const errorCode = g(payload, 'error.code', 5000);
				return errorCode === 500 || errorCode === 5000;
			}
			return false;
		},
		function* handleReconnectForProbeResourceTask(action) {
			const { payload: { link } } = action;
			const probeResourceLink = yield select(reconnectProbeResourceLinkSelector);
			const isProbeResource = hash(probeResourceLink) === hash(link);
			if (isProbeResource) {
				yield fork(handleReconnectTask, action);
			}
		},
	);
}

export default [
	watchServerOrNetworkFetchError,
	// watchFetchResourceSuccess,
	watchOnlineStatus,
];
