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

exports.default = getAssociationsProperties;

var _walkSchemaProperties = require('./walkSchemaProperties');

var _walkSchemaProperties2 = _interopRequireDefault(_walkSchemaProperties);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAssociationsProperties(inputSchema) {
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var definitions = (0, _get3.default)(schema, 'definitions');
	var modelName = (0, _get3.default)(schema, 'x-model');
	var result = {};
	(0, _each3.default)((0, _keys2.default)(definitions), function (definitionKey) {
		var definition = (0, _resolveSubschema2.default)(schema, ['definitions', definitionKey]);
		var definitionModelName = (0, _get3.default)(definition, 'x-model');
		if (definitionModelName) {
			var modelAssociationProperties = [];
			(0, _walkSchemaProperties2.default)(definition, function (propertySchema, propertyName) {
				var propertySchemaModelName = (0, _get3.default)(propertySchema, 'x-model', (0, _get3.default)((0, _resolveSubschema2.default)(propertySchema, 'items'), ['x-model']));
				if (propertySchemaModelName === modelName) {
					modelAssociationProperties.push(propertyName);
				}
			});

			if (modelAssociationProperties.length) {
				result[definitionModelName] = modelAssociationProperties;
			}
		}
	});
	return result;
}