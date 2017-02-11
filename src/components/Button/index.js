import React, { PropTypes as T } from 'react';
import { bm, be } from 'client-core/src/utils/bem';

const Button = ({
	moduleName = 'Button',
	children,
}) => {
	return (
		<button className={bm(moduleName)}>{children}</button>
	);
};

Button.propTypes = {

};

export default Button;
