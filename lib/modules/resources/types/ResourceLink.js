"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ResourceLink = undefined;

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResourceLink = exports.ResourceLink = _tcomb2.default.interface({
	name: _tcomb2.default.String,
	params: _tcomb2.default.maybe(_tcomb2.default.Object)
}, "ResourceLink");