'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _getDefinitionSchema = require('./getDefinitionSchema');

var _getDefinitionSchema2 = _interopRequireDefault(_getDefinitionSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
	var paths = _ref.paths,
	    definitions = _ref.definitions,
	    link = _ref.link;

	var schema = (0, _reduce3.default)(paths, function (schemaResult, pathSpec) {
		if (schemaResult) {
			return schemaResult;
		}
		if ((0, _get3.default)(pathSpec, 'x-linkName') === link.name) {
			var presetResourceSchema = (0, _get3.default)(pathSpec, 'x-schema');
			if (presetResourceSchema) {
				return (0, _resolveSchema2.default)((0, _extends3.default)({}, presetResourceSchema, { definitions: definitions }));
			}
			return (0, _reduce3.default)(['get.responses.200.schema'], function (linkSchemaResult, schemaPath) {
				if (linkSchemaResult) {
					return linkSchemaResult;
				}
				var subschema = (0, _get3.default)(pathSpec, schemaPath);
				if (subschema) {
					return (0, _extends3.default)({}, (0, _get3.default)(pathSpec, schemaPath), { definitions: definitions });
				}
				return linkSchemaResult;
			}, undefined);
		}
		return schemaResult;
	}, undefined);

	if (!schema) {
		schema = (0, _getDefinitionSchema2.default)(link.name, definitions);
	}

	return (0, _resolveSchema2.default)(schema);
};