'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bundle = function (_Component) {
	(0, _inherits3.default)(Bundle, _Component);

	function Bundle() {
		var _ref;

		var _temp, _this, _ret;

		(0, _classCallCheck3.default)(this, Bundle);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Bundle.__proto__ || (0, _getPrototypeOf2.default)(Bundle)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			// short for "module" but that's a keyword in js, so "mod"
			mod: null
		}, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	}

	(0, _createClass3.default)(Bundle, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			this.load(this.props);
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (nextProps.load !== this.props.load) {
				this.load(nextProps);
			}
		}
	}, {
		key: 'load',
		value: function load(props) {
			var _this2 = this;

			this.setState({
				mod: null
			});
			props.load(function (mod) {
				_this2.setState({
					// handle both es imports and cjs
					mod: mod.default ? mod.default : mod
				});
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return this.state.mod ? this.props.children(this.state.mod) : null;
		}
	}]);
	return Bundle;
}(_react.Component);

exports.default = Bundle;