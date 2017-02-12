import React, { PropTypes as T } from 'react';
import { bm, be } from 'client-core/src/utils/bem';

const Button = ({
	moduleName = 'Button',
	children,
	...props,
}) => {
	return (
		<button
			className={bm(moduleName)}
			{...props}
		>
			{children}
		</button>
	);
};

Button.propTypes = {};

export default Button;
