'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var normalizeValuesToValidate = function normalizeValuesToValidate(data, schema, registeredFields) {
	var dataToValidate = {};
	var originalDotData = _dotObject2.default.dot(JSON.parse((0, _stringify2.default)(data)));
	(0, _keys2.default)(originalDotData).forEach(function (valueKey) {
		(0, _set3.default)(dataToValidate, valueKey, originalDotData[valueKey]);
	});
	(0, _keys2.default)(registeredFields).forEach(function (fieldPath) {
		var fieldType = registeredFields[fieldPath].type;
		var fieldValue = (0, _cloneDeep3.default)((0, _get3.default)(data, fieldPath)); // dot-object mutates arguments 🙄
		(0, _set3.default)(dataToValidate, fieldPath, fieldType === 'FieldArray' ? fieldValue || [] : fieldValue);
	});
	return dataToValidate;
};

exports.default = normalizeValuesToValidate;