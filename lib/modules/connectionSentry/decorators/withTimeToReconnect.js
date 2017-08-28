'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _branch2 = require('recompose/branch');

var _branch3 = _interopRequireDefault(_branch2);

var _lifecycle2 = require('recompose/lifecycle');

var _lifecycle3 = _interopRequireDefault(_lifecycle2);

var _withState2 = require('recompose/withState');

var _withState3 = _interopRequireDefault(_withState2);

var _withPropsOnChange2 = require('recompose/withPropsOnChange');

var _withPropsOnChange3 = _interopRequireDefault(_withPropsOnChange2);

var _compose2 = require('recompose/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _difference_in_seconds = require('date-fns/difference_in_seconds');

var _difference_in_seconds2 = _interopRequireDefault(_difference_in_seconds);

var _omitProps = require('../../../utils/omitProps');

var _omitProps2 = _interopRequireDefault(_omitProps);

var _withReconnectionTimer = require('./withReconnectionTimer');

var _withReconnectionTimer2 = _interopRequireDefault(_withReconnectionTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO rename to withReconnectionTimer
exports.default = (0, _compose3.default)((0, _withState3.default)('refreshInterval', 'setRefreshInterval', null), _withReconnectionTimer2.default, (0, _branch3.default)(function (_ref) {
	var reconnectionRetryAt = _ref.reconnectionRetryAt;
	return !!reconnectionRetryAt;
}, (0, _compose3.default)((0, _withState3.default)('now', 'setNow', function () {
	return new Date();
}), (0, _lifecycle3.default)({
	componentDidMount: function componentDidMount() {
		var _props = this.props,
		    setNow = _props.setNow,
		    setRefreshInterval = _props.setRefreshInterval;

		var ri = setInterval(function () {
			return setNow(new Date());
		}, 500);
		setRefreshInterval(ri);
	},
	componentWillUnmount: function componentWillUnmount() {
		var refreshInterval = this.props.refreshInterval;

		clearInterval(refreshInterval);
	}
}), (0, _withPropsOnChange3.default)(['now', 'reconnectionRetryAt'], function (_ref2) {
	var now = _ref2.now,
	    reconnectionRetryAt = _ref2.reconnectionRetryAt;

	return {
		reconnectionRetryInSeconds: reconnectionRetryAt ? Math.max(0, (0, _difference_in_seconds2.default)(reconnectionRetryAt, now)) : undefined
	};
}))), (0, _omitProps2.default)(['now', 'setNow', 'refreshInterval', 'setRefreshInterval', 'reconnectionRetryAt']));