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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findResourceLinksNames = function findResourceLinksNames(modelSchema) {
	var schemaLinks = (0, _get3.default)(modelSchema, 'x-links', {});
	var childSchemas = (0, _get3.default)(modelSchema, 'allOf', []);
	return (0, _extends3.default)({}, schemaLinks, (0, _reduce3.default)(childSchemas, function (result, childSchema) {
		return (0, _extends3.default)({}, result, findResourceLinksNames(childSchema));
	}, {}));
};

exports.default = findResourceLinksNames;