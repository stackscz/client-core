/* eslint-disable no-use-before-define */
import { isArray, map, isObject, isDate, isRegExp, isFunction, extend, mapValues } from 'lodash';
function deepMapValues(object, callback, propertyPath = '') {
	if (isArray(object)) {
		return map(object, deepMapValuesIteratee);
	} else if (isObject(object) && !isDate(object) && !isRegExp(object) && !isFunction(object)) {
		return extend({}, object, mapValues(object, deepMapValuesIteratee));
	}

	return callback(object, propertyPath);

	function deepMapValuesIteratee(value, key) {
		const valuePath = propertyPath ? `${propertyPath}.${key}` : key;
		return deepMapValues(value, callback, valuePath);
	}
}

export default deepMapValues;
