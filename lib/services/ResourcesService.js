'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _upperCase2 = require('lodash/upperCase');

var _upperCase3 = _interopRequireDefault(_upperCase2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _ResourceLink = require('../modules/resources/types/ResourceLink');

var _modulesResourcesTypesResourceLink = _interopRequireWildcard(_ResourceLink);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _resolveResourceLink2 = require('../modules/resources/utils/resolveResourceLink');

var _resolveResourceLink3 = _interopRequireDefault(_resolveResourceLink2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResourceLink = _modulesResourcesTypesResourceLink.ResourceLink || _tcomb2.default.Any;


var mockApiCall = function mockApiCall(apiDescription) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    method = _ref.method,
	    data = _ref.data,
	    linkName = _ref.linkName,
	    linkParams = _ref.linkParams,
	    resourceSchema = _ref.resourceSchema,
	    definitions = _ref.definitions;

	var mockResources = (0, _get3.default)(apiDescription, 'mockResources');
	if (!mockResources) {
		return undefined;
	}
	var mockResource = (0, _get3.default)(mockResources, linkName);
	if (!(0, _isFunction3.default)(mockResource)) {
		return undefined;
	}
	return _promise2.default.resolve(mockResource({
		method: method,
		data: data,
		linkName: linkName,
		linkParams: linkParams,
		resourceSchema: resourceSchema,
		definitions: definitions
	}));
};

var successResponseHandlerFactory = function successResponseHandlerFactory(_ref2) {
	var method = _ref2.method,
	    resolvedLink = _ref2.resolvedLink;
	return function (response) {
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    url = resolvedLink.url,
		    queryParams = resolvedLink.queryParams,
		    resourceSchema = resolvedLink.resourceSchema;

		console.log('Mock request finished loading: ' + method + ' ' + (0, _stringify2.default)(url));
		return (0, _get3.default)(response, 'data');
	};
};

var errorResponseHandlerFactory = function errorResponseHandlerFactory(messageFactory) {
	return function (error) {
		// CORS errors are opaque - https://github.com/mzabriskie/axios/issues/838
		var errorCode = (0, _get3.default)(error, 'response.status', 5000);
		var responseData = (0, _get3.default)(error, 'response.data');
		var requestMethod = (0, _upperCase3.default)((0, _get3.default)(error, 'config.method'));
		throw {
			code: errorCode,
			data: responseData,
			message: messageFactory ? messageFactory({ errorCode: errorCode, responseData: responseData }) : 'Request Failed',
			requestMethod: requestMethod
		};
	};
};

var service = {
	getResource: function getResource(_ref3) {
		var link = _ref3.link,
		    apiDescription = _ref3.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    url = resolvedLink.url,
		    queryParams = resolvedLink.queryParams,
		    resourceSchema = resolvedLink.resourceSchema;


		var apiCall = mockApiCall(apiDescription, {
			method: 'GET',
			linkName: name,
			linkParams: params,
			params: params,
			resourceSchema: resourceSchema,
			definitions: (0, _get3.default)(apiDescription, 'definitions')
		});
		if (!apiCall) {
			apiCall = _axios2.default.get(url, { params: queryParams });
		}

		return apiCall.then(successResponseHandlerFactory({ resolvedLink: resolvedLink, method: 'GET' })).catch(errorResponseHandlerFactory(function (_ref4) {
			var errorCode = _ref4.errorCode;
			return errorCode + ': GET resource failed';
		}));
	},
	postResource: function postResource(_ref5) {
		var link = _ref5.link,
		    data = _ref5.data,
		    apiDescription = _ref5.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    queryParams = resolvedLink.queryParams,
		    url = resolvedLink.url,
		    resourceSchema = resolvedLink.resourceSchema;


		var apiCall = mockApiCall(apiDescription, {
			method: 'POST',
			data: data,
			linkName: name,
			linkParams: params,
			params: params,
			resourceSchema: resourceSchema,
			definitions: (0, _get3.default)(apiDescription, 'definitions')
		});
		if (!apiCall) {
			apiCall = _axios2.default.post(url, data, {
				params: queryParams
			});
		}

		return apiCall.then(successResponseHandlerFactory({ resolvedLink: resolvedLink, method: 'POST' })).catch(errorResponseHandlerFactory(function (_ref6) {
			var errorCode = _ref6.errorCode;
			return errorCode + ': POST resource failed';
		}));
	},
	putResource: function putResource(_ref7) {
		var link = _ref7.link,
		    data = _ref7.data,
		    apiDescription = _ref7.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    queryParams = resolvedLink.queryParams,
		    url = resolvedLink.url,
		    resourceSchema = resolvedLink.resourceSchema;


		var apiCall = mockApiCall(apiDescription, {
			method: 'PUT',
			data: data,
			linkName: name,
			linkParams: params,
			resourceSchema: resourceSchema,
			definitions: (0, _get3.default)(apiDescription, 'definitions')
		});
		if (!apiCall) {
			apiCall = _axios2.default.put(url, data, {
				params: queryParams
			});
		}

		return apiCall.then(successResponseHandlerFactory({ resolvedLink: resolvedLink, method: 'PUT' })).catch(errorResponseHandlerFactory(function (_ref8) {
			var errorCode = _ref8.errorCode;
			return errorCode + ': PUT resource failed';
		}));
	},
	deleteResource: function deleteResource(_ref9) {
		var link = _ref9.link,
		    data = _ref9.data,
		    apiDescription = _ref9.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    queryParams = resolvedLink.queryParams,
		    url = resolvedLink.url,
		    resourceSchema = resolvedLink.resourceSchema;


		var apiCall = mockApiCall(apiDescription, {
			method: 'DELETE',
			data: data,
			linkName: name,
			linkParams: params,
			resourceSchema: resourceSchema,
			definitions: (0, _get3.default)(apiDescription, 'definitions')
		});
		if (!apiCall) {
			apiCall = _axios2.default.delete(url, {
				params: queryParams
			});
		}
		return apiCall.then(successResponseHandlerFactory({ resolvedLink: resolvedLink, method: 'DELETE' })).catch(errorResponseHandlerFactory(function (_ref10) {
			var errorCode = _ref10.errorCode;
			return errorCode + ': DELETE resource failed';
		}));
	},
	resolveResourceLink: function resolveResourceLink(link, apiDescription) {
		_assert(link, ResourceLink, 'link');

		return (0, _resolveResourceLink3.default)(apiDescription, link);
	}
};

exports.default = service;

function _assert(x, type, name) {
	if (false) {
		_tcomb2.default.fail = function (message) {
			console.warn(message);
		};
	}

	if (_tcomb2.default.isType(type) && type.meta.kind !== 'struct') {
		if (!type.is(x)) {
			type(x, [name + ': ' + _tcomb2.default.getTypeName(type)]);
		}
	} else if (!(x instanceof type)) {
		_tcomb2.default.fail('Invalid value ' + _tcomb2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcomb2.default.getTypeName(type) + ')');
	}

	return x;
}