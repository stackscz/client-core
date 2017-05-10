'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isError2 = require('lodash/isError');

var _isError3 = _interopRequireDefault(_isError2);

exports.default = rethrowError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rethrowError(e) {
	if ((0, _isError3.default)(e)) {
		throw e;
	}
}