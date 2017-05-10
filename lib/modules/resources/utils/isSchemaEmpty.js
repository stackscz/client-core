'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSchemaEmpty = function isSchemaEmpty(schema) {
	return !schema || (0, _get3.default)(schema, 'definitions') && (0, _keys2.default)(schema).length === 1;
};

exports.default = isSchemaEmpty;