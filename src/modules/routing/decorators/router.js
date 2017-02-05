import React from 'react';
import BrowserRouter from 'react-router-addons-controlled/ControlledBrowserRouter';
import container from 'client-core/src/decorators/container';
import { navigate } from 'client-core/src/modules/routing/actions';

export default ({ history } = {}) => {
	return (Component) => {
		const router = ({ location, action, doNavigate, history: propsHistory, ...otherProps } = {}) => {
			return (
				<BrowserRouter
					history={history || propsHistory}
					location={location}
					action={action}
					onChange={(nextLocation, nextAction) => {
						if (nextAction === 'SYNC') {
							doNavigate(nextLocation, action);
						} else {
							doNavigate(nextLocation, nextAction);
						}
					}}
				>
					<Component {...otherProps} />
				</BrowserRouter>
			);
		};

		return container(
			state => ({
				location: state.routing.location,
				action: state.routing.action,
			}),
			null,
			(stateProps, { dispatch }, { history, ...restOwnProps }) => ({
				...restOwnProps,
				...stateProps,
				history,
				doNavigate(location, action) {
					dispatch(navigate({ location, action }));
				},
			})
		)(router);
	};
};
