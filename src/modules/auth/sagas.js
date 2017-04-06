// @flow
import { takeLatest } from 'redux-saga';
import { take, fork, call, race, put, select, cancel } from 'redux-saga/effects';

import t from 'tcomb';
import hash from 'object-hash';
import type { Error } from 'client-core/src/utils/types/Error';

import rethrowError from 'client-core/src/utils/rethrowError';
import isOfType from 'client-core/src/utils/isOfType';
import { now } from 'client-core/src/utils/sideEffects';

// import { apiContextSelector, apiServiceSelector } from 'client-core/src/modules/api/selectors';
import {
	modelSchemaSelectorFactory,
	modelIdPropertyNameSelectorFactory,
	initializedSelector,
} from 'client-core/src/modules/entityDescriptors/selectors';
import {
	RECEIVE_ENTITY_DESCRIPTORS,
} from 'client-core/src/modules/entityDescriptors/actions';

import normalize from 'client-core/src/modules/resources/utils/normalize';
import {
	fetchResource,
	RECEIVE_RESOURCE,
	RECEIVE_FETCH_RESOURCE_FAILURE,

	mergeResource,
	RECEIVE_PERSIST_RESOURCE_SUCCESS,
	RECEIVE_PERSIST_RESOURCE_FAILURE,

} from 'client-core/src/modules/resources/actions';

import {
	receiveEntities,
	forgetEntity,
} from 'client-core/src/modules/entityStorage/actions';

import {
	authStateSelector,
	authContextSelector,
	userIdSelector,
} from './selectors';
import {
	LOGIN,
	RECEIVE_IDENTITY,
	RECEIVE_LOGIN_FAILURE,
	LOGOUT,
	REFRESH_IDENTITY,
	initialize,
	initializeFinish,
	receiveIdentity,
	receiveLoginSuccess,
	receiveLoginFailure,
	receiveLogoutSuccess,
	receiveLogoutFailure,
	receiveRefreshIdentityFailure,
} from './actions';

export function* normalizeUserTask(user) {
	if (!isOfType(user, t.Object)) {
		return {
			userId: null,
		};
	}
	const { userModelName } = yield select(authStateSelector);
	const userSchemaSelector = modelSchemaSelectorFactory(userModelName);
	const userSchema = yield select(userSchemaSelector);
	const {
		result: userId,
		entities,
	} = normalize(
		user,
		userSchema
	);
	return {
		userId,
		entities,
	};
}

export function* refreshIdentityTask() {
	// const ApiService = yield select(apiServiceSelector);
	// const apiContext = yield select(apiContextSelector);
	// const authContext = yield select(authContextSelector);

	debugger;

	const userLink = yield select((state) => state.auth.userLink);

	yield put(
		fetchResource(
			{
				link: userLink
			}
		)
	);

	const { success, failure } = yield race(
		{
			success: take(({ type, payload: { link } = {}}) => type === RECEIVE_RESOURCE && hash(link) === hash(userLink)),
			failure: take(({ type, payload: { link } = {}}) => type === RECEIVE_FETCH_RESOURCE_FAILURE && hash(link) === hash(userLink)),
		}
	);

	if (failure) {
		const { payload: { error } } = failure;
		yield put(
			receiveRefreshIdentityFailure(error)
		);
	}
}

export function* loginTask(credentials) {

	yield put(
		mergeResource(
			{
				collectionLink: {
					name: 'logins',
				},
				data: {
					...credentials,
				}
			}
		)
	);

	const { success, failure } = yield race(
		{
			success: take(({ type, payload: { link } = {} }) => type === RECEIVE_PERSIST_RESOURCE_SUCCESS && link.name === 'LoginAttempt'),
			failure: take(({ type, payload: { link } = {} }) => type === RECEIVE_PERSIST_RESOURCE_FAILURE && link.name === 'LoginAttempt'),
		}
	);

	if (failure) {
		const { payload: { error } } = failure;
		yield put(
			receiveLoginFailure(error)
		);
	} else {
		yield call(refreshIdentityTask);
		// yield put(
		// 	receiveLoginSuccess(userId, freshAuthContext)
		// );
	}


	return


	// const apiService = yield select(apiServiceSelector);
	// const apiContext = yield select(apiContextSelector);
	// const authContext = yield select(authContextSelector);
	let user = null;
	let freshAuthContext = authContext;
	try {
		({ user, authContext: freshAuthContext } = yield call(
			apiService.login,
			credentials,
			apiContext,
			freshAuthContext
		));
	} catch (apiCallError) {
		rethrowError(apiCallError);
		if (!isOfType(apiCallError, Error)) {
			yield put(
				receiveLoginFailure(
					{
						code: 5000,
						message: 'Invalid error response',
						originalResponse: apiCallError,
					}
				)
			);
			return;
		}
		yield put(
			receiveLoginFailure(apiCallError)
		);
		return;
	}


	// TODO validate user type

	const {
		userId,
		entities,
	} = yield call(normalizeUserTask, user);

	const { userModelName } = yield select(authStateSelector);
	const originalUserId = yield select(userIdSelector);

	const modelIdPropertyNameSelector = yield call(modelIdPropertyNameSelectorFactory, userModelName);
	const userIdPropertyName = yield select(modelIdPropertyNameSelector);
	const where = { [userIdPropertyName]: userId };
	const refs = {
		[userModelName]: {
			[hash(where)]: {
				where,
				entityId: userId,
			},
		},
	};

	const time = yield call(now);

	yield put(
		receiveEntities(
			{ refs, normalizedEntities: entities, validAtTime: time.format() }
		)
	);
	yield put(
		receiveLoginSuccess(userId, freshAuthContext)
	);

	if (originalUserId && originalUserId !== userId) {
		yield put(
			forgetEntity(
				{
					modelName: userModelName,
					entityId: originalUserId,
				}
			)
		);
	}
}

