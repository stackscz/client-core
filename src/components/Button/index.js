import React, { PropTypes as T } from 'react';
import { bm, be } from 'client-core/src/utils/bem';

const Button = ({
	moduleName = 'Button',
	children,
	type = 'button',
	...props,
}) => {
	return (
		<button
			className={bm(moduleName)}
			type={type}
			{...props}
		>
			{children}
		</button>
	);
};

Button.propTypes = {};

export default Button;
