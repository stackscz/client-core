import classnames from 'classnames';

/**
 * @see Tests for usage.
 */


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
				.map(mod => {
					if (mod[0] !== ':') {
						return `${prefix}--${mod}`;
					}
					return `${prefix}${mod}`;
				})
				.join(' ')
		);
	}

	if (normalizedClasses) {
		blissClass.push(normalizedClasses);
	}

	return blissClass.join(' ');
};

/**
 * High-level utility for handling BEM module with dynamic name/modifiers.
 *
 * @param {string} moduleName
 * @param {string|array|object} modifiers
 * @param {string|array|object} classes
 * @returns {string}
 */
export const module = (moduleName, modifiers = false, classes = false) => {
	return item(moduleName, modifiers, classes);
};

/**
 * High-level utility for handling BEM element with dynamic name/modifiers.
 *
 * @param {string} moduleName
 * @param {string} elementName
 * @param {string|array|object} modifiers
 * @param {string|array|object} classes
 * @returns {string}
 */
export const element = (moduleName, elementName, modifiers = false, classes = false) => {
	return item(`${moduleName}-${elementName}`, modifiers, classes);
};

export const bm = module;
export const be = element;
