import { get as g } from 'lodash';
import container from 'client-core/src/decorators/container';
import {
	compose,
	setDisplayName,
	getDisplayName,
} from 'recompose';
import { login } from 'client-core/src/modules/auth/actions';

export default (Component) => {
	return compose(
		setDisplayName(`${getDisplayName(Component)}`),
		container(
			(state) => {
				const { authenticating, error } = state.auth;
				const presetUsername = g(state, 'routing.location.query.presetUsername');
				return {
					authenticating,
					loginError: error,
					presetUsername,
				};
			},
			(dispatch) => ({
				handleLogin: (values) => {
					dispatch(login(values));
				},
				// handleResetForm: () => {
				// 	dispatch(resetForm('login-form'));
				// },
			})
		)
	)(Component);
};
