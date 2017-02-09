// @flow
import { takeLatest } from 'redux-saga';
import { take, fork, call, put, select, cancel } from 'redux-saga/effects';

import t from 'tcomb';
import hash from 'object-hash';
import type { Error } from 'client-core/src/utils/types/Error';

import rethrowError from 'client-core/src/utils/rethrowError';
import isOfType from 'client-core/src/utils/isOfType';
import { now } from 'client-core/src/utils/sideEffects';

import { apiContextSelector, apiServiceSelector } from 'client-core/src/modules/api/selectors';
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
	const ApiService = yield select(apiServiceSelector);
	const apiContext = yield select(apiContextSelector);
	const authContext = yield select(authContextSelector);
	let user = null;
	let freshAuthContext = authContext;
	try {
		({ user, authContext: freshAuthContext } = yield call(
			ApiService.refreshAuth,
			apiContext,
			authContext
		));
	} catch (error) {
		rethrowError(error);
		yield put(
			receiveRefreshIdentityFailure(error)
		);
		return;
	}

	const { userModelName } = yield select(authStateSelector);
	const originalUserId = yield select(userIdSelector);

	const {
		userId,
		entities,
	} = yield call(normalizeUserTask, user);

	if (userId) {
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
			receiveIdentity(userId, freshAuthContext)
		);
	} else {
		yield put(
			receiveIdentity(null, freshAuthContext)
		);
	}

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

export function* loginTask(credentials) {
	const apiService = yield select(apiServiceSelector);
	const apiContext = yield select(apiContextSelector);
	const authContext = yield select(authContextSelector);
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
	const ApiService = yield select(apiServiceSelector);
	const initialStateAuthContext = yield select(authContextSelector);
	const initialAuthContext = yield call(ApiService.getInitialAuthContext, initialStateAuthContext);
	yield put(
		initialize(initialAuthContext)
	);

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
	const entityDescriptorsInitialized = yield select(initializedSelector);
	if (!entityDescriptorsInitialized) {
		yield call(takeLatest, RECEIVE_ENTITY_DESCRIPTORS, authFlow);
	} else {
		yield call(authFlow);
	}
}

export function* watchRefreshIdentity() {
	yield call(takeLatest, REFRESH_IDENTITY, refreshIdentityTask);
}

export default [
	bootstrap,
	watchRefreshIdentity,
];
