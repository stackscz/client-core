'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (error) {
	return (0, _get3.default)(error, 'code') === 5000;
};