'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _ResourceLink = require('../modules/resources/types/ResourceLink');

var _modulesResourcesTypesResourceLink = _interopRequireWildcard(_ResourceLink);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _resolveSubschema = require('../modules/resources/utils/resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _resolveResourceLink2 = require('../modules/resources/utils/resolveResourceLink');

var _resolveResourceLink3 = _interopRequireDefault(_resolveResourceLink2);

var _validateResource = require('../modules/resources/utils/validateResource');

var _validateResource2 = _interopRequireDefault(_validateResource);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResourceLink = _modulesResourcesTypesResourceLink.ResourceLink || _tcomb2.default.Any;


var createWrappedPromise = function createWrappedPromise(cb) {
	return new _promise2.default(function (resolve, reject) {
		try {
			cb(resolve, reject);
		} catch (error) {
			reject(error);
		}
	});
};
if (process.env.DELAY_RESOURCE_SERVICE_RESPONSE) {
	createWrappedPromise = function createWrappedPromise(cb) {
		return new _promise2.default(function (resolve, reject) {
			return setTimeout(function () {
				try {
					cb(resolve, reject);
				} catch (error) {
					reject(error);
				}
			}, 1000);
		});
	};
}

var service = {
	getResource: function getResource(_ref) {
		var link = _ref.link,
		    apiDescription = _ref.apiDescription;
		return createWrappedPromise(function (resolve, reject) {
			var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);
			var name = resolvedLink.name,
			    params = resolvedLink.params,
			    path = resolvedLink.path,
			    queryParams = resolvedLink.queryParams,
			    resourceSchema = resolvedLink.resourceSchema;


			if (process.env.NODE_ENV !== 'production') {
				var getMockResource = (0, _get3.default)(apiDescription, 'getMockResource', function () {});
				var mockResource = getMockResource({
					method: 'GET',
					linkName: name,
					linkParams: params,
					params: params,
					resourceSchema: resourceSchema,
					definitions: (0, _get3.default)(apiDescription, 'definitions')
				});

				if (mockResource) {
					try {
						(0, _validateResource2.default)(mockResource, resourceSchema);
						resolve(mockResource);
					} catch (error) {
						reject(error);
					}
					return;
				}
			}

			_axios2.default.get(path, {
				params: queryParams
			}).then(function (response) {
				var responseData = (0, _get3.default)(response, 'data');
				try {
					(0, _validateResource2.default)(responseData, resourceSchema);
				} catch (error) {
					reject(error);
				}
				resolve(responseData);
			}).catch(function (errorResponse) {
				var response = errorResponse.response;
				reject({
					code: response.status || 5000,
					data: response.data || {},
					message: response.status + ': Get resource failed'
				});
			});
		});
	},
	postResource: function postResource(_ref2) {
		var link = _ref2.link,
		    data = _ref2.data,
		    apiDescription = _ref2.apiDescription;
		return createWrappedPromise(function (resolve, reject) {
			var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);

			var name = resolvedLink.name,
			    params = resolvedLink.params,
			    queryParams = resolvedLink.queryParams,
			    path = resolvedLink.path,
			    resourceSchema = resolvedLink.resourceSchema;


			var finalResourceSchema = resourceSchema.items ? (0, _resolveSubschema2.default)(resourceSchema, 'items') : resourceSchema;

			if (process.env.NODE_ENV !== 'production') {
				var getMockResource = (0, _get3.default)(apiDescription, 'getMockResource', function () {});
				var mockResource = void 0;
				try {
					mockResource = getMockResource({
						method: 'POST',
						data: data,
						linkName: name,
						linkParams: params,
						resourceSchema: resourceSchema,
						definitions: (0, _get3.default)(apiDescription, 'definitions')
					});
				} catch (error) {
					reject(error);
					return;
				}

				if (mockResource) {
					try {
						(0, _validateResource2.default)(mockResource, finalResourceSchema);
						resolve(mockResource);
					} catch (error) {
						reject(error);
					}
					return;
				}
			}

			_axios2.default.post(path, data, {
				params: queryParams
			}).then(function (response) {
				var responseData = (0, _get3.default)(response, 'data');
				try {
					(0, _validateResource2.default)(responseData, finalResourceSchema);
				} catch (error) {
					reject(error);
				}
				resolve(responseData);
			}).catch(function (errorResponse) {
				var response = errorResponse.response;
				reject({
					code: response.status || 5000,
					data: response.data || {},
					message: response.status + ': Post resource failed'
				});
			});
		});
	},
	putResource: function putResource(_ref3) {
		var link = _ref3.link,
		    data = _ref3.data,
		    apiDescription = _ref3.apiDescription;
		return createWrappedPromise(function (resolve, reject) {
			var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);

			var name = resolvedLink.name,
			    params = resolvedLink.params,
			    queryParams = resolvedLink.queryParams,
			    path = resolvedLink.path,
			    resourceSchema = resolvedLink.resourceSchema;


			if (process.env.NODE_ENV !== 'production') {
				var getMockResource = (0, _get3.default)(apiDescription, 'getMockResource', function () {});
				var mockResource = getMockResource({
					method: 'PUT',
					data: data,
					linkName: name,
					linkParams: params,
					resourceSchema: resourceSchema,
					definitions: (0, _get3.default)(apiDescription, 'definitions')
				});

				if (mockResource) {
					try {
						(0, _validateResource2.default)(mockResource, resourceSchema);
						resolve(mockResource);
					} catch (error) {
						reject(error);
					}
					return;
				}
			}

			_axios2.default.put(path, data, {
				params: queryParams
			}).then(function (response) {
				var responseData = (0, _get3.default)(response, 'data');
				try {
					(0, _validateResource2.default)(responseData, resourceSchema);
				} catch (error) {
					reject(error);
				}
				resolve(responseData);
			}).catch(function (errorResponse) {
				var response = errorResponse.response;
				reject({
					code: response.status || 5000,
					data: response.data || {},
					message: response.status + ': Put resource failed'
				});
			});
		});
	},
	deleteResource: function deleteResource(_ref4) {
		var link = _ref4.link,
		    data = _ref4.data,
		    apiDescription = _ref4.apiDescription;
		return createWrappedPromise(function (resolve, reject) {
			var resolvedLink = (0, _resolveResourceLink3.default)(apiDescription, link);

			var name = resolvedLink.name,
			    params = resolvedLink.params,
			    queryParams = resolvedLink.queryParams,
			    path = resolvedLink.path,
			    resourceSchema = resolvedLink.resourceSchema;


			if (process.env.NODE_ENV !== 'production') {
				var getMockResource = (0, _get3.default)(apiDescription, 'getMockResource', function () {});
				var mockResource = getMockResource({
					method: 'DELETE',
					data: data,
					linkName: name,
					linkParams: params,
					resourceSchema: resourceSchema,
					definitions: (0, _get3.default)(apiDescription, 'definitions')
				});

				if (mockResource) {
					try {
						(0, _validateResource2.default)(mockResource, resourceSchema);
						resolve(mockResource);
					} catch (error) {
						reject(error);
					}
					return;
				}
			}

			_axios2.default.delete(path, {
				params: queryParams
			}).then(resolve).catch(function (errorResponse) {
				var response = errorResponse.response;
				reject({
					code: response.status || 5000,
					data: response.data || {},
					message: 'Delete resource failed'
				});
			});
		});
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