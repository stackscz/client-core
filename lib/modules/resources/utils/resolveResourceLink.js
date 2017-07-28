'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _urijs = require('urijs');

var _urijs2 = _interopRequireDefault(_urijs);

var _URITemplate = require('urijs/src/URITemplate');

var _URITemplate2 = _interopRequireDefault(_URITemplate);

var _findResourceSchema = require('../utils/findResourceSchema');

var _findResourceSchema2 = _interopRequireDefault(_findResourceSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (apiDescription, link) {
	var name = link.name,
	    params = link.params;

	var paths = (0, _get3.default)(apiDescription, 'paths', {});
	var matchingLink = (0, _reduce3.default)(paths, function (result, value, key) {
		if (result) {
			return result;
		}
		if ((0, _get3.default)(value, 'x-linkName') === name) {
			return {
				resourceSchema: (0, _findResourceSchema2.default)((0, _extends3.default)({}, apiDescription, {
					link: link
				})),
				pathTemplate: key,
				parameters: (0, _get3.default)(value, 'parameters', [])
			};
		}
		return undefined;
	}, undefined);

	if (!matchingLink) {
		return undefined;
	}

	var pathTemplate = matchingLink.pathTemplate,
	    parameters = matchingLink.parameters,
	    resourceSchema = matchingLink.resourceSchema;


	var finalParams = {};
	var expandParams = {};
	var queryParams = {};
	try {
		(0, _each3.default)(parameters, function (parameter) {
			var paramLocation = (0, _get3.default)(parameter, 'in');
			if (paramLocation === 'body') {
				return;
			}
			var isParamRequired = (0, _get3.default)(parameter, 'required', false);
			var linkParamName = (0, _get3.default)(parameter, 'name');
			var linkParamPath = (0, _get3.default)(parameter, 'x-linkParam');
			var paramValue = (0, _get3.default)(params, linkParamPath);
			var isOptionalQueryParam = paramLocation === 'query' && !isParamRequired;
			(0, _invariant2.default)(isOptionalQueryParam || paramValue, 'link param %s not present for link name %s, params: %s', linkParamPath, name,
			// do not stringify when invariant passing
			!(isOptionalQueryParam || paramValue) && (0, _stringify2.default)(params, null, 2));
			(0, _set3.default)(finalParams, linkParamPath, paramValue);
			(0, _set3.default)(expandParams, linkParamName, paramValue);
			if ((0, _get3.default)(parameter, 'in') === 'query') {
				(0, _set3.default)(queryParams, linkParamName, paramValue);
			}
		});
	} catch (error) {
		if (error.message.includes('not present for link name')) {
			return undefined;
		}
		throw error;
	}

	var path = '' + (0, _get3.default)(apiDescription, 'basePath') + _urijs2.default.expand(pathTemplate, expandParams).toString();
	var host = (0, _get3.default)(apiDescription, 'host');
	var url = path;
	if (host) {
		url = (0, _get3.default)(apiDescription, 'scheme', 'https') + '://' + host + path;
	}
	return {
		name: name,
		params: finalParams,
		queryParams: queryParams,
		pathTemplate: pathTemplate,
		path: path,
		url: url,
		resourceSchema: resourceSchema
	};
}; // eslint-disable-line no-unused-vars