export const DEFINE_RESOURCE = 'client-core/resources/DEFINE_RESOURCE';
export function defineResource({ link, content }) {
	return { type: DEFINE_RESOURCE, payload: { link, content } };
}

export const ENSURE_RESOURCE = 'client-core/resources/ENSURE_RESOURCE';
export function ensureResource({ link, relations }) {
	return { type: ENSURE_RESOURCE, payload: { link, relations } };
}

export const FETCH_RESOURCE = 'client-core/resources/FETCH_RESOURCE';
export function fetchResource({ link, relations }) {
	return { type: FETCH_RESOURCE, payload: { link, relations } };
}

export const RECEIVE_FETCH_RESOURCE_FAILURE = 'client-core/resources/RECEIVE_FETCH_RESOURCE_FAILURE';
export function receiveFetchResourceFailure({ link, error }) {
	return { type: RECEIVE_FETCH_RESOURCE_FAILURE, payload: { link, error } };
}

export const RECEIVE_RESOURCE = 'client-core/resources/RECEIVE_RESOURCE';
export function receiveResource({ link, links, content }) {
	return { type: RECEIVE_RESOURCE, payload: { link, links, content } };
}

export const MERGE_RESOURCE = 'client-core/resources/MERGE_RESOURCE';
export function mergeResource({ link, data, collectionLink }) {
	return { type: MERGE_RESOURCE, payload: { link, data, collectionLink } };
}

export const PERSIST_RESOURCE = 'client-core/resources/PERSIST_RESOURCE';
export function persistResource({ link, transient, links, content, collectionLink }) {
	return { type: PERSIST_RESOURCE, payload: { link, transient, links, content, collectionLink } };
}

export const RECEIVE_PERSIST_RESOURCE_SUCCESS = 'client-core/resources/RECEIVE_PERSIST_RESOURCE_SUCCESS';
export function receivePersistResourceSuccess({ link, content, collectionLink, transientLink, transientContent }) {
	return {
		type: RECEIVE_PERSIST_RESOURCE_SUCCESS,
		payload: { link, content, collectionLink, transientLink, transientContent },
	};
}

export const RECEIVE_PERSIST_RESOURCE_FAILURE = 'client-core/resources/RECEIVE_PERSIST_RESOURCE_FAILURE';
export function receivePersistResourceFailure({ link, error }) {
	return { type: RECEIVE_PERSIST_RESOURCE_FAILURE, payload: { link, error } };
}

export const DELETE_RESOURCE = 'client-core/resources/DELETE_RESOURCE';
export function deleteResource({ link, collectionsLinks }) {
	return { type: DELETE_RESOURCE, payload: { link, collectionsLinks } };
}

export const RECEIVE_DELETE_RESOURCE_FAILURE = 'client-core/resources/RECEIVE_DELETE_RESOURCE_FAILURE';
export function receiveDeleteResourceFailure({ link, error }) {
	return { type: RECEIVE_DELETE_RESOURCE_FAILURE, payload: { link, error } };
}

export const RECEIVE_DELETE_RESOURCE_SUCCESS = 'client-core/resources/RECEIVE_DELETE_RESOURCE_SUCCESS';
export function receiveDeleteResourceSuccess({ link, collectionsLinks }) {
	return { type: RECEIVE_DELETE_RESOURCE_SUCCESS, payload: { link, collectionsLinks } };
}

export const FORGET_RESOURCE = 'client-core/resources/FORGET_RESOURCE';
export function forgetResource({ link, collectionsLinks }) {
	return { type: FORGET_RESOURCE, payload: { link, collectionsLinks } };
}
