import { get as g, isPlainObject, cloneDeep, reduce, setWith } from 'lodash';
import jsonschema from 'jsonschema';
import dot from 'dot-object';
import mergeWithArrays from 'modules/forms/mergeWithArrays';
import type { JsonSchema } from 'modules/forms/types/JsonSchema';
import type { FormErrorMessages } from 'modules/forms/types/FormErrorMessages';

export default function (dataToValidate, schema: JsonSchema = {}, errorMessages: FormErrorMessages = {}, requiredPaths = [], notRequiredPaths = []) {
	const validate = jsonschema.validate(dataToValidate, schema);
	if (validate.valid) {
		return {};
	}

	let dotNotationErrors = validate.errors.reduce(
		(acc, err) => {
			let errorPath;

			if (err.name === 'allOf' || err.name === 'anyOf') {
				return acc;
			}

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

			// errorMessages don't care about which element exactly has the error.
			const errorMessagePath = `${errorPath}.${err.name}`.replace(/\[\d+\]/, '');

			const errorMessage = dot.pick(errorMessagePath, errorMessages) || `${err.name}`;

			return mergeWithArrays(
				acc,
				{
					[errorPath]: [errorPath].errorMessage ? `${[errorPath].errorMessage} ${errorMessage}`
						: errorMessage,
				}
			);
		},
		{}
	);

	dotNotationErrors = notRequiredPaths.reduce(
		(acc, errorKey) => {
			if (acc[errorKey] === 'required') {
				delete acc[errorKey];
			}
			return acc;
		},
		dotNotationErrors,
	);

	dotNotationErrors = requiredPaths.reduce(
		(acc, errorKey) => {
			if (acc[errorKey] !== 'required' && !g(dataToValidate, errorKey)) {
				acc[errorKey] = 'required';
			}
			return acc;
		},
		dotNotationErrors,
	);

	const errors = dot.object(dotNotationErrors);

	return errors;
}
