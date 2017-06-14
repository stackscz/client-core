import React from 'react';
import Bundle from '../components/Bundle';

const routeComponentFactory = (load) => {
	return (props) => {
		return (
			<Bundle load={load}>
				{(Comp) => (Comp ? <Comp {...props} /> : null)}
			</Bundle>
		);
	};
};

export default routeComponentFactory;
