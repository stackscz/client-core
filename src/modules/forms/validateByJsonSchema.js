import { get as g, isPlainObject, cloneDeep, reduce } from 'lodash';
import jsonschema from 'jsonschema';
import dot from 'dot-object';
import mergeWithArrays from 'modules/forms/mergeWithArrays';
import type { JsonSchema } from 'modules/forms/types/JsonSchema';
import type { FormErrorMessages } from 'modules/forms/types/FormErrorMessages';

const assignDefaultsToRequiredObjectProperties = (data, schema) => {
	const properties = g(schema, 'properties');
	const required = g(schema, 'required', []);
	const schemaType = g(schema, 'type', isPlainObject(properties) ? 'object' : false);
	if (schemaType === 'object') {
		let fixedData = data;
		if (!fixedData) {
			fixedData = {};
		}
		fixedData = reduce(
			required,
			(acc, requiredPropertyName) => {
				if (!g(acc, requiredPropertyName)) {
					const propertySchema = g(properties, requiredPropertyName);
					if (propertySchema) {
						const assignedDefault = assignDefaultsToRequiredObjectProperties(g(fixedData, requiredPropertyName), propertySchema);
						if (assignedDefault) {
							return {
								...acc,
								[requiredPropertyName]: assignedDefault,
							}
						}
						return acc;
					}
				}
			},
			fixedData,
		);
		return fixedData;
	}
	return data;
};

export default function (dataToValidate,
	schema: JsonSchema = {},
	errorMessages: FormErrorMessages = {},) {
	let dataToValidateWithDefaults = cloneDeep(dataToValidate);
	dataToValidateWithDefaults = assignDefaultsToRequiredObjectProperties(dataToValidateWithDefaults, schema);
	const validate = jsonschema.validate(dataToValidateWithDefaults, schema);
	const errors = validate.valid ? {}
		: dot.object(
			validate.errors.reduce((allErrs, err) => {
				let errorPath;

				if (err.name === 'required') {
					errorPath = `${err.property}.${err.argument}`;

					if (err.schema.type === 'object') {
						const errTypePath = `schema.properties.${err.argument}.type`;
						const errType = dot.pick(errTypePath, err);

						// Redux `FieldArray` needs a special treatment.
						if (errType === 'array') {
							errorPath += '._error';
						}
					}
				} else {
					errorPath = err.property;

					if (err.schema.type === 'array') {
						errorPath += '._error';
					}
				}

				errorPath = errorPath.replace('instance.', '');

				const errorMessagePath = `${errorPath}.${err.name}`
					.replace(/\[\d+\]/, ''); // errorMessages don't care about which element exactly has the error.

				const errorMessage = dot.pick(errorMessagePath, errorMessages) || `${err.name}`;

				return mergeWithArrays(
					{},
					allErrs,
					{
						[errorPath]: [errorPath].errorMessage ? `${[errorPath].errorMessage} ${errorMessage}`
							: errorMessage,
					}
				);
			}, {})
		);

	return errors;
}
