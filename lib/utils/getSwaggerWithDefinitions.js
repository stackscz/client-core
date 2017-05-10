"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (swagger, definitionsContext) {
	return (0, _extends4.default)({}, swagger, {
		definitions: definitionsContext.keys().reduce(function (currentDefinitions, key) {
			return (0, _extends4.default)({}, currentDefinitions, (0, _defineProperty3.default)({}, key.match(/([a-z]+)/ig)[0], definitionsContext(key).default));
		}, {})
	});
};