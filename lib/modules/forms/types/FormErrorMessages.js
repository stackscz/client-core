"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FormErrorMessages = undefined;

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// recursive
var FormErrorMessages = exports.FormErrorMessages = _tcomb2.default.declare("FormErrorMessages");

FormErrorMessages.define(_tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.union([_tcomb2.default.String, FormErrorMessages])))