import React from 'react';
import { compose, pure } from 'recompose';
import { Link } from 'react-router';
import container from 'client-core/lib/decorators/container';
import { logout } from 'client-core/lib/modules/auth/actions';
import { userSelector } from 'client-core/lib/modules/auth/selectors';

import './index.sass';

const renderAppLayout = ({ header, children } = {}) => {
	return (
		<div className="AppLayout">
			<div className="AppLayout-header">
				{header}
			</div>
			<div className="AppLayout-contentWrapper">
				<div className="AppLayout-content">
					{children}
				</div>
			</div>
		</div>
	);
};

export default compose(
	pure
)(renderAppLayout);
