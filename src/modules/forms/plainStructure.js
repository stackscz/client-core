import reduxFormStructure from 'redux-form/lib/structure/plain';
import React from 'react';
import { isEqualWith } from 'lodash';
import Immutable from 'immutable';

const structure = {
	...reduxFormStructure,
	deepEqual: (object, objectOther) => {
		return isEqualWith(object, objectOther, (obj, other) => {
			if (obj === other) return true

			if (
				Immutable.Iterable.isIterable(obj) ||
				Immutable.Iterable.isIterable(other)
			) {
				return obj === other;
			}


			if (!obj && !other) {
			  const objIsEmpty = obj === null || obj === undefined || obj === ''
			  const otherIsEmpty = other === null || other === undefined || other === ''
			  return objIsEmpty === otherIsEmpty
			}

			if (obj && other && obj._error !== other._error) return false
			if (obj && other && obj._warning !== other._warning) return false
			if (React.isValidElement(obj) || React.isValidElement(other)) return false
		});
	},
};

export default structure;
