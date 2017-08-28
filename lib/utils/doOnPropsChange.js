'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _shallowEqual2 = require('recompose/shallowEqual');

var _shallowEqual3 = _interopRequireDefault(_shallowEqual2);

var _lifecycle2 = require('recompose/lifecycle');

var _lifecycle3 = _interopRequireDefault(_lifecycle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (shouldDoOrKeys, callback) {
	return function (BaseComponent) {
		var shouldDo = typeof shouldDoOrKeys === 'function' ? shouldDoOrKeys : function (props, nextProps) {
			return !(0, _shallowEqual3.default)((0, _pick3.default)(props, shouldDoOrKeys), (0, _pick3.default)(nextProps, shouldDoOrKeys));
		};

		return (0, _lifecycle3.default)({
			componentWillMount: function componentWillMount() {
				if (shouldDo({}, this.props)) {
					callback(this.props, {});
				}
			},
			componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
				if (shouldDo(this.props, nextProps)) {
					callback(nextProps, this.props);
				}
			}
		})(BaseComponent);
	};
};