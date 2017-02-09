import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import './index.sass';

const renderContextHeading = ({ children } = {}) => {
	return (
		<div className="ContextHeading">
			{children}
		</div>
	);
};

const ContextHeading = renderContextHeading;

export default ContextHeading;
