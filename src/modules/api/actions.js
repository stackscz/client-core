export const SET_HOST = 'client-core/src/api/SET_HOST';
export function setHost(ssl, name) {
	return { type: SET_HOST, payload: { ssl, name } };
}
