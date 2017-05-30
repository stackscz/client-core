'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.denormalizedResourceSelectorFactory = exports.resourceSchemaSelectorFactory = exports.relatedResourceSelectorFactory = exports.resourceDataSelectorFactory = exports.resourceSelectorFactory = exports.resolvedLinkSelectorFactory = exports.normalizedLinkSelectorFactory = exports.definitionsSelector = exports.pathsSelector = exports.resourcesServiceSelector = exports.resourcesModuleStateSelector = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _hash = require('../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

var _reselect = require('reselect');

var _selectors = require('../entityStorage/selectors');

var _denormalizeResource = require('./utils/denormalizeResource2');

var _denormalizeResource2 = _interopRequireDefault(_denormalizeResource);

var _findRelationLinkName = require('./utils/findRelationLinkName');

var _findRelationLinkName2 = _interopRequireDefault(_findRelationLinkName);

var _getIdPropertyName = require('./utils/getIdPropertyName');

var _getIdPropertyName2 = _interopRequireDefault(_getIdPropertyName);

var _resolveSubschema = require('./utils/resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _normalizeLink = require('./utils/normalizeLink');

var _normalizeLink2 = _interopRequireDefault(_normalizeLink);

var _ResourceLink = require('./types/ResourceLink');

var _modulesResourcesTypesResourceLink = _interopRequireWildcard(_ResourceLink);

var _constants = require('./constants');

var _findResourceSchema = require('./utils/findResourceSchema');

var _findResourceSchema2 = _interopRequireDefault(_findResourceSchema);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResourceLink = _modulesResourcesTypesResourceLink.ResourceLink || _tcomb2.default.Any;
var resourcesModuleStateSelector = exports.resourcesModuleStateSelector = function resourcesModuleStateSelector(state) {
	return (0, _get3.default)(state, 'resources');
};
var resourcesServiceSelector = exports.resourcesServiceSelector = function resourcesServiceSelector(state) {
	return (0, _get3.default)(state, 'resources.service', {});
};
var pathsSelector = exports.pathsSelector = function pathsSelector(state) {
	return (0, _get3.default)(state, 'resources.paths');
};
var definitionsSelector = exports.definitionsSelector = function definitionsSelector(state) {
	return (0, _get3.default)(state, 'resources.definitions');
};

var normalizedLinkSelectorFactory = exports.normalizedLinkSelectorFactory = (0, _fastMemoize2.default)(function () {
	var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return (0, _reselect.createSelector)(function (state) {
		return (0, _get3.default)(state, 'resources.paths');
	}, function (paths) {
		return (0, _normalizeLink2.default)(link, paths);
	});
});

var resolvedLinkSelectorFactory = exports.resolvedLinkSelectorFactory = (0, _fastMemoize2.default)(function () {
	var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return (0, _reselect.createSelector)(resourcesServiceSelector, function (state) {
		return (0, _get3.default)(state, 'resources');
	}, function (resourcesService, apiDescription) {
		var resolveResourceLink = resourcesService.resolveResourceLink;

		(0, _invariant2.default)((0, _isFunction3.default)(resolveResourceLink), '`ResourcesService.resolveResourceLink` must be a Function!');
		return resolveResourceLink(link, apiDescription);
	});
});

var resourceSelectorFactory = exports.resourceSelectorFactory = (0, _fastMemoize2.default)(function () {
	var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return function (state) {
		return (0, _get3.default)(state, ['resources', 'resources', (0, _hash2.default)(link)]);
	};
});

var resourceDataSelectorFactory = exports.resourceDataSelectorFactory = (0, _fastMemoize2.default)(function () {
	var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return function (state) {
		return (0, _get3.default)(state, ['entityStorage', 'entities', (0, _hash2.default)(link)]);
	};
});

var relatedResourceSelectorFactory = exports.relatedResourceSelectorFactory = function relatedResourceSelectorFactory() {
	var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var rel = arguments[1];
	return function (state) {
		var definitions = definitionsSelector(state);

		var _resolvedLinkSelector = resolvedLinkSelectorFactory(link)(state),
		    params = _resolvedLinkSelector.params,
		    resourceSchema = _resolvedLinkSelector.resourceSchema;

		var resourceSchemaRef = (0, _get3.default)(resourceSchema, '$ref', (0, _get3.default)(resourceSchema, 'items.$ref')); // TODO rename
		resourceSchemaRef = resourceSchemaRef.split('/');
		resourceSchemaRef.shift();
		resourceSchemaRef = resourceSchemaRef.join('.');
		var responseSchema = (0, _get3.default)({ definitions: definitions }, resourceSchemaRef);
		var relatedResourceLinkName = (0, _findRelationLinkName2.default)(responseSchema, rel);

		var relatedResourceLink = { name: relatedResourceLinkName, params: params };
		return (0, _get3.default)(state, ['resources', 'resources', (0, _hash2.default)(relatedResourceLink)]);
	};
};

var resourceSchemaSelectorFactory = exports.resourceSchemaSelectorFactory = (0, _fastMemoize2.default)(function (link) {
	_assert(link, ResourceLink, 'link');

	return (0, _reselect.createSelector)(pathsSelector, definitionsSelector, function (paths, definitions) {
		if (!link) {
			return undefined;
		}
		return (0, _findResourceSchema2.default)({
			paths: paths,
			definitions: definitions,
			link: link
		});
	});
});

var denormalizedResourceSelectorFactory = exports.denormalizedResourceSelectorFactory = (0, _fastMemoize2.default)(function (link) {
	var maxLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

	_assert(link, ResourceLink, 'link');

	return (0, _reselect.createSelector)(pathsSelector, definitionsSelector, resourceSelectorFactory(link), _selectors.entityDictionarySelector, function (paths, definitions, resource, entityDictionary) {
		if (!resource) {
			return undefined;
		}
		var resourceSchema = (0, _findResourceSchema2.default)({
			paths: paths,
			definitions: definitions,
			link: link
		});

		var content = (0, _denormalizeResource2.default)(resourceSchema, paths, entityDictionary, maxLevel, link);
		return (0, _extends3.default)({}, resource, {
			content: content
		});
	});
});

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