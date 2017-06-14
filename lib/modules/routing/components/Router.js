'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRouterRedux = require('react-router-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var history = _ref.history,
	    routes = _ref.routes;

	return _react2.default.createElement(
		_reactRouterRedux.ConnectedRouter,
		{ history: history },
		_react2.default.createElement(
			_reactRouterDom.Switch,
			null,
			routes.map(function (route, i) {
				return _react2.default.createElement(_reactRouterDom.Route, (0, _extends3.default)({ key: i }, route));
			})
		)
	);
};