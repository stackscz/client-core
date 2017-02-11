import React, { PropTypes as T } from 'react';
import { bm, be } from 'client-core/src/utils/bem';

const Icon = ({
	moduleName = 'Icon',
	name,
}) => {
	return (
		<span className={bm(moduleName, { [name]: true })} />
	);
};

export default Icon;
