'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = getIdPropertyName;

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getIdPropertyName(inputSchema) {
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var idPropertyName = (0, _get3.default)(schema, 'x-idPropertyName');
	if (idPropertyName) {
		return idPropertyName;
	}
	var allOf = (0, _get3.default)(schema, 'allOf');
	if (allOf) {
		return (0, _reduce3.default)(allOf, function (currentIdPropertyName, _, partialSchemaIndex) {
			if (currentIdPropertyName) {
				return currentIdPropertyName;
			}
			return getIdPropertyName((0, _resolveSubschema2.default)(schema, ['allOf', partialSchemaIndex]));
		}, undefined);
	}
	return undefined;
}