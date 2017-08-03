'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var toSelector = (0, _fastMemoize2.default)(function (_ref, path) {
	var name = _ref.name,
	    search = _ref.search,
	    to = (0, _objectWithoutProperties3.default)(_ref, ['name', 'search']);

	var pathParts = path.split('?');
	var pathQueryString = pathParts[1];
	return (0, _extends3.default)({}, to, {
		pathname: pathParts[0],
		search: search || (pathQueryString ? '?' + pathQueryString : '')
	});
});

var withLink = (0, _recompose.compose)((0, _recompose.shouldUpdate)(function (_ref2, _ref3) {
	var nextTo = _ref3.to,
	    nextProps = (0, _objectWithoutProperties3.default)(_ref3, ['to']);
	var to = _ref2.to,
	    props = (0, _objectWithoutProperties3.default)(_ref2, ['to']);

	var isToEqual = (0, _isEqual3.default)(to, nextTo);
	var isOthersShallowEqual = (0, _recompose.shallowEqual)(props, nextProps);
	var update = !isOthersShallowEqual || !isToEqual;
	return update;
}), (0, _reactRedux.connect)(function (_ref4) {
	var _ref4$routes = _ref4.routes,
	    routes = _ref4$routes === undefined ? {} : _ref4$routes,
	    _ref4$router = _ref4.router;
	_ref4$router = _ref4$router === undefined ? {} : _ref4$router;
	var location = _ref4$router.location;
	return { routes: routes, location: location };
}), (0, _recompose.withProps)(function (_ref5) {
	var to = _ref5.to,
	    routes = _ref5.routes,
	    location = _ref5.location,
	    _ref5$onlyActiveOnInd = _ref5.onlyActiveOnIndex,
	    onlyActiveOnIndex = _ref5$onlyActiveOnInd === undefined ? true : _ref5$onlyActiveOnInd;

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