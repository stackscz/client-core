'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = getComposingModels;

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getComposingModels(inputSchema) {
	if (!inputSchema) {
		return [];
	}
	var schema = (0, _resolveSchema2.default)(inputSchema);
	var modelName = (0, _get3.default)(schema, 'x-model');
	var result = modelName ? [modelName] : [];
	var allOf = (0, _get3.default)(schema, 'allOf');
	if (allOf) {
		return (0, _reduce3.default)(allOf, function (currentModels, _, partialSchemaIndex) {
			return [].concat((0, _toConsumableArray3.default)(currentModels), (0, _toConsumableArray3.default)(getComposingModels((0, _resolveSubschema2.default)(schema, ['allOf', partialSchemaIndex]))));
		}, result);
	}
	return result;
}