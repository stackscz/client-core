import { noop } from 'lodash';
import { compose, lifecycle, getContext } from 'recompose';
import { connect } from 'react-redux';
import { registerFieldSchema, unregisterFieldSchema } from '../actions';

export default ({ schema }) => {
	return compose(
		connect(),
		getContext({ _reduxForm: noop }),
		lifecycle(
			{
				componentWillMount() {
					const { dispatch, _reduxForm: { form }, name } = this.props;
					dispatch(registerFieldSchema({ form, name, schema }));
				},
				componentWillUnmount() {
					const { dispatch, _reduxForm: { form }, name } = this.props;
					dispatch(unregisterFieldSchema({ form, name }));
				}
			},
		),
	);
};
