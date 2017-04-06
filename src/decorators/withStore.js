import React from 'react';
import { nest } from 'recompose';
import { Provider } from 'react-redux';

export default Component => props => (
	<Provider store={props.store}>
		<Component {...props} />
	</Provider>
);
