import { get as g, reduce, isString } from 'lodash';
import Immutable from 'immutable';

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
	if (Immutable.Iterable.isIterable(data)) {
		return data;
	};

	return reduce(data, (acc, propertyValue, propertyName) => {
		const propertySchema = g(schema, ['properties', propertyName]);
		const type = g(propertySchema, 'type');

		// omit empty string property
		if (isString(propertyValue) && propertyValue.length === 0) {
			return acc;
		}

		// recursively walk inner object properties
		if (type === 'object' && propertyValue) {
			return {
				...acc,
				[propertyName]: normalizeEmptyValues(propertyValue, propertySchema),
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
