import { get as g, set, isPlainObject, reduce, mapValues, cloneDeep } from 'lodash';
import dot from 'dot-object';

const normalizeValuesToValidate = (data, schema, registeredFields) => {
	const dataToValidate = {};
	const originalDotData = dot.dot(JSON.parse(JSON.stringify(data)));
	Object.keys(originalDotData).forEach(
		(valueKey) => {
			set(dataToValidate, valueKey, originalDotData[valueKey]);
		},
	);
	Object.keys(registeredFields).forEach(
		(fieldPath) => {
			const fieldType = registeredFields[fieldPath].type;
			const fieldValue = cloneDeep(g(data, fieldPath)); // dot-object mutates arguments 🙄
			set(dataToValidate, fieldPath, fieldType === 'FieldArray' ? (fieldValue || []) : fieldValue);
		},
	);
	return dataToValidate;
};

export default normalizeValuesToValidate;
