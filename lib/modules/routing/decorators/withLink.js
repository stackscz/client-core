'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _startsWith2 = require('lodash/startsWith');

var _startsWith3 = _interopRequireDefault(_startsWith2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

var _reactRedux = require('react-redux');

var _utils = require('../../../utils');

var _getPath = require('../utils/getPath');

var _getPath2 = _interopRequireDefault(_getPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toSelector = (0, _fastMemoize2.default)(function (to, pathname) {
	return (0, _extends3.default)({}, to, { pathname: pathname });
});

var withLink = (0, _recompose.compose)((0, _recompose.shouldUpdate)(function (_ref, _ref2) {
	var nextTo = _ref2.to,
	    nextProps = (0, _objectWithoutProperties3.default)(_ref2, ['to']);
	var to = _ref.to,
	    props = (0, _objectWithoutProperties3.default)(_ref, ['to']);

	var isToEqual = (0, _isEqual3.default)(to, nextTo);
	var isOthersShallowEqual = (0, _recompose.shallowEqual)(props, nextProps);
	// if (!isOthersShallowEqual) {
	// 	debugger;
	// }
	console.log('isToEqual', isToEqual);
	console.log('isOthersShallowEqual', isOthersShallowEqual);
	var update = !isOthersShallowEqual || !isToEqual;
	console.log('update', update, to);
	return update;
}), (0, _reactRedux.connect)(function (_ref3) {
	var _ref3$routes = _ref3.routes,
	    routes = _ref3$routes === undefined ? {} : _ref3$routes,
	    _ref3$router = _ref3.router;
	_ref3$router = _ref3$router === undefined ? {} : _ref3$router;
	var location = _ref3$router.location;
	return { routes: routes, location: location };
}), (0, _recompose.withProps)(function (_ref4) {
	var to = _ref4.to,
	    routes = _ref4.routes,
	    location = _ref4.location,
	    _ref4$onlyActiveOnInd = _ref4.onlyActiveOnIndex,
	    onlyActiveOnIndex = _ref4$onlyActiveOnInd === undefined ? true : _ref4$onlyActiveOnInd;

	if ((0, _isObject3.default)(to)) {
		var matchResult = (0, _getPath2.default)(to, routes) || '';
		if (!matchResult) {
			console.warn('Could not find route for ', to);
		}
		var pathname = matchResult.split('?')[0];
		return {
			to: to ? toSelector(to, matchResult) : '/',
			isActive: onlyActiveOnIndex ? pathname === location.pathname : (0, _startsWith3.default)(location.pathname, pathname)
		};
	}
	return {};
}), (0, _utils.omitProps)(['routes', 'location']));

exports.default = withLink;