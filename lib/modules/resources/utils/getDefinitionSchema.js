'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _resolveSchema = require('./resolveSchema');

var _resolveSchema2 = _interopRequireDefault(_resolveSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (name, definitions) {
	var defintion = (0, _get3.default)(definitions, name);
	if (!defintion) {
		return undefined;
	}
	return (0, _resolveSchema2.default)((0, _extends3.default)({}, defintion, {
		definitions: definitions
	}));
};