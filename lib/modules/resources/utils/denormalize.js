'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

exports.default = denormalize;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _getIdPropertyName = require('./getIdPropertyName');

var _getIdPropertyName2 = _interopRequireDefault(_getIdPropertyName);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _JsonSchema = require('../../../types/JsonSchema');

var _typesJsonSchema = _interopRequireWildcard(_JsonSchema);

var _Entity = require('../../../types/Entity');

var _typesEntity = _interopRequireWildcard(_Entity);

var _NormalizedEntityDictionary = require('../../../types/NormalizedEntityDictionary');

var _typesNormalizedEntityDictionary = _interopRequireWildcard(_NormalizedEntityDictionary);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-use-before-define, no-param-reassign */
var JsonSchema = _typesJsonSchema.JsonSchema || _tcomb2.default.Any;
var Entity = _typesEntity.Entity || _tcomb2.default.Any;
var NormalizedEntityDictionary = _typesNormalizedEntityDictionary.NormalizedEntityDictionary || _tcomb2.default.Any;


function resolveEntityOrId(entityOrId, schema, entityDictionary) {
	var idPropertyName = (0, _getIdPropertyName2.default)(schema);
	var modelName = (0, _get3.default)(schema, 'x-model');
	var entityId = void 0;
	if ((0, _isObject3.default)(entityOrId)) {
		entityId = entityOrId[idPropertyName];
	} else {
		entityId = entityOrId;
	}
	var entity = (0, _get3.default)(entityDictionary, [modelName, entityId]);

	return {
		entity: entity,
		id: entityId
	};
}

function visitObject(obj, schema, entityDictionary, bag, maxLevel, currentLevel) {
	var denormalized = obj;
	(0, _each3.default)((0, _get3.default)(schema, 'properties'), function (propertySchema, key) {
		// console.log('FOR KEY:', key, 'FOUND SCHEMA:', findSchemaForProperty(schema, key));
		if (propertySchema && obj[key]) {
			denormalized[key] = visit(obj[key], (0, _resolveSubschema2.default)(schema, ['properties', key]), entityDictionary, bag, maxLevel, currentLevel + 1);
		}
	});
	return denormalized;
}
function visitEntity(obj, inputSchema, entityDictionary, bag, maxLevel, currentLevel) {
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var modelName = (0, _get3.default)(schema, 'x-model');

	var _resolveEntityOrId = resolveEntityOrId(obj, schema, entityDictionary),
	    entity = _resolveEntityOrId.entity,
	    id = _resolveEntityOrId.id;

	if (!bag.hasOwnProperty(modelName)) {
		bag[modelName] = {};
	}

	if (!bag[modelName].hasOwnProperty(id)) {
		// Ensure we don't mutate it non-immutable objects
		var newObj = (0, _merge3.default)({}, entity);

		// Need to set this first so that if it is referenced within the call to
		// visitObject, it will already exist.
		bag[modelName][id] = newObj;
		bag[modelName][id] = visitObject(newObj, schema, entityDictionary, bag, maxLevel, currentLevel);

		var allOf = (0, _get3.default)(schema, 'allOf');
		if (allOf) {
			(0, _each3.default)(allOf, function (_, inputSubModelSchemaIndex) {
				var subModelSchema = (0, _resolveSubschema2.default)(schema, ['allOf', inputSubModelSchemaIndex]);
				var subModelSchemaModelName = (0, _get3.default)(subModelSchema, 'x-model');
				if (subModelSchemaModelName) {
					bag[modelName][id] = (0, _extends3.default)({}, bag[modelName][id], visitEntity((0, _get3.default)(entityDictionary, [subModelSchemaModelName, id], {}), subModelSchema, entityDictionary, bag, maxLevel, currentLevel));
				} else {
					bag[modelName][id] = (0, _extends3.default)({}, bag[modelName][id], visitObject(bag[modelName][id], subModelSchema, entityDictionary, bag, maxLevel, currentLevel));
				}
			});
		}
	}

	return (0, _clone3.default)(bag[modelName][id]);
}
function visitArray(arr, schema, entityDictionary, bag, maxLevel, currentLevel) {
	return arr.map(function (item) {
		return visit(item, (0, _resolveSubschema2.default)(schema, 'items'), entityDictionary, bag, maxLevel, currentLevel);
	});
}

function visit(obj, inputSchema, entityDictionary, bag, maxLevel) {
	var currentLevel = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

	if (!(maxLevel >= currentLevel)) {
		return obj;
	}

	var schema = (0, _resolveSchema2.default)(inputSchema);
	var type = (0, _get3.default)(schema, 'type', 'object');
	if (obj === null || typeof obj === 'undefined' || !(0, _isObject3.default)(schema)) {
		return obj;
	}

	var modelName = (0, _get3.default)(schema, 'x-model');
	if (modelName && type === 'object') {
		return visitEntity(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
	} else if (type === 'array') {
		return visitArray(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
	}
	// return obj;
	return visitObject(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
}

/**
 * Construct nested value by schema from entities dictionary
 *
 * @param {EntityId | Array<EntityId> | Entity | Array<Entity>} obj - entities spec
 * @param {JsonSchema} schema to denormalize by
 * @param {NormalizedEntityDictionary} entityDictionary
 * @param {?number} maxLevel - max level of nesting when denormalizing
 */
function denormalize(obj, schema, entityDictionary) {
	var maxLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

	_assert(schema, JsonSchema, 'schema');

	_assert(entityDictionary, NormalizedEntityDictionary, 'entityDictionary');

	_assert(maxLevel, _tcomb2.default.Number, 'maxLevel');

	var ret = function (obj, schema, entityDictionary, maxLevel) {
		return visit(obj, schema, entityDictionary, {}, maxLevel);
	}.call(this, obj, schema, entityDictionary, maxLevel);

	_assert(ret, _tcomb2.default.union([Entity, _tcomb2.default.list(Entity)]), 'return value');

	return ret;
}

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