export function* logoutTask() {







	yield put(
		mergeResource(
			{
				collectionLink: {
					name: 'logouts',
				},
			}
		)
	);

	const { success, failure } = yield race(
		{
			success: take(({ type, payload: { link } = {} }) => type === RECEIVE_PERSIST_RESOURCE_SUCCESS && link.name === 'LogoutAttempt'),
			failure: take(({ type, payload: { link } = {} }) => type === RECEIVE_PERSIST_RESOURCE_FAILURE && link.name === 'LogoutAttempt'),
		}
	);

	if (failure) {
		const { payload: { error } } = failure;
		yield put(
			receiveRefreshIdentityFailure(error)
		);
	} else {
		debugger;
		yield call(refreshIdentityTask);
	}









	return;



	const apiService = yield select(apiServiceSelector);
	const authContext = yield select(authContextSelector);
	const apiContext = yield select(apiContextSelector);
	let freshAuthContext = authContext;
	try {
		freshAuthContext = yield call(apiService.logout, apiContext, freshAuthContext);
	} catch (apiCallError) {
		rethrowError(apiCallError);
		if (!isOfType(apiCallError, Error)) {
			yield put(
				receiveLogoutFailure(
					{
						code: 5000,
						message: 'Unknown error on logout',
						originalResponse: apiCallError,
					}
				)
			);
			return;
		}
		yield put(receiveLogoutFailure(apiCallError));
		return;
	}

	const { userModelName } = yield select(authStateSelector);
	const originalUserId = yield select(userIdSelector);

	yield put(
		receiveLogoutSuccess(freshAuthContext)
	);

	yield put(
		forgetEntity(
			{
				modelName: userModelName,
				entityId: originalUserId,
			}
		)
	);
}

export function* authFlow() {
	// get initial state from ApiService
	// const ApiService = yield select(apiServiceSelector);
	// const initialStateAuthContext = yield select(authContextSelector);
	// const initialAuthContext = yield call(ApiService.getInitialAuthContext, initialStateAuthContext);
	// yield put(
	// 	initialize(initialAuthContext)
	// );

	yield call(refreshIdentityTask);

	const freshAuthContext = yield select(authContextSelector);
	yield put(
		initializeFinish(freshAuthContext)
	);

	while (true) { // eslint-disable-line no-constant-condition
		let loginTaskInstance = null;
		let logoutTaskInstance;
		const action = yield take([LOGIN, LOGOUT, RECEIVE_LOGIN_FAILURE, RECEIVE_IDENTITY]);
		switch (action.type) {
			case LOGIN:
				loginTaskInstance = yield fork(loginTask, action.payload);
				if (logoutTaskInstance) {
					yield cancel(logoutTaskInstance);
				}
				break;
			case LOGOUT:
				if (loginTaskInstance) {
					yield cancel(loginTaskInstance);
				}
				logoutTaskInstance = yield call(logoutTask);
				break;
			default:
				break;
		}
	}
}

export function* bootstrap() {
	// const entityDescriptorsInitialized = yield select(initializedSelector);
	// if (!entityDescriptorsInitialized) {
	// 	yield call(takeLatest, RECEIVE_ENTITY_DESCRIPTORS, authFlow);
	// } else {
	yield call(authFlow);
	// }
}

export function* watchRefreshIdentity() {
	yield call(takeLatest, REFRESH_IDENTITY, refreshIdentityTask);
}

export default [
	bootstrap,
	watchRefreshIdentity,
];
