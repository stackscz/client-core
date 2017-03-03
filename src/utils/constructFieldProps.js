import { get as g, isArray } from 'lodash';

export default ({
	modifiers,
	errorModifiers,
	meta,
	input,
	canBeTouched,
	submitFailed,
	containsLabel,
}) => {
	let showError = false;
	if (meta) {
		const {
			error,
			touched,
			dirty,
		} = meta;
		const val = g(input, 'value');
		const isDirty = dirty && (!isArray(val) || val.length);
		showError = (
			error &&
			(
				((touched || !canBeTouched) && (isDirty || submitFailed))
			)
		);
	}

	const newModifiers = [showError && 'error'].concat(modifiers).filter(Boolean);

	return {
		showError,
		errorModifiers,
		modifiers: !!newModifiers.length ? newModifiers.join(' ') : undefined,
		containsLabel,
	};
};
