import { get as g, isPlainObject, cloneDeep, reduce, setWith, omitBy } from 'lodash';
import { Validator } from 'jsonschema';
import dot from 'dot-object';
import mergeWithArrays from 'modules/forms/mergeWithArrays';
import type { JsonSchema } from 'modules/forms/types/JsonSchema';
import type { FormErrorMessages } from 'modules/forms/types/FormErrorMessages';

const validator = new Validator();
const originalAnyOf = validator.attributes.anyOf;
validator.attributes.anyOf = function (data, schema, ...args) {
	// @FIXME use only option in typeName enum as match for typeName instead of schema title, make typeName property name configurable
	if (!isPlainObject(data) || !data.typeName) {
		return originalAnyOf.apply(this, [data, schema, ...args]);
	}
	const typeName = data.typeName;
	const concreteSchema = schema.anyOf.reduce((acc, subSchema) => subSchema.title === typeName ? subSchema : acc, null);
	if (!concreteSchema) {
		return originalAnyOf.apply(this, [data, schema, ...args]);
	}
	return this.validate(data, concreteSchema, ...args);
};

export default function (dataToValidate, schema: JsonSchema = {}, errorMessages: FormErrorMessages = {}, requiredPaths = [], notRequiredPaths = []) {
	const validationResult = validator.validate(dataToValidate, schema);
	if (validationResult.valid) {
		return {};
	}

	let dotNotationErrors = validationResult.errors.reduce(
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

	dotNotationErrors = omitBy(
		dotNotationErrors,
		(error, key) => {
			return key.endsWith('typeName');
		},
	);

	const errors = dot.object(dotNotationErrors);

	return errors;
}
