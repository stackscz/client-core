"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.AppError = undefined;

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppError = exports.AppError = _tcomb2.default.interface({
	code: _tcomb2.default.Number,
	message: _tcomb2.default.String,
	data: _tcomb2.default.maybe(_tcomb2.default.Any)
}, "AppError");