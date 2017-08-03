'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _startsWith2 = require('lodash/startsWith');

var _startsWith3 = _interopRequireDefault(_startsWith2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var walkRoutes = function walkRoutes(to, routes, parentLocation) {
	var routeName = to.name;

	var matchedPathname = (0, _reduce3.default)(routes, function (locationAcc, route) {
		if (locationAcc) {
			return locationAcc;
		}
		if (routeName === (0, _get3.default)(route, 'name')) {
			return (0, _get3.default)(route, 'path', '');
		}
		var routeLocation = (0, _get3.default)(route, 'path', '');
		return walkRoutes(to, (0, _get3.default)(route, 'routes', []), (0, _startsWith3.default)(routeLocation[0], '/') ? routeLocation : parentLocation + '/' + routeLocation);
	}, null);
	if (!matchedPathname) {
		return null;
	}
	return (0, _startsWith3.default)(matchedPathname[0], '/') ? matchedPathname : parentLocation + '/' + matchedPathname;
};

var getPath = function getPath(to, routes) {
	if (!(0, _isObject3.default)(to) || !(0, _isString3.default)(to.name)) {
		return to;
	}
	var result = walkRoutes(to, routes, '');
	if (!result) {
		return undefined;
	}
	var _to$params = to.params,
	    params = _to$params === undefined ? {} : _to$params,
	    _to$query = to.query,
	    query = _to$query === undefined ? {} : _to$query;

	var queryStringParts = [];
	(0, _each3.default)(params, function (paramValue, paramKey) {
		var replaced = result.replace(new RegExp(':' + paramKey + '(?=/|$)'), paramValue);
		if (result === replaced) {
			if ((0, _isUndefined3.default)(paramValue)) {
				return;
			}
			// query param
			queryStringParts = [].concat((0, _toConsumableArray3.default)(queryStringParts), [paramKey + '=' + paramValue]);
		}
		result = replaced;
	});
	(0, _each3.default)(query, function (paramValue, paramKey) {
		queryStringParts = [].concat((0, _toConsumableArray3.default)(queryStringParts), [paramKey + '=' + paramValue]);
	});

	return '' + result + (queryStringParts.length ? '?' + queryStringParts.join('&') : '');
};

exports.default = getPath;