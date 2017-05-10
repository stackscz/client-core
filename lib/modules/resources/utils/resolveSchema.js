'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _findSchemaByRef = require('./findSchemaByRef');

var _findSchemaByRef2 = _interopRequireDefault(_findSchemaByRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (schema) {
	var schemaRef = (0, _get3.default)(schema, '$ref');

	if (schemaRef) {
		var foundSchema = (0, _findSchemaByRef2.default)(schemaRef, schema);
		(0, _invariant2.default)(foundSchema, 'Could not find schema at %s', schemaRef);
		return (0, _extends3.default)({}, foundSchema, { definitions: (0, _get3.default)(schema, 'definitions') });
	}
	return schema;
};