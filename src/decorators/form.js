import React, { PropTypes as T } from 'react';
import { isEmpty } from 'lodash';
import { reduxForm, stopSubmit } from 'redux-form';
import { compose } from 'recompose';
import jsonSchemaDefaults from 'json-schema-defaults';
import validateByJsonSchema from 'client-core/src/utils/validateByJsonSchema';
import mergeWithArrays from 'client-core/src/utils/mergeWithArrays';
import container from 'client-core/src/decorators/container';

/**
 * Wraps component with redux-form enhanced with JSON schema validation
 *
 */
export default function form({
	schema = {},
	errorMessages = {},
	validate: userValidate,
	initialValues: userInitialValues,
	...config,
} = {}) {
	const initialValues = mergeWithArrays({}, jsonSchemaDefaults(schema), userInitialValues);
	const validate = (values, props) => {
		const {
			schema: propsSchema,
			errorMessages: propsErrorMessages,
		} = props;

		const validateJsonSchemaErrors = validateByJsonSchema(
			values,
			propsSchema || schema,
			propsErrorMessages || errorMessages
		);
		const userValidateErrors = userValidate ?
			userValidate(values, props) : {};

		return mergeWithArrays({}, validateJsonSchemaErrors, userValidateErrors);
	};

	return function wrapWithForm(WrappedComponent) {
		class FormContainer extends React.Component {

			static propTypes = {
				form: T.string,
				submitFailed: T.bool,
				errors: T.object,
				setExternalErrors: T.func.isRequired,
			};

			componentWillMount() {
				const { errors: nextErrors } = this.props;
				this.checkErrors({}, nextErrors, false);
			}

			componentWillReceiveProps(nextProps) {
				const { errors: currentErrors } = this.props;
				const { errors: nextErrors, submitFailed: nextSubmitFailed } = nextProps;
				this.checkErrors(currentErrors, nextErrors, nextSubmitFailed);
			}

			checkErrors(currentErrors, nextErrors, nextSubmitFailed) {
				if (
					!isEmpty(nextErrors) && !nextSubmitFailed && nextErrors !== currentErrors
				) {
					const { setExternalErrors, form: formName } = this.props;
					setExternalErrors(formName, nextErrors);
				}
			}

			render() {
				return (
					<WrappedComponent {...this.props} />
				);
			}
		}
		return compose(
			reduxForm({
				...config,
				validate,
				initialValues,
			}),
			container(
				false,
				(dispatch) => ({
					setExternalErrors: (targetForm, errors) => {
						dispatch(stopSubmit(targetForm, errors));
					},
				})
			)
		)(FormContainer);
	};
}
