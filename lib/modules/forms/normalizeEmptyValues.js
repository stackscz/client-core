'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Omits empty string properties ("")
 *
 * Since empty form inputs are in form values object represented as empty strings (""),
 * thus doesn't violate required rule, this is needed to JSON Schema validator work properly.
 *
 * @param  {{}} data   form values
 * @param  {{}} schema
 * @return {{}}
 */
var normalizeEmptyValues = function normalizeEmptyValues(data, schema) {
	if (_immutable2.default.Iterable.isIterable(data)) {
		return data;
	};

	return (0, _reduce3.default)(data, function (acc, propertyValue, propertyName) {
		var propertySchema = (0, _get3.default)(schema, ['properties', propertyName]);
		var type = (0, _get3.default)(propertySchema, 'type');

		// omit empty string property
		if ((0, _isString3.default)(propertyValue) && propertyValue.length === 0) {
			return acc;
		}

		// recursively walk inner object properties
		if (type === 'object' && propertyValue) {
			return (0, _extends5.default)({}, acc, (0, _defineProperty3.default)({}, propertyName, normalizeEmptyValues(propertyValue, propertySchema)));
		}

		// any other property
		return (0, _extends5.default)({}, acc, (0, _defineProperty3.default)({}, propertyName, propertyValue));
	}, {});
};

exports.default = normalizeEmptyValues;