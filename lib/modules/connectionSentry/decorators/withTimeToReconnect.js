'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _recompose = require('recompose');

var _difference_in_seconds = require('date-fns/difference_in_seconds');

var _difference_in_seconds2 = _interopRequireDefault(_difference_in_seconds);

var _omitProps = require('../../../utils/omitProps');

var _omitProps2 = _interopRequireDefault(_omitProps);

var _withReconnectionTimer = require('./withReconnectionTimer');

var _withReconnectionTimer2 = _interopRequireDefault(_withReconnectionTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO rename to withReconnectionTimer
exports.default = (0, _recompose.compose)((0, _recompose.withState)('refreshInterval', 'setRefreshInterval', null), _withReconnectionTimer2.default, (0, _recompose.branch)(function (_ref) {
	var reconnectionRetryAt = _ref.reconnectionRetryAt;
	return !!reconnectionRetryAt;
}, (0, _recompose.compose)((0, _recompose.withState)('now', 'setNow', function () {
	return new Date();
}), (0, _recompose.lifecycle)({
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
}), (0, _recompose.withPropsOnChange)(['now', 'reconnectionRetryAt'], function (_ref2) {
	var now = _ref2.now,
	    reconnectionRetryAt = _ref2.reconnectionRetryAt;

	return {
		reconnectionRetryInSeconds: reconnectionRetryAt ? Math.max(0, (0, _difference_in_seconds2.default)(reconnectionRetryAt, now)) : undefined
	};
}))), (0, _omitProps2.default)(['now', 'setNow', 'refreshInterval', 'setRefreshInterval', 'reconnectionRetryAt']));