'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (shouldDoOrKeys, callback) {
	return function (BaseComponent) {
		var shouldDo = typeof shouldDoOrKeys === 'function' ? shouldDoOrKeys : function (props, nextProps) {
			return !(0, _recompose.shallowEqual)((0, _pick3.default)(props, shouldDoOrKeys), (0, _pick3.default)(nextProps, shouldDoOrKeys));
		};

		return (0, _recompose.lifecycle)({
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