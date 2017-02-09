import { get as g, isArray } from 'lodash';

const getFirstNonNullSchemaType = (schema) => {
	let type = g(schema, 'type');
	// type can be an array of types!
	if (isArray(type)) {
		// pick first non-null type from type array
		type = type.reduce(
			(typeResult, typeOption) => (typeResult || (typeOption !== 'null' ? typeOption : undefined)),
			undefined,
		);
	}
	return type;
};

export default getFirstNonNullSchemaType;
