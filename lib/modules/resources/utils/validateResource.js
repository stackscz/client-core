'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _jsonschema = require('jsonschema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (data, schema) {
	var v = new _jsonschema.Validator();
	v.addSchema(schema, 'responseBodySchema');
	var errors = v.validate(data, schema).errors;

	if (errors.length > 0) {
		var bodyValidationError = {
			code: 5005,
			message: 'Invalid resource format'
		};
		if (process.env.NODE_ENV === 'development') {
			bodyValidationError = (0, _extends3.default)({}, bodyValidationError, {
				data: data,
				expectedSchema: schema,
				validationErrors: errors
			});
		}
		throw bodyValidationError;
	}
};