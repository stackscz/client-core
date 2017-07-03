'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var errorResponseHandlerFactory = function errorResponseHandlerFactory(messageFactory) {
	return function (error) {
		var errorCode = (0, _get3.default)(error, 'response.status', 5000);
		var responseData = (0, _get3.default)(error, 'response.data');
		throw {
			code: errorCode,
			data: responseData,
			message: messageFactory ? messageFactory({ errorCode: errorCode, responseData: responseData }) : 'Request Failed'
		};
	};
};

var service = {
	getResource: function getResource(_ref2) {
		var link = _ref2.link,
		    apiDescription = _ref2.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    path = resolvedLink.path,
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
			apiCall = _axios2.default.get(path, { params: queryParams });
		}

		return apiCall.then(function (response) {
			return (0, _get3.default)(response, 'data');
		}).catch(errorResponseHandlerFactory(function (_ref3) {
			var errorCode = _ref3.errorCode;
			return errorCode + ': GET resource failed';
		}));
	},
	postResource: function postResource(_ref4) {
		var link = _ref4.link,
		    data = _ref4.data,
		    apiDescription = _ref4.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    queryParams = resolvedLink.queryParams,
		    path = resolvedLink.path,
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
			apiCall = _axios2.default.post(path, data, {
				params: queryParams
			});
		}

		return apiCall.then(function (response) {
			return (0, _get3.default)(response, 'data');
		}).catch(errorResponseHandlerFactory(function (_ref5) {
			var errorCode = _ref5.errorCode;
			return errorCode + ': POST resource failed';
		}));
	},
	putResource: function putResource(_ref6) {
		var link = _ref6.link,
		    data = _ref6.data,
		    apiDescription = _ref6.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    queryParams = resolvedLink.queryParams,
		    path = resolvedLink.path,
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
			apiCall = _axios2.default.put(path, data, {
				params: queryParams
			});
		}

		return apiCall.then(function (response) {
			return (0, _get3.default)(response, 'data');
		}).catch(errorResponseHandlerFactory(function (_ref7) {
			var errorCode = _ref7.errorCode;
			return errorCode + ': PUT resource failed';
		}));
	},
	deleteResource: function deleteResource(_ref8) {
		var link = _ref8.link,
		    data = _ref8.data,
		    apiDescription = _ref8.apiDescription;

		var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
		var name = resolvedLink.name,
		    params = resolvedLink.params,
		    queryParams = resolvedLink.queryParams,
		    path = resolvedLink.path,
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
			apiCall = _axios2.default.delete(path, {
				params: queryParams
			});
		}
		return apiCall.catch(errorResponseHandlerFactory(function (_ref9) {
			var errorCode = _ref9.errorCode;
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