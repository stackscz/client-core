"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = function (moduleName) {
	var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (state) {
		return state;
	};
	var sagas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	return {
		reducers: (0, _defineProperty3.default)({}, moduleName, reducer),
		sagas: sagas
	};
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }