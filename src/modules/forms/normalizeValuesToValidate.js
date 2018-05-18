import { get as g, set, isPlainObject, reduce, mapValues, clone, cloneDeepWith } from 'lodash';
import Immutable from 'immutable';
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
			const originalFieldValue = g(data, fieldPath);
			let fieldValue;

			fieldValue = cloneDeepWith(originalFieldValue, (value) => {
				if (Immutable.Iterable.isIterable(value)) {
					return {};
				}

				return clone(value);
			}); // dot-object mutates arguments 🙄

			set(dataToValidate, fieldPath, fieldType === 'FieldArray' ? (fieldValue || []) : fieldValue);
		},
	);

	return dataToValidate;
};

export default normalizeValuesToValidate;
