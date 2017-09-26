'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assignDefaultsToRequiredObjectProperties = function assignDefaultsToRequiredObjectProperties(data, schema) {
	var properties = (0, _get3.default)(schema, 'properties');
	var required = (0, _get3.default)(schema, 'required', []);
	var schemaType = (0, _get3.default)(schema, 'type', (0, _isPlainObject3.default)(properties) ? 'object' : false);
	if (schemaType === 'object') {
		var fixedData = data;
		if (!fixedData) {
			fixedData = {};
		}
		fixedData = (0, _reduce3.default)(required, function (acc, requiredPropertyName) {
			var propertySchema = (0, _get3.default)(properties, requiredPropertyName);
			if (propertySchema) {
				var assignedDefault = assignDefaultsToRequiredObjectProperties((0, _get3.default)(fixedData, requiredPropertyName), propertySchema);
				if (assignedDefault) {
					return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, requiredPropertyName, assignedDefault));
				}
			}
			return acc;
		}, fixedData);
		return fixedData;
	}
	return data;
};

exports.default = assignDefaultsToRequiredObjectProperties;