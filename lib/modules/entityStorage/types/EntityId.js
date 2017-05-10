"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntityId = undefined;

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EntityId = exports.EntityId = _tcomb2.default.union([_tcomb2.default.Number, _tcomb2.default.String], "EntityId");