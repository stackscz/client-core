'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assignDefaultsToObjectProperties = function assignDefaultsToObjectProperties(data, schema, registeredFields) {

	var dotData = _dotObject2.default.dot(JSON.parse((0, _stringify2.default)(data)));
	var dotTemplate = (0, _mapValues3.default)(registeredFields, function () {
		return undefined;
	});

	return _dotObject2.default.object((0, _assign2.default)({}, dotTemplate, dotData));
};

exports.default = assignDefaultsToObjectProperties;