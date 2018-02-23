import React from 'react';
import {
	get as g,
	isEmpty,
	reduce,
	isFunction,
	constant,
	transform,
	isObject,
	mapValues,
	isPlainObject,
	includes,
	cloneDeep,
	pull,
} from 'lodash';
import dot from 'dot-object';
import { reduxForm, stopSubmit } from 'redux-form';
import { compose, withProps, lifecycle, withHandlers, setDisplayName } from 'recompose';
import omitProps from 'utils/omitProps';
import { connect } from 'react-redux';

import validateByJsonSchema from '../validateByJsonSchema';
import mergeWithArrays from '../mergeWithArrays';
import normalizeEmptyValues from '../normalizeEmptyValues';
import assignDefaultsToObjectProperties from '../assignDefaultsToObjectProperties';

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
		withProps(
			({ initialValues }) => {
				return {
					initialValues: deepMap(
						initialValues,
						(v) => v === null ? undefined : v,
					),
				};
			}
		),
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
				notRequiredPaths,
				requiredPaths,
			}) => (values, props) => {
				const { registeredFields } = props;
				if (!registeredFields) {
					// bail early if there are no fields to validate
					return {};
				}
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
				let finalSchema = propsSchema || schema;
				let normalizedValues = normalizeEmptyValues(values, finalSchema);
				normalizedValues = assignDefaultsToObjectProperties(normalizedValues, finalSchema, registeredFields);

				const validateJsonSchemaErrors = wrapAsErrors(
					validateByJsonSchema(
						normalizedValues,
						finalSchema,
						finalErrorMessages,
						requiredPaths,
						notRequiredPaths,
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
		omitProps(['errorMessagesPrefix', 'errorMessages', 'userValidate', 'checkErrors']),
		reduxForm(
			{
				shouldValidate: ({
					values,
					nextProps,
					props,
					initialRender,
					lastFieldValidatorKeys,
					fieldValidatorKeys,
					structure
				}) => {
					// debugger;
					if (initialRender) {
						return true
					}
					const shouldValidate = (
						!structure.deepEqual(values, nextProps && nextProps.values) ||
						!structure.deepEqual(props.registeredFields, nextProps && nextProps.registeredFields) ||
						!structure.deepEqual(lastFieldValidatorKeys, fieldValidatorKeys)
					);
					// console.log('SHOULD VALIDATE', shouldValidate);
					return shouldValidate;
				},
			},
		),
		// reduxForm(),
	);
};

export default withForm;
