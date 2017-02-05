import { mergeWith, isArray, union } from 'lodash';

const mergeWithArraysUnique = (objVal, srcVal) => {
	if (!isArray(objVal) || !isArray(srcVal)) {
		return undefined;
	}
	return union(objVal, srcVal);
};

export default function (...params) {
	return mergeWith(...params, mergeWithArraysUnique);
}
