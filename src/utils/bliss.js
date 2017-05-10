import classnames from 'classnames';

/**
 * Low-level utility for handling dynamic prefix/modifiers.
 *
 * @param {string} prefix
 * @param {string|array|object} modifiers
 * @param {string|array|object} classes
 * @returns {string}
 */
export const item = (prefix, modifiers, classes) => {
	const blissClass = [prefix];
	const normalizedModifiers = modifiers ? classnames(modifiers) : false;
	const normalizedClasses = classes ? classnames(classes) : false;

	if (normalizedModifiers) {
		blissClass.push(
			normalizedModifiers
				.trim()
				.split(' ')
				.map(mod => `${prefix}--${mod}`)
				.join(' ')
		);
	}

	if (normalizedClasses) {
		blissClass.push(normalizedClasses);
	}

	return blissClass.join(' ');
};

/**
 * High-level utility for handling Bliss module with dynamic name/modifiers.
 *
 * @param {string} moduleName
 * @param {string|array|object} modifiers
 * @param {string|array|object} classes
 * @returns {string}
 */
export const blissModule = (moduleName, modifiers = false, classes = false) => {
	return item(moduleName, modifiers, classes);
};

/**
 * High-level utility for handling Bliss element with dynamic name/modifiers.
 *
 * @param {string} moduleName
 * @param {string} elementName
 * @param {string|array|object} modifiers
 * @param {string|array|object} classes
 * @returns {string}
 */
export const blissElement = (moduleName, elementName, modifiers = false, classes = false) => {
	return item(`${moduleName}-${elementName}`, modifiers, classes);
};

export const bm = blissModule;
export const be = blissElement;
