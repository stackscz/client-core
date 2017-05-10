'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

var _resolveSubschema = require('./resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findRelationLinkName = function findRelationLinkName(inputModelSchema, rel) {
	var modelSchema = (0, _resolveSchema2.default)(inputModelSchema);
	var matchingSchemaLink = (0, _get3.default)(modelSchema, ['x-links', rel]);
	if (matchingSchemaLink) {
		return matchingSchemaLink;
	}
	var childSchemas = (0, _get3.default)(modelSchema, 'allOf', []);
	var matchingSubschemaLink = (0, _reduce3.default)(childSchemas, function (result, _, childSchemaIndex) {
		if (result) {
			return result;
		}
		return findRelationLinkName((0, _resolveSubschema2.default)(modelSchema, ['allOf', childSchemaIndex]), rel);
	}, undefined);
	if (rel === 'self' && !matchingSubschemaLink) {
		return (0, _get3.default)(modelSchema, 'x-model');
	}
	return matchingSubschemaLink;
};

exports.default = findRelationLinkName;