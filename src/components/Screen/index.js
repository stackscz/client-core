import React from 'react';
import './index.sass';

const Screen = ({ children } = {}) => {
	return (
		<div className="Screen">
			<div className="Screen-content">
				{children}
			</div>
		</div>
	);
};

export default Screen;
