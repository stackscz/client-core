'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.visit = exports.visitObject = exports.visitArray = exports.visitEntity = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _setWith2 = require('lodash/setWith');

var _setWith3 = _interopRequireDefault(_setWith2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _getIdPropertyName = require('./getIdPropertyName');

var _getIdPropertyName2 = _interopRequireDefault(_getIdPropertyName);

var _walkSchemaProperties = require('./walkSchemaProperties');

var _walkSchemaProperties2 = _interopRequireDefault(_walkSchemaProperties);

var _pickFirstNonNullSchema = require('./pickFirstNonNullSchema');

var _pickFirstNonNullSchema2 = _interopRequireDefault(_pickFirstNonNullSchema);

var _getFirstNonNullSchemaType = require('./getFirstNonNullSchemaType');

var _getFirstNonNullSchemaType2 = _interopRequireDefault(_getFirstNonNullSchemaType);

var _isSchemaEmpty = require('./isSchemaEmpty');

var _isSchemaEmpty2 = _interopRequireDefault(_isSchemaEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeIntoEntity = function mergeIntoEntity(entityA, entityB, modelName) {
	(0, _each3.default)(entityB, function (value, key) {
		if (!entityB.hasOwnProperty(key)) {
			return;
		}

		if (!entityA.hasOwnProperty(key) || (0, _isEqual3.default)(entityA[key], entityB[key])) {
			entityA[key] = entityB[key]; // eslint-disable-line no-param-reassign
			return;
		}

		console.warn('When merging two ' + modelName + ',\n\t\t\tfound unequal data in their "' + key + '" values.\n\t\t\tUsing the earlier value.', entityA[key], entityB[key]);
	});
};

var visitEntity = exports.visitEntity = function visitEntity(value, entitySchema, resourcesDict) {
	// console.log('visitEntity:', value);

	var idPropertyName = (0, _getIdPropertyName2.default)(entitySchema);
	var modelName = (0, _get3.default)(entitySchema, 'x-model');

	var id = (0, _get3.default)(value, idPropertyName);
	if (!id) {
		return value;
	}

	var stored = (0, _get3.default)((0, _setWith3.default)(resourcesDict, [modelName, id], (0, _get3.default)(resourcesDict, [modelName, id], {}), Object), [modelName, id]);
	var normalized = visitObject(value, entitySchema, resourcesDict); // eslint-disable-line no-use-before-define
	mergeIntoEntity(stored, normalized);

	// is it composite entity?
	var allOf = (0, _get3.default)(entitySchema, 'allOf');
	if ((0, _isArray3.default)(allOf)) {
		(0, _each3.default)(allOf, function (_, inputComposedSchemaIndex) {
			var composedSchema = (0, _resolveSubschema2.default)(entitySchema, ['allOf', inputComposedSchemaIndex]);
			var composedSchemaModelName = (0, _get3.default)(composedSchema, 'x-model');
			if (composedSchemaModelName) {
				visitEntity(value, composedSchema, resourcesDict);
			} else {
				normalized = visitObject( // eslint-disable-line no-use-before-define
				value, (0, _extends3.default)({
					// 'x-associationMapping': assocMap,
					'x-idPropertyName': idPropertyName
				}, composedSchema), resourcesDict);
				mergeIntoEntity(stored, normalized, modelName);
			}
		});
	}

	return id;
};

var visitArray = exports.visitArray = function visitArray(value, arraySchema, resourcesDict) {
	(0, _invariant2.default)((0, _isArray3.default)(value), 'Value is not an array: %s for schema %s', value, arraySchema);
	var arrayItemSchema = (0, _resolveSubschema2.default)(arraySchema, 'items');
	return value.map(function (item) {
		return visit(item, arrayItemSchema, resourcesDict);
	}); // eslint-disable-line no-use-before-define
};

var visitObject = exports.visitObject = function visitObject(value, objectSchema, resourcesDict) {
	// console.log('visitObject:', value);

	var modelName = (0, _get3.default)(objectSchema, 'x-model');
	var normalized = {};
	(0, _walkSchemaProperties2.default)(objectSchema, function (propertySchema, propertyName, propertyParentSchema) {
		var propertyParentModelName = (0, _get3.default)(propertyParentSchema, 'x-model');
		if (!modelName || modelName === propertyParentModelName) {
			var result = visit( // eslint-disable-line no-use-before-define
			(0, _get3.default)(value, propertyName), propertySchema, resourcesDict);
			if (!(0, _isUndefined3.default)(result)) {
				(0, _setWith3.default)(normalized, propertyName, result, Object);
			}
		}
	});
	var additionalProperties = (0, _get3.default)(objectSchema, 'additionalProperties');
	if (additionalProperties) {
		(0, _each3.default)(value, function (_, propertyName) {
			var result = visit( // eslint-disable-line no-use-before-define
			(0, _get3.default)(value, propertyName), additionalProperties, resourcesDict);
			if (!(0, _isUndefined3.default)(result)) {
				(0, _setWith3.default)(normalized, propertyName, result, Object);
			}
		});
	}

	return normalized;
};

var visit = exports.visit = function visit(value, inputSchema, resourcesDict) {
	// console.log();
	// console.log();
	// console.log('visit:', value);
	var schema = (0, _pickFirstNonNullSchema2.default)((0, _resolveSchema2.default)(inputSchema));

	if (!(0, _isObject3.default)(value) || (0, _isSchemaEmpty2.default)(schema)) {
		return value;
	}

	var valueType = (0, _getFirstNonNullSchemaType2.default)(schema);
	var idPropertyName = (0, _getIdPropertyName2.default)(schema);
	var modelName = (0, _get3.default)(schema, 'x-model');

	if (idPropertyName && modelName) {
		return visitEntity(value, schema, resourcesDict);
	} else if (valueType === 'array') {
		return visitArray(value, schema, resourcesDict);
	} else if (valueType === 'object') {
		return visitObject(value, schema, resourcesDict);
	}

	return value;
};

exports.default = function (value, schema) {
	var resourcesDict = {};
	var result = visit(value, schema, resourcesDict);

	return {
		result: result,
		entities: resourcesDict
	};
};