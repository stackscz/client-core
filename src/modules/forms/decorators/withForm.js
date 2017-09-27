import React, { PropTypes as T } from 'react';
import { isEmpty, reduce, constant } from 'lodash';
import dot from 'dot-object';
import { reduxForm, stopSubmit } from 'redux-form';
import { compose, withProps, branch } from 'recompose';
import { connect } from 'react-redux';

import validateByJsonSchema from '../validateByJsonSchema';
import mergeWithArrays from '../mergeWithArrays';
import assignDefaultsToRequiredObjectProperties from '../assignDefaultsToRequiredObjectProperties';

/**
 * Wraps component with redux-form enhanced with JSON schema validation
 *
 */
export default function withForm({
	schema = {},
	errorMessagesPrefix,
	errorMessages = {},
	validate: userValidate,
	initialValues,
	...config
} = {}) {
	const validate = (values, props) => {
		const {
			schema: propsSchema,
			errorMessagesPrefix: propsErrorMessagesPrefix,
			errorMessages: propsErrorMessages,
			userValidate: propsUserValidate,
		} = props;
		const finalUserValidate = propsUserValidate || userValidate;

		const finalErrorMessagesPrefix = propsErrorMessagesPrefix || errorMessagesPrefix;
		let finalErrorMessages = propsErrorMessages || errorMessages;
		if (finalErrorMessagesPrefix) {
			finalErrorMessages = dot.pick(finalErrorMessagesPrefix, dot.object({ ...finalErrorMessages }));
		}
		const finalSchema = propsSchema||schema;
		const valuesToValidate = assignDefaultsToRequiredObjectProperties(values, finalSchema);
		const validateJsonSchemaErrors = validateByJsonSchema(
			valuesToValidate,
			propsSchema || schema,
			finalErrorMessages
		);

		const userValidateErrors = finalUserValidate ? finalUserValidate(values, props) : {};

		const finalUserValidateErrors = dot.object(
			reduce(
				dot.dot({ ...userValidateErrors }),
				(result, value, key) => {
					const path = `${key}.${value}`;
					result[key] = dot.pick(path, finalErrorMessages) || value; // eslint-disable-line no-param-reassign
					return result;
				},
				{}
			)
		);

		return mergeWithArrays({}, validateJsonSchemaErrors, finalUserValidateErrors);
	};

	return function wrapWithForm(WrappedComponent) {
		class FormContainer extends React.Component {

			static propTypes = {
				form: T.string,
				submitFailed: T.bool,
				errors: T.object, // eslint-disable-line
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
			connect(
				false,
				(dispatch) => ({
					setExternalErrors: (targetForm, errors) => {
						dispatch(stopSubmit(targetForm, errors));
					},
				})
			),
			reduxForm(
				{
					...config,
					validate,
					initialValues,
				}
			),
		)(FormContainer);
	};
}
