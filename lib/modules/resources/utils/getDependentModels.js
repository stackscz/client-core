'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = getDependentModels;

var _getComposingModels = require('./getComposingModels');

var _getComposingModels2 = _interopRequireDefault(_getComposingModels);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDependentModels(inputSchema) {
	if (!inputSchema) {
		return [];
	}
	var schema = (0, _resolveSchema2.default)(inputSchema);

	var definitions = (0, _get3.default)(schema, 'definitions');
	var modelName = (0, _get3.default)(schema, 'x-model');
	var result = [];

	(0, _each3.default)((0, _keys2.default)(definitions), function (definitionKey) {
		var definition = (0, _resolveSubschema2.default)(schema, ['definitions', definitionKey]);
		var otherModelName = (0, _get3.default)(definition, 'x-model');
		if (otherModelName) {
			var composingModels = (0, _getComposingModels2.default)(definition);
			if ((0, _includes3.default)(composingModels, modelName)) {
				result.push(otherModelName);
			}
		}
	});

	return result;
}