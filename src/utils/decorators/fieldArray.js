import richField from 'client-core/src/utils/decorators/richField';

export default ({
	containsLabel = true,
	submitFailedKey = 'arraySubmitFailed',
	defaultErrorModifiers = 'left inline',
	canBeTouched = false,
	...otherOptions,
} = {}) => richField({
	containsLabel,
	submitFailedKey,
	defaultErrorModifiers,
	canBeTouched,
	...otherOptions,
});
