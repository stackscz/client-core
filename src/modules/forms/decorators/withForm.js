import React from 'react';
import { isEmpty, reduce, isFunction, constant, transform, isObject, mapValues } from 'lodash';
import dot from 'dot-object';
import { reduxForm, stopSubmit } from 'redux-form';
import { compose, withProps, lifecycle, withHandlers } from 'recompose';
import omitProps from 'utils/omitProps';
import { connect } from 'react-redux';

import validateByJsonSchema from '../validateByJsonSchema';
import mergeWithArrays from '../mergeWithArrays';
import normalizeEmptyValues from '../normalizeEmptyValues';

const deepMap = (obj, iterator, context) => transform(
	obj,
	function (result, val, key) {
		result[key] = isObject(val) ? deepMap(val, iterator, context) : iterator.call(context, val, key, obj);
	},
);

const wrapAsErrors = (errorMessageOrSubErrors) => {
	if (isObject(errorMessageOrSubErrors)) {
		return mapValues(errorMessageOrSubErrors, wrapAsErrors);
	}
	return { _errors: [errorMessageOrSubErrors] };
};

const withForm = (options = {}) => {
	return compose(
		withProps((props) => {
			return isFunction(options) ? options(props) : options;
		}),
		connect(
			false,
			(dispatch) => ({
				setExternalErrors: (targetForm, errors) => {
					dispatch(stopSubmit(targetForm, errors));
				},
			})
		),
		withHandlers({
			validate: ({
				schema,
				errorMessagesPrefix,
				errorMessages,
				validate: userValidate,
			}) => (values, props) => {
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
				const finalSchema = propsSchema || schema;
				const normalizedValues = normalizeEmptyValues(values, finalSchema);

				const validateJsonSchemaErrors = wrapAsErrors(
					validateByJsonSchema(
						normalizedValues,
						propsSchema || schema,
						finalErrorMessages
					),
				);

				let userValidateErrors = {};
				if (finalUserValidate) {
					const userValidateErrorsUnwrapped = finalUserValidate(values, props);
					const userValidateErrorsUnwrappedDot = dot.dot(userValidateErrorsUnwrapped);
					const userValidateErrorsUnwrappedDotTranslated = mapValues(
						userValidateErrorsUnwrappedDot,
						(errorName, propertyPath) => dot.pick(`${propertyPath}.${errorName}`, errorMessages) || `${errorName}`,
					);
					const userValidateErrorsUnwrappedTranslated = dot.object(userValidateErrorsUnwrappedDotTranslated);
					userValidateErrors = wrapAsErrors(userValidateErrorsUnwrappedTranslated);
				}

				const finalUserValidateErrors = dot.object(
					reduce(
						dot.dot(userValidateErrors),
						(result, value, key) => {
							const path = `${key}.${value}`;
							result[key] = dot.pick(path, finalErrorMessages) || value; // eslint-disable-line no-param-reassign
							return result;
						},
						{}
					)
				);

				return mergeWithArrays({}, validateJsonSchemaErrors, finalUserValidateErrors);
			},
			checkErrors: ({ setExternalErrors, form: formName }) => (currentErrors, nextErrors, nextSubmitFailed) => {
				if (
					!isEmpty(nextErrors) && !nextSubmitFailed && nextErrors !== currentErrors
				) {
					setExternalErrors(formName, nextErrors);
				}
			}
		}),
		lifecycle({
			componentWillMount() {
				const { errors: nextErrors, checkErrors } = this.props;
				checkErrors({}, nextErrors, false);
			},
			componentWillReceiveProps(nextProps) {
				const { errors: currentErrors, checkErrors } = this.props;
				const { errors: nextErrors, submitFailed: nextSubmitFailed } = nextProps;
				checkErrors(currentErrors, nextErrors, nextSubmitFailed);
			}
		}),
		omitProps(['schema', 'errorMessagesPrefix', 'errorMessages', 'userValidate', 'checkErrors']),
		reduxForm(),
	);
};

export default withForm;
