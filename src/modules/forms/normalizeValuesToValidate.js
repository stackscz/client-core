import { get as g, isPlainObject, reduce, mapValues, cloneDeep } from 'lodash';
import dot from 'dot-object';

const normalizeValuesToValidate = (data, schema, registeredFields) => {
	const originalDotData = dot.dot(JSON.parse(JSON.stringify(data)));
	const normalizedDotData = Object.keys(registeredFields).reduce(
		(acc, fieldName) => {
			const fieldType = registeredFields[fieldName].type;
			const fieldValue = cloneDeep(g(data, fieldName)); // dot-object mutates arguments 🙄
			return {
				...acc,
				...dot.dot({ [fieldName]: fieldType === 'FieldArray' ? (fieldValue || []) : fieldValue }),
			};
		},
		{},
	);

	return dot.object(
		Object.assign(
			{},
			originalDotData,
			normalizedDotData,
		),
	);
};

export default normalizeValuesToValidate;
