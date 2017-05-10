'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.JsonSchema = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _jsonschema = require('jsonschema');

var _schema = require('jsonschema/schema/draft-04/schema.json');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v = new _jsonschema.Validator(); // eslint-disable-line

v.addSchema(_schema2.default);

var isJSONSchema = function isJSONSchema(x) {
	// eslint-disable-line
	// TODO validate JSON Schema
	var errors = [];
	// const errors = v.validate(x, metaschema).errors;
	if (errors.length) {
		var errorMessage = errors.map(function (error, key) {
			return key + 1 + ': ' + error.property + ' = ' + (0, _stringify2.default)(error.instance) + ' ' + error.message;
		}).join('\n\n');
		throw new TypeError('Type validation failed: \n\n' + errorMessage);
	}
	return true;
};

var JsonSchema = exports.JsonSchema = _tcomb2.default.refinement(_tcomb2.default.Object, isJSONSchema, 'JsonSchema');