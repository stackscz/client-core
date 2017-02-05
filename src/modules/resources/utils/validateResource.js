import { Validator as JSONSchemaValidator } from 'jsonschema';

export default (data, schema) => {
	const v = new JSONSchemaValidator;
	v.addSchema(schema, 'responseBodySchema');
	const errors = v.validate(data, schema).errors;

	if (errors.length > 0) {
		let bodyValidationError = {
			code: 5005,
			message: 'Invalid resource format',
		};
		if (process.env.NODE_ENV === 'development') {
			bodyValidationError = {
				...bodyValidationError,
				data,
				expectedSchema: schema,
				validationErrors: errors,
			};
		}
		throw bodyValidationError;
	}
};
