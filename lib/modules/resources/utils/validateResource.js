'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jsonschema = require('jsonschema');

exports.default = function (data, schema) {
	var v = new _jsonschema.Validator();
	v.addSchema(schema, 'responseBodySchema');
	var errors = v.validate(data, schema).errors;

	if (errors.length > 0) {
		var bodyValidationError = {
			code: 5005,
			message: 'Invalid resource format',
			data: data,
			expectedSchema: schema,
			validationErrors: errors
		};
		throw bodyValidationError;
	}
};