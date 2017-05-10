'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

exports.default = walkSchemaProperties;

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function walkSchemaProperties(inputSchema, iteratee) {
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var properties = (0, _get3.default)(schema, 'properties', {});
	(0, _each3.default)((0, _keys2.default)(properties), function (propertyName) {
		iteratee((0, _resolveSubschema2.default)(schema, ['properties', propertyName]), propertyName, schema);
	});
	var allOf = (0, _get3.default)(schema, 'allOf');
	if (allOf) {
		(0, _each3.default)(allOf, function (subSchema, subSchemaIndex) {
			walkSchemaProperties((0, _resolveSubschema2.default)(schema, ['allOf', subSchemaIndex]), iteratee);
		});
	}
}