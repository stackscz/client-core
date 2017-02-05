import container from 'client-core/src/decorators/container';
import {
	compose,
	setDisplayName,
	getDisplayName,
} from 'recompose';
import {

} from 'client-core/src/modules/auth/actions';

export default (Component) => {
	return compose(
		setDisplayName(`${getDisplayName(Component)}`),
		container(
			(state) => {

			},
			null,
			(stateProps, { dispatch }, ownProps) => {
				return {
					signup: () => {
						dispatch(

						)
					},
				},
			}
		)
	)(Component);
};
