/* eslint-disable react/prop-types */
import React from 'react';
import constuctFieldProps from 'client-core/src/utils/constructFieldProps';
import RichField from 'one-ui-core/components/RichField';

export default ({
	containsLabel = false,
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
		<RichField
			{...props}
			{...hocProps}
		>
			<FieldComponent
				showError={hocProps.showError}
				{...props}
				modifiers={hocProps.modifiers}
			/>
		</RichField>
	);
};
