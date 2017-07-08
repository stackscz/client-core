'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resourcesFailedOnServerErrorSelector = exports.resourcesFailedOnNetworkErrorSelector = exports.resourcesFailedOnErrorCodeSelectorFactory = exports.reconnectProbeResourceSelector = exports.reconnectProbeResourceLinkSelector = exports.reconnectProbeResourceLastFailureTimeSelector = exports.reconnectProbeResourceRetriesCountSelector = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _hash = require('../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reconnectProbeResourceRetriesCountSelector = exports.reconnectProbeResourceRetriesCountSelector = function reconnectProbeResourceRetriesCountSelector(state) {
	return (0, _get3.default)(state, 'connectionSentry.reconnectProbeResourceRetriesCount');
};

var reconnectProbeResourceLastFailureTimeSelector = exports.reconnectProbeResourceLastFailureTimeSelector = function reconnectProbeResourceLastFailureTimeSelector(state) {
	return (0, _get3.default)(state, 'connectionSentry.reconnectProbeResourceLastFailureTime');
};

var reconnectProbeResourceLinkSelector = exports.reconnectProbeResourceLinkSelector = function reconnectProbeResourceLinkSelector(state) {
	return (0, _get3.default)(state, 'connectionSentry.reconnectProbeResourceLink');
};

var reconnectProbeResourceSelector = exports.reconnectProbeResourceSelector = function reconnectProbeResourceSelector(state) {
	var reconnectProbeResourceLink = reconnectProbeResourceLinkSelector(state);
	if (!reconnectProbeResourceLink) {
		return undefined;
	}
	return (0, _get3.default)(state, ['resources', 'resources', (0, _hash2.default)(reconnectProbeResourceLink)]);
};

var resourcesFailedOnErrorCodeSelectorFactory = exports.resourcesFailedOnErrorCodeSelectorFactory = function resourcesFailedOnErrorCodeSelectorFactory(targetErrorCode) {
	return function (state) {
		return (0, _reduce3.default)((0, _get3.default)(state, 'resources.resources'), function (acc, resource, resourceId) {
			var errorCode = (0, _get3.default)(resource, 'error.code');
			var requestMethod = (0, _get3.default)(resource, 'error.requestMethod');
			if (errorCode === targetErrorCode && requestMethod === 'GET') {
				return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, resourceId, resource));
			}
			return acc;
		}, {});
	};
};

var resourcesFailedOnNetworkErrorSelector = exports.resourcesFailedOnNetworkErrorSelector = resourcesFailedOnErrorCodeSelectorFactory(5000);
var resourcesFailedOnServerErrorSelector = exports.resourcesFailedOnServerErrorSelector = resourcesFailedOnErrorCodeSelectorFactory(500);