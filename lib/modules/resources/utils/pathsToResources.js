'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _fastMemoize2.default)(function (paths) {
	return (0, _reduce3.default)(paths, function (acc, path) {
		var linkName = (0, _get3.default)(path, 'x-linkName');
		if (linkName) {
			return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, linkName, path));
		}
		return acc;
	}, {});
});