"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.StoreConfig = undefined;

var _tcomb = require("tcomb");

var _tcomb2 = _interopRequireDefault(_tcomb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StoreConfig = exports.StoreConfig = _tcomb2.default.interface({
	logging: _tcomb2.default.maybe(_tcomb2.default.Boolean),
	reducers: _tcomb2.default.maybe(_tcomb2.default.Object),
	sagas: _tcomb2.default.maybe(_tcomb2.default.list(_tcomb2.default.Function)),
	enhancers: _tcomb2.default.maybe(_tcomb2.default.list(_tcomb2.default.Function))
}, "StoreConfig");