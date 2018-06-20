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
	noop,
	isEqualWith,
	debounce,
	size,
	pick,
	reduceRight,
	startsWith,
} from 'lodash';
import dot from 'dot-object';
import { startSubmit, stopSubmit } from 'redux-form';
import createReduxForm from 'redux-form/lib/createReduxForm';
import SubmissionError from 'redux-form/lib/SubmissionError';
import reduxFormStructure from '../plainStructure';
import { compose, withProps, lifecycle, withHandlers, setDisplayName, getContext, withPropsOnChange } from 'recompose';
import omitProps from 'utils/omitProps';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import doOnPropsChange from 'utils/doOnPropsChange';

import validateByJsonSchema from '../validateByJsonSchema';
import mergeWithArrays from '../mergeWithArrays';
import normalizeEmptyValues from '../normalizeEmptyValues';
import normalizeValuesToValidate from '../normalizeValuesToValidate';

const reduxForm = createReduxForm(reduxFormStructure);

const deepMap = (obj, iterator, context) => transform(
	obj,
	function (result, val, key) {
		if (Immutable.Iterable.isIterable(val)) {
			result[key] = val;
			return;
		}
		result[key] = isObject(val) ? deepMap(val, iterator, context) : iterator.call(context, val, key, obj);
	},
);

const wrapAsErrors = (errorMessageOrSubErrors) => {
	if (isObject(errorMessageOrSubErrors)) {
		return mapValues(errorMessageOrSubErrors, wrapAsErrors);
	}
	return { _errors: [errorMessageOrSubErrors] };
};

const combineWithFieldsSchemas = (mainSchema, fieldsSchemasMap) => {
	if (!fieldsSchemasMap) {
		return mainSchema;
	}
	return {
		allOf: [
			mainSchema,
			...Object.keys(fieldsSchemasMap).reduce(
				(acc, fieldsSchemaKey) => {
					const fieldSchema = fieldsSchemasMap[fieldsSchemaKey];
					const schemaDotKey = `properties.${fieldsSchemaKey
						.replace('.', '.properties.')
						.replace(/\[[^\]]\]/, '.items')}`;
					return [...acc, dot.object({ [schemaDotKey]: fieldSchema })];
				},
				[]
			)
		]
	}
};

const validation = ({
	values,
	props,
	schema,
	errorMessagesPrefix,
	errorMessages,
	userValidate,
	notRequiredPaths,
	requiredPaths,
	fieldsSchemas,
}, cb) => {
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
	finalSchema = combineWithFieldsSchemas(finalSchema, fieldsSchemas);
	let normalizedValues = normalizeEmptyValues(values, finalSchema);
	normalizedValues = normalizeValuesToValidate(normalizedValues, finalSchema, registeredFields);

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

	cb(mergeWithArrays({}, validateJsonSchemaErrors, finalUserValidateErrors));
};

const normalizeErrors = ({
	registeredFields,
	errors,
}) => {
	const tmp = reduceRight(Object.keys(registeredFields).sort(), (acc, path) => {
		if (startsWith(g(acc, 'prevPath'), path)) {
			return {
				...acc,
				prevPath: path,
			};
		}

		const picked = dot.pick(path, errors);
		if (!picked) {
			return {
				...acc,
				prevPath: path,
			};
		}

		return {
			result: {
				...g(acc, 'result'),
				[path]: picked,
			},
			prevPath: path,
		};
	}, { result: {}, prevPath: '' });

	return dot.object(g(tmp, 'result'));
};

const debouncedValidation = debounce(validation, 500);

