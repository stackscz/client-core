import { get as g, isPlainObject, reduce } from 'lodash';

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
				const propertySchema = g(properties, requiredPropertyName);
				if (propertySchema) {
					const assignedDefault = assignDefaultsToRequiredObjectProperties(g(fixedData, requiredPropertyName), propertySchema);
					if (assignedDefault) {
						return {
							...acc,
							[requiredPropertyName]: assignedDefault,
						}
					}
				}
				return acc;
			},
			fixedData,
		);
		return fixedData;
	}
	return data;
};

export default assignDefaultsToRequiredObjectProperties;
