'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getFirstNonNullSchemaType = function getFirstNonNullSchemaType(schema) {
	var type = (0, _get3.default)(schema, 'type');
	// type can be an array of types!
	if ((0, _isArray3.default)(type)) {
		// pick first non-null type from type array
		type = type.reduce(function (typeResult, typeOption) {
			return typeResult || (typeOption !== 'null' ? typeOption : undefined);
		}, undefined);
	}
	return type;
};

exports.default = getFirstNonNullSchemaType;