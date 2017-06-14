'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Bundle = require('../components/Bundle');

var _Bundle2 = _interopRequireDefault(_Bundle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routeComponentFactory = function routeComponentFactory(load) {
	return function (props) {
		return _react2.default.createElement(
			_Bundle2.default,
			{ load: load },
			function (Comp) {
				return Comp ? _react2.default.createElement(Comp, props) : null;
			}
		);
	};
};

exports.default = routeComponentFactory;