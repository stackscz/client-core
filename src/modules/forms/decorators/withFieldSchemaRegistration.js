import { noop } from 'lodash';
import { compose, lifecycle, getContext } from 'recompose';
import { connect } from 'react-redux';
import { registerFieldSchema, unregisterFieldSchema } from '../actions';

const getSectionFieldName = (sectionPrefix, name) => `${sectionPrefix ? `${sectionPrefix}.` : ''}${name}`;

export default ({ schema }) => {
	return compose(
		connect(),
		getContext({ _reduxForm: noop }),
		lifecycle(
			{
				componentWillMount() {
					const { dispatch, _reduxForm: { sectionPrefix, form }, name } = this.props;
					dispatch(registerFieldSchema({ form, name: getSectionFieldName(sectionPrefix, name), schema }));
				},
				componentWillUnmount() {
					const { dispatch, _reduxForm: { sectionPrefix, form }, name } = this.props;
					dispatch(unregisterFieldSchema({ form, name: getSectionFieldName(sectionPrefix, name) }));
				}
			},
		),
	);
};
