'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _recompose = require('recompose');

var _reactRedux = require('react-redux');

var _dateFns = require('date-fns');

var _selectors = require('../selectors');

var _getBackoffSeconds = require('../utils/getBackoffSeconds');

var _getBackoffSeconds2 = _interopRequireDefault(_getBackoffSeconds);

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _recompose.compose)((0, _reactRedux.connect)(function (state) {
	var reconnectProbeResource = (0, _selectors.reconnectProbeResourceSelector)(state);
	var retriesCount = (0, _selectors.reconnectProbeResourceRetriesCountSelector)(state);
	var lastFailureTime = (0, _selectors.reconnectProbeResourceLastFailureTimeSelector)(state);
	return {
		hasError: !!(0, _get3.default)(reconnectProbeResource, 'error'),
		retriesCount: retriesCount,
		lastFailureTime: lastFailureTime
	};
}), (0, _recompose.withPropsOnChange)(['retriesCount', 'lastFailureTime'], function (_ref) {
	var retriesCount = _ref.retriesCount,
	    lastFailureTime = _ref.lastFailureTime;

	var reconnectionRetryAfter = (0, _getBackoffSeconds2.default)(retriesCount + 1);
	if (lastFailureTime) {
		return {
			reconnectionRetryAt: (0, _dateFns.addSeconds)(new Date(lastFailureTime), reconnectionRetryAfter)
		};
	}
	return {};
}), (0, _recompose.withHandlers)({
	handlerTryReconnect: function handlerTryReconnect(_ref2) {
		var dispatch = _ref2.dispatch;
		return function () {
			dispatch((0, _actions.checkConnection)());
		};
	}
}));