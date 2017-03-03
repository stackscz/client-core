import React from 'react';
import constuctFieldProps from 'client-core/src/utils/constructFieldProps';

export default ({
	containsLabel = true,
	submitFailedKey = 'submitFailed',
	defaultErrorModifiers = '',
	canBeTouched = true,
} = {}) => FieldComponent => (props) => {
	const {
		modifiers,
		errorModifiers = defaultErrorModifiers,
		meta,
		input,
	} = props;
	const hocProps = constuctFieldProps({
		modifiers,
		errorModifiers,
		meta,
		input,
		canBeTouched,
		submitFailed: props[submitFailedKey],
		containsLabel,
	});
	return (
		<FieldComponent
			{...props}
			{...hocProps}
		/>
	);
};
