'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pickFirstNonNullSchema = function pickFirstNonNullSchema(schema) {
	var resultSchema = schema;
	var anyOf = (0, _get3.default)(schema, 'anyOf');
	if ((0, _isArray3.default)(anyOf)) {
		resultSchema = anyOf.reduce(function (schemaResult, _, partialSchemaIndex) {
			var partialSchema = pickFirstNonNullSchema((0, _resolveSubschema2.default)(schema, ['anyOf', partialSchemaIndex]));
			var partialSchemaType = (0, _get3.default)(partialSchema, 'type');
			return schemaResult || (partialSchemaType !== 'null' ? partialSchema : undefined);
		}, undefined);
	}
	// TODO I promise I will DRY this one day
	var oneOf = (0, _get3.default)(schema, 'oneOf');
	if ((0, _isArray3.default)(oneOf)) {
		resultSchema = oneOf.reduce(function (schemaResult, _, partialSchemaIndex) {
			var partialSchema = pickFirstNonNullSchema((0, _resolveSubschema2.default)(schema, ['oneOf', partialSchemaIndex]));
			var partialSchemaType = (0, _get3.default)(partialSchema, 'type');
			return schemaResult || (partialSchemaType !== 'null' ? partialSchema : undefined);
		}, undefined);
	}
	return resultSchema;
};

exports.default = pickFirstNonNullSchema;