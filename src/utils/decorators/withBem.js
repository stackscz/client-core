import React from 'react';
import { bm, be } from 'client-core/src/utils/bem';

/**
 * @example
 const mapPropsToBem = ({ theme, size }) => ({
    block: "Button",
    modifiers: [theme, size],
    elements: [{ element: "text", modifiers: [theme, size], classes: 'myExtraClass' }],
    classes: 'myExtraClass',
  });
 * @param mapPropsToBem
 */
export default mapPropsToBem => WrappedComponent => props => {
	const {
		block: blockName,
		modifiers,
		elements: els = [],
		classes,
	} = mapPropsToBem(props);

	const block = bm(blockName, modifiers, classes);

	const elements = els.reduce(
		(acc, { element: elementName, modifiers: elementModifiers, classes: elementClasses }) => ({
			...acc,
			[elementName]: be(
				blockName,
				elementName,
				elementModifiers,
				elementClasses,
			),
		}),
		{},
	);

	const classNames = {
		block,
		elements,
	};

	return <WrappedComponent {...props} classNames={classNames} />;
};
