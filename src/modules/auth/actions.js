export const INITIALIZE = 'client-core/src/auth/INITIALIZE';
export function initialize(context) {
	return { type: INITIALIZE, payload: { context } };
}

export const INITIALIZE_FINISH = 'client-core/src/auth/INITIALIZE_FINISH';
export function initializeFinish(context, userId) {
	return { type: INITIALIZE_FINISH, payload: { context, userId } };
}

// receive userId and auth context
export const REFRESH_IDENTITY = 'client-core/src/auth/REFRESH_IDENTITY';
export function refreshIdentity() {
	return { type: REFRESH_IDENTITY };
}

// receive userId and auth context
export const RECEIVE_IDENTITY = 'client-core/src/auth/RECEIVE_IDENTITY';
export function receiveIdentity(userId, context) {
	return { type: RECEIVE_IDENTITY, payload: { userId, context } };
}

export const RECEIVE_REFRESH_IDENTITY_FAILURE = 'client-core/src/auth/RECEIVE_REFRESH_IDENTITY_FAILURE';
export function receiveRefreshIdentityFailure(error) {
	return { type: RECEIVE_REFRESH_IDENTITY_FAILURE, payload: { error } };
}

// log user in using credentials
export const LOGIN = 'client-core/src/auth/LOGIN';
export function login(credentials) {
	return { type: LOGIN, payload: credentials };
}

// receive login success
export const RECEIVE_LOGIN_SUCCESS = 'client-core/src/auth/RECEIVE_LOGIN_SUCCESS';
export function receiveLoginSuccess(userId, context) {
	return { type: RECEIVE_LOGIN_SUCCESS, payload: { userId, context } };
}

// receive login error
export const RECEIVE_LOGIN_FAILURE = 'client-core/src/auth/RECEIVE_LOGIN_FAILURE';
export function receiveLoginFailure(error) {
	return { type: RECEIVE_LOGIN_FAILURE, payload: { error } };
}

// explicit logout
export const LOGOUT = 'client-core/src/auth/LOGOUT';
export function logout() {
	return { type: LOGOUT };
}

export const RECEIVE_LOGOUT_SUCCESS = 'client-core/src/auth/RECEIVE_LOGOUT_SUCCESS';
export function receiveLogoutSuccess(context) {
	return { type: RECEIVE_LOGOUT_SUCCESS, payload: { context } };
}

export const RECEIVE_LOGOUT_FAILURE = 'client-core/src/auth/RECEIVE_LOGOUT_FAILURE';
export function receiveLogoutFailure(error) {
	return { type: RECEIVE_LOGOUT_FAILURE, payload: { error } };
}
