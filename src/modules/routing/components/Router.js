import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

export default ({ history, routes }) => {
	return (
		<ConnectedRouter history={history}>
			<Switch>
				{routes.map((route, i) => (<Route key={i} {...route} />))}
			</Switch>
		</ConnectedRouter>
	);
}
