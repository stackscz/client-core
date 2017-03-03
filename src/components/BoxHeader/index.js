import React, { PropTypes as T } from 'react';
import './index.sass'

const BoxHeader = ({ title, children, rightContent }) => {
    return (
        <div className="BoxHeader">
            <h1 className="BoxHeader-title">{title}</h1>
	        {children}
            <div className="BoxHeader-rightContent">
	            {rightContent}
            </div>
        </div>
    );
};

export default BoxHeader;
