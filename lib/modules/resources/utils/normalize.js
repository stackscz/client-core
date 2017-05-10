'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _memoize2 = require('lodash/memoize');

var _memoize3 = _interopRequireDefault(_memoize2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _merge3 = require('lodash/merge');

var _merge4 = _interopRequireDefault(_merge3);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = normalizeResource;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _safeJSONStrigify = require('safeJSONStrigify');

var _safeJSONStrigify2 = _interopRequireDefault(_safeJSONStrigify);

var _mergeWithArraysUnique = require('mergeWithArraysUnique');

var _mergeWithArraysUnique2 = _interopRequireDefault(_mergeWithArraysUnique);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _EntityId = require('../../../types/EntityId');

var _typesEntityId = _interopRequireWildcard(_EntityId);

var _JsonSchema = require('../../../types/JsonSchema');

var _typesJsonSchema = _interopRequireWildcard(_JsonSchema);

var _NormalizedEntityDictionary = require('../../../types/NormalizedEntityDictionary');

var _typesNormalizedEntityDictionary = _interopRequireWildcard(_NormalizedEntityDictionary);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EntityId = _typesEntityId.EntityId || _tcomb2.default.Any;
/* eslint-disable no-param-reassign */

var JsonSchema = _typesJsonSchema.JsonSchema || _tcomb2.default.Any;
var NormalizedEntityDictionary = _typesNormalizedEntityDictionary.NormalizedEntityDictionary || _tcomb2.default.Any;

var NormalizationResult = _tcomb2.default.interface({
	entities: NormalizedEntityDictionary,
	result: _tcomb2.default.union([EntityId, _tcomb2.default.list(EntityId)])
}, 'NormalizationResult');

function logIndented(level) {
	// eslint-disable-line
	if (process.env.DEBUG_LOGGING_ENABLED) {
		var _console;

		for (var _len = arguments.length, msgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			msgs[_key - 1] = arguments[_key];
		}

		(_console = console).log.apply(_console, [' '.repeat(level * 4)].concat(msgs));
	}
}

var findIdPropName = (0, _memoize3.default)(function findIdPropName(inputSchema) {
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var idPropName = (0, _get3.default)(schema, 'x-idPropertyName');
	if (!idPropName) {
		var allOf = (0, _get3.default)(schema, 'allOf');
		if (allOf) {
			return (0, _reduce3.default)(allOf, function (resultingIdPropName, _, partialSchemaIndex) {
				if (resultingIdPropName) {
					return resultingIdPropName;
				}
				return findIdPropName((0, _resolveSubschema2.default)(schema, ['allOf', partialSchemaIndex]));
			}, undefined);
		}
	}
	return idPropName;
});

var hasOwnSchemaProperty = function hasOwnSchemaProperty(schema, propertyName) {
	return !!(0, _get3.default)(schema, ['properties', propertyName]);
};

function assignEntity(normalized, key, entity, obj, schema) {
	if (hasOwnSchemaProperty(schema, key)) {
		normalized[key] = entity;
	}
}

function visitObject(clevel, obj, schema, bag, assocsBag) {
	logIndented(clevel, 'VISITING OBJECT');
	logIndented(clevel, 'OBJ          ', obj);
	logIndented(clevel, 'SCHEMA       ', (0, _safeJSONStrigify2.default)(schema, 1));
	logIndented();
	var assocMap = (0, _get3.default)(schema, 'x-associationMapping');

	var normalized = {};
	(0, _each3.default)(obj, function (value, key) {
		var propertySchema = (0, _resolveSubschema2.default)(schema, ['properties', key]);
		var mappedAssoc = (0, _get3.default)(assocMap, key);
		var entity = visit( // eslint-disable-line
		clevel + 3, obj[key], propertySchema, bag, assocsBag, mappedAssoc, obj[findIdPropName(schema)]);
		assignEntity(normalized, key, entity, obj, schema);
	});
	logIndented();
	logIndented();
	return normalized;
}

function mergeIntoEntity(entityA, entityB, modelName) {
	(0, _each3.default)(entityB, function (value, key) {
		if (!entityB.hasOwnProperty(key)) {
			return;
		}

		if (!entityA.hasOwnProperty(key) || (0, _isEqual3.default)(entityA[key], entityB[key])) {
			entityA[key] = entityB[key];
			return;
		}

		console.warn('When merging two ' + modelName + ',\n\t\t\tfound unequal data in their "' + key + '" values.\n\t\t\tUsing the earlier value.', entityA[key], entityB[key]);
	});
}

function visitEntity(clevel, obj, schema, bag, assocsBag, mappedAssoc, parentId) {
	var modelName = (0, _get3.default)(schema, 'x-model');
	var assocMap = (0, _get3.default)(schema, 'x-associationMapping', {});

	logIndented(clevel, 'VISITING ENTITY');
	logIndented(clevel, 'OBJ          ', obj);
	logIndented(clevel, 'MODEL        ', modelName);
	logIndented(clevel, 'SCHEMA       ', (0, _safeJSONStrigify2.default)(schema, 1));
	logIndented(clevel, 'MAPPED ASSOC ', (0, _safeJSONStrigify2.default)(mappedAssoc, 1));
	logIndented(clevel);

	var idPropertyName = findIdPropName(schema);
	var id = (0, _get3.default)(obj, idPropertyName);
	if (!id) {
		return undefined;
	}

	if (!bag.hasOwnProperty(modelName)) {
		bag[modelName] = {};
	}

	if (!bag[modelName].hasOwnProperty(id)) {
		bag[modelName][id] = {};
	}

	var stored = bag[modelName][id];
	var normalized = visitObject(clevel + 1, obj, schema, bag, assocsBag);
	mergeIntoEntity(stored, normalized, modelName);

	// is it composite entity?
	var allOf = (0, _get3.default)(schema, 'allOf');
	if ((0, _isArray3.default)(allOf)) {
		(0, _each3.default)(allOf, function (_, inputComposedSchemaIndex) {
			var composedSchema = (0, _resolveSubschema2.default)(schema, ['allOf', inputComposedSchemaIndex]);
			var composedSchemaModelName = (0, _get3.default)(composedSchema, 'x-model');
			if (composedSchemaModelName) {
				visitEntity(clevel + 1, obj, composedSchema, bag, assocsBag, mappedAssoc, parentId);
			} else {
				normalized = visitObject(clevel + 1, obj, (0, _extends3.default)({
					'x-associationMapping': assocMap,
					'x-idPropertyName': idPropertyName
				}, composedSchema), bag, assocsBag);
				mergeIntoEntity(stored, normalized, modelName);
			}
		});
	}

	if (mappedAssoc) {
		var mappedModelName = (0, _get3.default)(mappedAssoc, ['model']);
		if ((0, _get3.default)(mappedAssoc, 'many', false)) {
			(0, _mergeWithArraysUnique2.default)(assocsBag, (0, _defineProperty3.default)({}, mappedModelName, (0, _defineProperty3.default)({}, id, (0, _defineProperty3.default)({}, (0, _get3.default)(mappedAssoc, ['property']), [parentId]))));
		} else {
			(0, _merge4.default)(assocsBag, (0, _defineProperty3.default)({}, mappedModelName, (0, _defineProperty3.default)({}, id, (0, _defineProperty3.default)({}, (0, _get3.default)(mappedAssoc, ['property']), parentId))));
		}
	}

	logIndented();
	logIndented();

	return id;
}

function visitArray(clevel, obj, schema, bag, assocsBag, mappedAssoc, parentId) {
	var itemSchema = (0, _resolveSubschema2.default)(schema, 'items');
	// eslint-disable-next-line no-use-before-define
	return obj.map(function (item) {
		return visit(clevel + 3, item, itemSchema, bag, assocsBag, mappedAssoc, parentId);
	});
}

/**
 *
 * @param clevel - more or less current recursion level, used only for log indentation
 * @param obj - value to normalize
 * @param inputSchema - schema describing how to normalize obj value
 * @param bag - intermediate result of entity normalization, mutable entity dictionary
 * @param assocsBag - intermediate result of association normalization, mutable association dictionary
 * @param mappedAssoc - description of parent model property to which current value (obj) is connected
 * @param parentId - primary key value of current parent entity
 * @returns {*}
 */
function visit(clevel, obj, inputSchema, bag, assocsBag, mappedAssoc, parentId) {
	logIndented(clevel, 'VISITING VALUE');
	logIndented(clevel, 'OBJ       ', obj);
	if (process.env.DEBUG_LOGGING_ENABLED) {
		logIndented(clevel, 'SCHEMA    ', (0, _safeJSONStrigify2.default)(inputSchema, 1));
		logIndented(clevel, 'PARENT ID ', parentId);
	}
	var schema = (0, _resolveSchema2.default)(inputSchema);
	if (!(0, _isObject3.default)(obj) || !(0, _isObject3.default)(schema)) {
		logIndented(clevel, 'END, PRIMITIVE DETECTED', obj);
		logIndented(clevel, '----');
		logIndented(clevel);
		return obj;
	}
	logIndented();

	var type = (0, _get3.default)(schema, 'type', 'object');
	var modelName = (0, _get3.default)(schema, 'x-model');

	if (modelName) {
		// if it has x-model, it is entity schema
		return visitEntity(clevel + 1, obj, schema, bag, assocsBag, mappedAssoc, parentId);
	} else if (type === 'array') {
		// array schema
		return visitArray(clevel + 1, obj, schema, bag, assocsBag, mappedAssoc, parentId);
	} else if (type === 'object') {
		return obj;
	}

	logIndented();
	logIndented();
	// value schema
	return visitObject(clevel + 1, obj, schema, bag, assocsBag, parentId);
}

/**
 * Normalizes value according to json schema
 *
 * @param {Entity | Array<Entity>} obj value to normalize
 * @param {JsonSchema} schema - schema to normalize value by
 * @returns {{entities:NormalizedEntityDictionary, result:EntityId|Array<EntityId>}|*}
 */
function normalizeResource(obj, schema) {
	_assert(obj, _tcomb2.default.Any, 'obj');

	_assert(schema, JsonSchema, 'schema');

	var ret = function (obj, schema) {
		var bag = {};
		var assocsBag = {};
		logIndented('-----------------------------------------------');
		var result = visit(0, obj, schema, bag, assocsBag);
		logIndented();
		logIndented();
		return {
			result: result,
			entities: bag,
			associations: assocsBag
		};
	}.call(this, obj, schema);

	_assert(ret, NormalizationResult, 'return value');

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