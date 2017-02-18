import React from 'react';
import { get as g, isArray } from 'lodash';
import { compose, withProps } from 'recompose';

export default () => compose(
	withProps(
		({ meta = {}, input = {}, canBeTouched = true }) => {
			const {
				error,
				touched,
				dirty,
				submitFailed,
			} = meta;
			const value = g(input, 'value');
			const isDirty = dirty && (!isArray(value) || value.length);
			return {
				showError: (
					error &&
					(
						((touched || !canBeTouched) && (isDirty || submitFailed))
					)
				)
			};
		}
	),
);
