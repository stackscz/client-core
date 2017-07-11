'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _createReducer;

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _createReducer2 = require('../../utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _hash = require('../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _actions = require('../resources/actions');

var _actions2 = require('./actions');

var _isInternalServerError = require('./utils/isInternalServerError');

var _isInternalServerError2 = _interopRequireDefault(_isInternalServerError);

var _isNetworkError = require('./utils/isNetworkError');

var _isNetworkError2 = _interopRequireDefault(_isNetworkError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createReducer3.default)(_tcomb2.default.struct({
	isOnline: _tcomb2.default.Boolean,
	reconnectProbeResourceLink: _tcomb2.default.maybe(_tcomb2.default.Object),
	reconnectProbeResourceRetriesCount: _tcomb2.default.Integer,
	reconnectProbeResourceLastFailureTime: _tcomb2.default.maybe(_tcomb2.default.String)
}), _seamlessImmutable2.default.from({
	isOnline: true,
	reconnectProbeResourceLink: null,
	reconnectProbeResourceRetriesCount: 0,
	reconnectProbeResourceLastFailureTime: null
}), (_createReducer = {}, (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_FETCH_RESOURCE_FAILURE, function (state, _ref) {
	var _ref$payload = _ref.payload,
	    link = _ref$payload.link,
	    error = _ref$payload.error,
	    timestamp = _ref$payload.timestamp;

	var current = (0, _get3.default)(state, 'reconnectProbeResourceLink');
	if (!current && ((0, _isNetworkError2.default)(error) || (0, _isInternalServerError2.default)(error))) {
		return state.set('reconnectProbeResourceLink', link).set('reconnectProbeResourceLastFailureTime', timestamp);
	} else if (current && (0, _hash2.default)(current) === (0, _hash2.default)(link) && !((0, _isNetworkError2.default)(error) || (0, _isInternalServerError2.default)(error))) {
		// not server nor network error, clear probe
		return state.set('reconnectProbeResourceLink', null).set('reconnectProbeResourceLastFailureTime', null);
	}
	return state;
}), (0, _defineProperty3.default)(_createReducer, _actions.FETCH_RESOURCE, function (state, _ref2) {
	var _ref2$payload = _ref2.payload,
	    link = _ref2$payload.link,
	    timestamp = _ref2$payload.timestamp;

	var current = (0, _get3.default)(state, 'reconnectProbeResourceLink');
	var reconnectProbeResourceRetriesCount = (0, _get3.default)(state, 'reconnectProbeResourceRetriesCount');
	if (current && (0, _hash2.default)(current) === (0, _hash2.default)(link)) {
		return state.set('reconnectProbeResourceRetriesCount', reconnectProbeResourceRetriesCount + 1).set('reconnectProbeResourceLastFailureTime', timestamp);
	}
	return state;
}), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_RESOURCE, function (state, _ref3) {
	var link = _ref3.payload.link;

	var current = (0, _get3.default)(state, 'reconnectProbeResourceLink');
	if (current && (0, _hash2.default)(current) === (0, _hash2.default)(link)) {
		return state.set('reconnectProbeResourceLink', null).set('reconnectProbeResourceRetriesCount', 0).set('reconnectProbeResourceLastFailureTime', null);
	}
	return state;
}), (0, _defineProperty3.default)(_createReducer, _actions2.CHECK_CONNECTION, function (state) {
	var reconnectProbeResourceRetriesCount = (0, _get3.default)(state, 'reconnectProbeResourceRetriesCount');
	if (reconnectProbeResourceRetriesCount) {
		return state.set('reconnectProbeResourceRetriesCount', reconnectProbeResourceRetriesCount - 1);
	}
	return state;
}), _createReducer), 'connectionSentry');