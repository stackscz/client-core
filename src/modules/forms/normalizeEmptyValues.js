import { get as g, reduce, isString, map } from 'lodash';

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
const normalizeEmptyValues = (data, schema) => {
	const properties = g(schema, 'properties');

	return reduce(properties, (acc, propertySchema, propertyName) => {
		const type = g(propertySchema, 'type');
		const propertyValue = g(data, propertyName);

		// omit empty string property
		if (isString(propertyValue) && propertyValue.length === 0) {
			return acc;
		}

		// recursively walk inner object properties
		if (type === 'object') {
			return {
				...acc,
				[propertyName]: normalizeEmptyValues(propertyValue, propertySchema),
			}
		}

		if (type === 'array') {
			const arrayOfType = g(propertySchema, 'items');

			if (isString(arrayOfType)) { // means array of 'string', 'number' etc
				return {
					...acc,
					[propertyName]: propertyValue,
				};
			}

			// otherwise arrayOfType is actually schema
			return {
				...acc,
				[propertyName]: map(propertyValue, (arrayItem) => normalizeEmptyValues(arrayItem, arrayOfType)),
			}
		}

		// any other property
		return {
			...acc,
			[propertyName]: propertyValue,
		};
	}, {});
};

export default normalizeEmptyValues;
