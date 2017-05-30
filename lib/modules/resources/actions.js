'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.defineResource = defineResource;
exports.ensureResource = ensureResource;
exports.fetchResource = fetchResource;
exports.receiveFetchResourceFailure = receiveFetchResourceFailure;
exports.receiveResource = receiveResource;
exports.mergeResource = mergeResource;
exports.persistResource = persistResource;
exports.receivePersistResourceSuccess = receivePersistResourceSuccess;
exports.receivePersistResourceFailure = receivePersistResourceFailure;
exports.deleteResource = deleteResource;
exports.receiveDeleteResourceFailure = receiveDeleteResourceFailure;
exports.receiveDeleteResourceSuccess = receiveDeleteResourceSuccess;
exports.forgetResource = forgetResource;
var DEFINE_RESOURCE = exports.DEFINE_RESOURCE = 'client-core/resources/DEFINE_RESOURCE';
function defineResource(_ref) {
	var link = _ref.link,
	    content = _ref.content;

	return { type: DEFINE_RESOURCE, payload: { link: link, content: content } };
}

var ENSURE_RESOURCE = exports.ENSURE_RESOURCE = 'client-core/resources/ENSURE_RESOURCE';
function ensureResource(_ref2) {
	var link = _ref2.link,
	    relations = _ref2.relations;

	return { type: ENSURE_RESOURCE, payload: { link: link, relations: relations } };
}

var FETCH_RESOURCE = exports.FETCH_RESOURCE = 'client-core/resources/FETCH_RESOURCE';
function fetchResource(_ref3) {
	var link = _ref3.link,
	    relations = _ref3.relations;

	return { type: FETCH_RESOURCE, payload: { link: link, relations: relations } };
}

var RECEIVE_FETCH_RESOURCE_FAILURE = exports.RECEIVE_FETCH_RESOURCE_FAILURE = 'client-core/resources/RECEIVE_FETCH_RESOURCE_FAILURE';
function receiveFetchResourceFailure(_ref4) {
	var link = _ref4.link,
	    error = _ref4.error;

	return { type: RECEIVE_FETCH_RESOURCE_FAILURE, payload: { link: link, error: error } };
}

var RECEIVE_RESOURCE = exports.RECEIVE_RESOURCE = 'client-core/resources/RECEIVE_RESOURCE';
function receiveResource(_ref5) {
	var link = _ref5.link,
	    transientLink = _ref5.transientLink;

	return { type: RECEIVE_RESOURCE, payload: { link: link, transientLink: transientLink } };
}

var MERGE_RESOURCE = exports.MERGE_RESOURCE = 'client-core/resources/MERGE_RESOURCE';
function mergeResource(_ref6) {
	var link = _ref6.link,
	    data = _ref6.data,
	    parentLink = _ref6.parentLink;

	return { type: MERGE_RESOURCE, payload: { link: link, data: data, parentLink: parentLink } };
}

var PERSIST_RESOURCE = exports.PERSIST_RESOURCE = 'client-core/resources/PERSIST_RESOURCE';
function persistResource(_ref7) {
	var link = _ref7.link,
	    transient = _ref7.transient,
	    parentLink = _ref7.parentLink;

	return { type: PERSIST_RESOURCE, payload: { link: link, transient: transient, parentLink: parentLink } };
}

var RECEIVE_PERSIST_RESOURCE_SUCCESS = exports.RECEIVE_PERSIST_RESOURCE_SUCCESS = 'client-core/resources/RECEIVE_PERSIST_RESOURCE_SUCCESS';
function receivePersistResourceSuccess(_ref8) {
	var link = _ref8.link,
	    content = _ref8.content,
	    parentLink = _ref8.parentLink,
	    transientLink = _ref8.transientLink,
	    transientContent = _ref8.transientContent;

	return {
		type: RECEIVE_PERSIST_RESOURCE_SUCCESS,
		payload: { link: link, content: content, parentLink: parentLink, transientLink: transientLink, transientContent: transientContent }
	};
}

var RECEIVE_PERSIST_RESOURCE_FAILURE = exports.RECEIVE_PERSIST_RESOURCE_FAILURE = 'client-core/resources/RECEIVE_PERSIST_RESOURCE_FAILURE';
function receivePersistResourceFailure(_ref9) {
	var link = _ref9.link,
	    error = _ref9.error;

	return { type: RECEIVE_PERSIST_RESOURCE_FAILURE, payload: { link: link, error: error } };
}

var DELETE_RESOURCE = exports.DELETE_RESOURCE = 'client-core/resources/DELETE_RESOURCE';
function deleteResource(_ref10) {
	var link = _ref10.link,
	    collectionsLinks = _ref10.collectionsLinks;

	return { type: DELETE_RESOURCE, payload: { link: link, collectionsLinks: collectionsLinks } };
}

var RECEIVE_DELETE_RESOURCE_FAILURE = exports.RECEIVE_DELETE_RESOURCE_FAILURE = 'client-core/resources/RECEIVE_DELETE_RESOURCE_FAILURE';
function receiveDeleteResourceFailure(_ref11) {
	var link = _ref11.link,
	    error = _ref11.error;

	return { type: RECEIVE_DELETE_RESOURCE_FAILURE, payload: { link: link, error: error } };
}

var RECEIVE_DELETE_RESOURCE_SUCCESS = exports.RECEIVE_DELETE_RESOURCE_SUCCESS = 'client-core/resources/RECEIVE_DELETE_RESOURCE_SUCCESS';
function receiveDeleteResourceSuccess(_ref12) {
	var link = _ref12.link,
	    collectionsLinks = _ref12.collectionsLinks;

	return { type: RECEIVE_DELETE_RESOURCE_SUCCESS, payload: { link: link, collectionsLinks: collectionsLinks } };
}

var FORGET_RESOURCE = exports.FORGET_RESOURCE = 'client-core/resources/FORGET_RESOURCE';
function forgetResource(_ref13) {
	var link = _ref13.link,
	    collectionsLinks = _ref13.collectionsLinks;

	return { type: FORGET_RESOURCE, payload: { link: link, collectionsLinks: collectionsLinks } };
}