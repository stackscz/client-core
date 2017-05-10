'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = getReadOnlyProperties;

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function visitSchema(inputSchema, readOnlyProperties) {
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var schemaReadOnlyProperties = (0, _get3.default)(schema, 'x-readOnly', []);
	(0, _each3.default)(schemaReadOnlyProperties, function (propName) {
		readOnlyProperties[propName] = true;
	});
	var allOf = (0, _get3.default)(schema, 'allOf');
	if (allOf) {
		(0, _each3.default)(allOf, function (_, partialSchemaIndex) {
			visitSchema((0, _resolveSubschema2.default)(schema, ['allOf', partialSchemaIndex]), readOnlyProperties);
		});
	}
}

function getReadOnlyProperties(schema) {
	var readOnlyProperties = {};
	visitSchema(schema, readOnlyProperties);
	return (0, _keys3.default)(readOnlyProperties);
}