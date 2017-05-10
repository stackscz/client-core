"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ResourcesService = undefined;

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResourcesService = exports.ResourcesService = _tcomb2.default.interface({
	getResource: _tcomb2.default.Function,
	postResource: _tcomb2.default.Function,
	putResource: _tcomb2.default.Function,
	deleteResource: _tcomb2.default.Function
}, "ResourcesService");