'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalizeValuesToValidate = function normalizeValuesToValidate(data, schema, registeredFields) {
	var originalDotData = _dotObject2.default.dot(JSON.parse((0, _stringify2.default)(data)));
	var normalizedDotData = (0, _keys2.default)(registeredFields).reduce(function (acc, fieldName) {
		var fieldType = registeredFields[fieldName].type;
		var fieldValue = (0, _cloneDeep3.default)((0, _get3.default)(data, fieldName)); // dot-object mutates arguments 🙄
		return (0, _extends3.default)({}, acc, _dotObject2.default.dot((0, _defineProperty3.default)({}, fieldName, fieldType === 'FieldArray' ? fieldValue || [] : fieldValue)));
	}, {});

	return _dotObject2.default.object((0, _assign2.default)({}, originalDotData, normalizedDotData));
};

exports.default = normalizeValuesToValidate;