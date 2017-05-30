'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _values2 = require('lodash/values');

var _values3 = _interopRequireDefault(_values2);

var _first2 = require('lodash/first');

var _first3 = _interopRequireDefault(_first2);

var _size2 = require('lodash/size');

var _size3 = _interopRequireDefault(_size2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _normalizr = require('normalizr');

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

var _hash = require('../../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _normalizeLink = require('./normalizeLink2');

var _normalizeLink2 = _interopRequireDefault(_normalizeLink);

var _Resource = require('../schemas/Resource');

var _Resource2 = _interopRequireDefault(_Resource);

var _pathsToResources = require('./pathsToResources');

var _pathsToResources2 = _interopRequireDefault(_pathsToResources);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveJsonPointer = function resolveJsonPointer(parentSchema, schema) {
	var ref = (0, _get3.default)(schema, '$ref');
	if (!ref) {
		return schema;
	}
	var refParts = ref.replace(/^#\//, '').split('/');
	return (0, _extends5.default)({}, (0, _get3.default)(parentSchema, refParts), {
		definitions: (0, _get3.default)(parentSchema, 'definitions', {})
	});
};

var defineObjectSchemaProperties = function defineObjectSchemaProperties(schema, definitions, entitySchema, properties, resources, resourceLinkName, schemasBag) {
	var links = (0, _get3.default)(schema, 'x-links', {});
	(0, _map3.default)(properties, function (propertySchema, propertyName) {
		var propertyResourceLinkName = (0, _get3.default)(links, propertyName);
		var resultPropertySchema = visitSchema(resolveJsonPointer(schema, (0, _extends5.default)({}, propertySchema, {
			definitions: definitions
		})), resources, propertyResourceLinkName, schemasBag);
		if (resultPropertySchema) {
			entitySchema.define((0, _defineProperty3.default)({}, propertyName, resultPropertySchema));
		}
	});
};

var visitSchema = function visitSchema(schema, resources, resourceLinkName, schemasBag) {
	if ((0, _isString3.default)(schema)) {
		return undefined;
	}
	var valueType = (0, _get3.default)(schema, 'type', (0, _get3.default)(schema, 'anyOf', 'object'));
	var definitions = (0, _get3.default)(schema, 'definitions', {});
	if ((0, _isArray3.default)(valueType)) {
		var unionSchemaDefinition = (0, _reduce3.default)(valueType, function (acc, valueTypeItem) {
			if ((0, _isString3.default)(valueTypeItem)) {
				return acc;
			}

			var elementSchema = visitSchema(resolveJsonPointer(schema, (0, _extends5.default)({}, valueTypeItem, {
				definitions: definitions
			})), resources, resourceLinkName, schemasBag);
			if (!elementSchema) {
				return acc;
			}
			var valueTypeItemType = (0, _get3.default)(valueTypeItem, 'type', 'object');
			return {
				schemas: (0, _extends5.default)({}, acc.schemas, (0, _defineProperty3.default)({}, valueTypeItemType, elementSchema))
			};
		}, {
			schemas: {
				primitive: {}
			}
		});
		if ((0, _size3.default)(unionSchemaDefinition.schemas) === 1) {
			return undefined;
			// return unionSchemaDefinition.schemas.primitive;
		} else if ((0, _size3.default)(unionSchemaDefinition.schemas) === 2) {
			delete unionSchemaDefinition.schemas.primitive;
			return (0, _first3.default)((0, _values3.default)(unionSchemaDefinition.schemas));
		}
		return new _normalizr.schema.Union(unionSchemaDefinition.schemas, function (value, parent, key) {
			if ((0, _isArray3.default)(value)) {
				return 'array';
			}
			if ((0, _isObject3.default)(value)) {
				return 'object';
			}
			return 'primitive';
		});
	} else {
		switch (valueType) {
			case 'array':
				// if(resourceLinkName && schemasBag[resourceLinkName]) {
				// 	return schemasBag[resourceLinkName];
				// }
				var arrayItemSchema = resolveJsonPointer(schema, (0, _get3.default)(schema, 'items', {}));
				console.log('ARRAY resource', resourceLinkName);
				var resultingSchema = new _normalizr.schema.Array(visitSchema(arrayItemSchema, resources, undefined, schemasBag));
				if (resourceLinkName) {
					resultingSchema = new _Resource2.default(resourceLinkName, resultingSchema, (0, _get3.default)(resources, resourceLinkName));
					// schemasBag[resourceLinkName] = resultingSchema
				}
				return resultingSchema;
			case 'object':
				var modelName = (0, _get3.default)(schema, 'x-model');
				var idPropertyName = (0, _get3.default)(schema, 'x-idPropertyName', 'id');
				var properties = (0, _get3.default)(schema, 'properties', {});
				var links = (0, _get3.default)(schema, 'x-links', {});
				if (modelName) {
					if (resourceLinkName && schemasBag[resourceLinkName]) {
						return schemasBag[resourceLinkName];
					}
					if (schemasBag[modelName]) {
						return schemasBag[modelName];
					}
					var entitySchema = new _normalizr.schema.Entity(modelName, {}, {
						idAttribute: function idAttribute(value, parent, key) {
							// return `${modelName}:${g(value, idPropertyName)}`;
							return '' + (0, _hash2.default)({ name: modelName, params: { id: '' + (0, _get3.default)(value, idPropertyName) } });
						},
						processStrategy: function processStrategy(value, parent, key) {
							var resultValue = (0, _extends5.default)({}, (0, _pickBy3.default)(value, function (v, pn) {
								return properties[pn];
							}));
							var links = (0, _get3.default)(schema, 'x-links');
							if (links) {
								resultValue = (0, _reduce3.default)(links, function (acc, linkName, propertyName) {
									var _extends3;

									if (acc[propertyName]) {
										return acc;
									}
									var nlink = (0, _normalizeLink2.default)({
										name: linkName,
										params: { parent: value }
									}, resources);
									return (0, _extends5.default)({}, acc, (_extends3 = {}, (0, _defineProperty3.default)(_extends3, propertyName, '' + (0, _hash2.default)(nlink)), (0, _defineProperty3.default)(_extends3, propertyName + '_link', nlink), _extends3));
								}, resultValue);
							}
							return resultValue;
						}
					});
					schemasBag[modelName] = entitySchema;
					defineObjectSchemaProperties(schema, definitions, entitySchema, properties, resources, resourceLinkName, schemasBag);
					if (resourceLinkName && resourceLinkName !== modelName) {
						// debugger;
						var entityResourceSchema = new _Resource2.default(resourceLinkName, entitySchema, (0, _get3.default)(resources, resourceLinkName));
						// schemasBag[resourceLinkName] = entityResourceSchema;
						return entityResourceSchema;
					}
					return entitySchema;
				} else {
					var objectSchema = new _normalizr.schema.Object({});
					defineObjectSchemaProperties(schema, definitions, objectSchema, properties, resources, undefined, schemasBag);
					return objectSchema;
				}
				break;
			default:
				return undefined;
		}
	}
};

exports.default = (0, _fastMemoize2.default)(function (jsonSchema, paths, link) {
	console.warn('CONVERTING SCHEMA', jsonSchema);
	var schemasBag = {};
	var resources = (0, _pathsToResources2.default)(paths);
	return visitSchema(jsonSchema, resources, link && link.name, schemasBag);
});