const withForm = (options = {}) => {
	return compose(
		withProps(
			(props) => {
				return isFunction(options) ? options(props) : options;
			},
		),
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
		connect((state, { form }) => ({ fieldsSchemas: g(state, ['formFieldsSchemas', form]) })),
		withHandlers(
			{
				setExternalErrors: ({ dispatch }) => (targetForm, errors) => {
					dispatch(stopSubmit(targetForm, errors));
				},
			},
		),
		withHandlers({
			monkeyPatchedSubmitFactory: ({
				schema,
				errorMessagesPrefix,
				errorMessages,
				validate: userValidate,
				notRequiredPaths,
				requiredPaths,
				fieldsSchemas,
			}) => (onSubmit) => (values, dispatch, props) => {
				const { registeredFields } = props;

				return new Promise((resolve) => {
					validation({
						values,
						props,
						schema,
						errorMessagesPrefix,
						errorMessages,
						userValidate,
						notRequiredPaths,
						requiredPaths,
						fieldsSchemas,
					}, (errors) => {
						const finalErrors = normalizeErrors({ registeredFields, errors });

						if (size(finalErrors)) {
							throw new SubmissionError(finalErrors);
						} else {
							resolve();
						}
					})
				}).then(() => {
					return onSubmit(values, dispatch, props);
				});
			}
		}),
		withHandlers(
			({ onSubmit, monkeyPatchedSubmitFactory }) => {
				return {
					asyncValidate: ({
						schema,
						errorMessagesPrefix,
						errorMessages,
						validate: userValidate,
						notRequiredPaths,
						requiredPaths,
						fieldsSchemas,
					}) => (values, _, props) => {
						const { registeredFields } = props;
						let resolve;
						let reject;

						debouncedValidation({
							values,
							props,
							schema,
							errorMessagesPrefix,
							errorMessages,
							userValidate,
							notRequiredPaths,
							requiredPaths,
							fieldsSchemas,
						}, (errors) => {
							const finalErrors = normalizeErrors({ registeredFields, errors });

							if (size(finalErrors)) {
								reject(finalErrors);
							} else {
								resolve();
							}
						});

						return new Promise((res, rej) => {
							resolve = res;
							reject = rej;
						});

					},

					checkErrors: ({ setExternalErrors, form: formName }) => (currentErrors, nextErrors, nextSubmitFailed) => {
						if (
							!isEmpty(nextErrors) && !nextSubmitFailed && nextErrors !== currentErrors
						) {
							setExternalErrors(formName, nextErrors);
						}
					},

					...(onSubmit ? { onSubmit: () => monkeyPatchedSubmitFactory(onSubmit)} : {}),
				};
			},
		),
		lifecycle(
			{
				componentWillMount() {
					const { errors: nextErrors, checkErrors } = this.props;
					checkErrors({}, nextErrors, false);
				},
				componentWillReceiveProps(nextProps) {
					const { errors: currentErrors, checkErrors } = this.props;
					const { errors: nextErrors, submitFailed: nextSubmitFailed } = nextProps;
					checkErrors(currentErrors, nextErrors, nextSubmitFailed);
				}
			},
		),
		withProps(({ registeredFields }) => {
			return {
				asyncChangeFields: registeredFields,
				asyncBlurFields: registeredFields,
			};
		}),
		omitProps(['errorMessagesPrefix', 'errorMessages', 'userValidate', 'checkErrors']),
		reduxForm(
			{
				shouldAsyncValidate: ({
					trigger,
					syncValidationPasses,
				}) => {
					if (!syncValidationPasses) {
						return false
					}
					switch (trigger) {
						case 'blur':
						case 'change':
							return true;
						default:
							return false;
					}
				}
				// shouldValidate: ({
				// 	values,
				// 	nextProps,
				// 	props,
				// 	initialRender,
				// 	lastFieldValidatorKeys,
				// 	fieldValidatorKeys,
				// 	structure
				// }) => {
				// 	// debugger;
				// 	if (initialRender) {
				// 		return true
				// 	}
				// 	const shouldValidate = (
				// 		!structure.deepEqual(values, nextProps && nextProps.values) ||
				// 		!structure.deepEqual(props.registeredFields, nextProps && nextProps.registeredFields) ||
				// 		!structure.deepEqual(lastFieldValidatorKeys, fieldValidatorKeys)
				// 	);
				// 	// console.log('SHOULD VALIDATE', shouldValidate);
				// 	return shouldValidate;
				// },
			},
		),
		withHandlers({
			handleSubmit: ({
				handleSubmit,
				monkeyPatchedSubmitFactory,
			}) => (submitOrEvent) => {
				if (!submitOrEvent || (submitOrEvent.stopPropagation && submitOrEvent.preventDefault)) {
					return handleSubmit(submitOrEvent);
				}

				return handleSubmit(monkeyPatchedSubmitFactory(submitOrEvent));
			}
		}),
		doOnPropsChange(
			['isBusy'],
			({ dispatch, form, isBusy }) => {
				if (isBusy) {
					dispatch(startSubmit(form));
				} else {
					dispatch(stopSubmit(form));
				}
			},
		),
	);
};

export default withForm;
