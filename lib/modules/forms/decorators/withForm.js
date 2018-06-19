'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _startsWith2 = require('lodash/startsWith');

var _startsWith3 = _interopRequireDefault(_startsWith2);

var _reduceRight2 = require('lodash/reduceRight');

var _reduceRight3 = _interopRequireDefault(_reduceRight2);

var _size2 = require('lodash/size');

var _size3 = _interopRequireDefault(_size2);

var _debounce2 = require('lodash/debounce');

var _debounce3 = _interopRequireDefault(_debounce2);

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _transform2 = require('lodash/transform');

var _transform3 = _interopRequireDefault(_transform2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _reduxForm = require('redux-form');

var _createReduxForm = require('redux-form/lib/createReduxForm');

var _createReduxForm2 = _interopRequireDefault(_createReduxForm);

var _SubmissionError = require('redux-form/lib/SubmissionError');

var _SubmissionError2 = _interopRequireDefault(_SubmissionError);

var _plainStructure = require('../plainStructure');

var _plainStructure2 = _interopRequireDefault(_plainStructure);

var _recompose = require('recompose');

var _omitProps = require('../../../utils/omitProps');

var _omitProps2 = _interopRequireDefault(_omitProps);

var _reactRedux = require('react-redux');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _doOnPropsChange = require('../../../utils/doOnPropsChange');

var _doOnPropsChange2 = _interopRequireDefault(_doOnPropsChange);

var _validateByJsonSchema = require('../validateByJsonSchema');

var _validateByJsonSchema2 = _interopRequireDefault(_validateByJsonSchema);

var _mergeWithArrays = require('../mergeWithArrays');

var _mergeWithArrays2 = _interopRequireDefault(_mergeWithArrays);

var _normalizeEmptyValues = require('../normalizeEmptyValues');

var _normalizeEmptyValues2 = _interopRequireDefault(_normalizeEmptyValues);

var _normalizeValuesToValidate = require('../normalizeValuesToValidate');

var _normalizeValuesToValidate2 = _interopRequireDefault(_normalizeValuesToValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reduxForm = (0, _createReduxForm2.default)(_plainStructure2.default);

var deepMap = function deepMap(obj, iterator, context) {
	return (0, _transform3.default)(obj, function (result, val, key) {
		if (_immutable2.default.Iterable.isIterable(val)) {
			result[key] = val;
			return;
		}
		result[key] = (0, _isObject3.default)(val) ? deepMap(val, iterator, context) : iterator.call(context, val, key, obj);
	});
};

var wrapAsErrors = function wrapAsErrors(errorMessageOrSubErrors) {
	if ((0, _isObject3.default)(errorMessageOrSubErrors)) {
		return (0, _mapValues3.default)(errorMessageOrSubErrors, wrapAsErrors);
	}
	return { _errors: [errorMessageOrSubErrors] };
};

var combineWithFieldsSchemas = function combineWithFieldsSchemas(mainSchema, fieldsSchemasMap) {
	if (!fieldsSchemasMap) {
		return mainSchema;
	}
	return {
		allOf: [mainSchema].concat((0, _toConsumableArray3.default)((0, _keys2.default)(fieldsSchemasMap).reduce(function (acc, fieldsSchemaKey) {
			var fieldSchema = fieldsSchemasMap[fieldsSchemaKey];
			var schemaDotKey = 'properties.' + fieldsSchemaKey.replace('.', '.properties.').replace(/\[[^\]]\]/, '.items');
			return [].concat((0, _toConsumableArray3.default)(acc), [_dotObject2.default.object((0, _defineProperty3.default)({}, schemaDotKey, fieldSchema))]);
		}, [])))
	};
};

var validation = function validation(_ref, cb) {
	var values = _ref.values,
	    props = _ref.props,
	    schema = _ref.schema,
	    errorMessagesPrefix = _ref.errorMessagesPrefix,
	    errorMessages = _ref.errorMessages,
	    userValidate = _ref.userValidate,
	    notRequiredPaths = _ref.notRequiredPaths,
	    requiredPaths = _ref.requiredPaths,
	    fieldsSchemas = _ref.fieldsSchemas;
	var registeredFields = props.registeredFields;

	if (!registeredFields) {
		// bail early if there are no fields to validate
		return {};
	}
	var propsSchema = props.schema,
	    propsErrorMessagesPrefix = props.errorMessagesPrefix,
	    propsErrorMessages = props.errorMessages,
	    propsUserValidate = props.userValidate;

	var finalUserValidate = propsUserValidate || userValidate;

	var finalErrorMessagesPrefix = propsErrorMessagesPrefix || errorMessagesPrefix;
	var finalErrorMessages = propsErrorMessages || errorMessages;
	if (finalErrorMessagesPrefix) {
		finalErrorMessages = _dotObject2.default.pick(finalErrorMessagesPrefix, _dotObject2.default.object((0, _extends4.default)({}, finalErrorMessages)));
	}
	var finalSchema = propsSchema || schema;
	finalSchema = combineWithFieldsSchemas(finalSchema, fieldsSchemas);
	var normalizedValues = (0, _normalizeEmptyValues2.default)(values, finalSchema);
	normalizedValues = (0, _normalizeValuesToValidate2.default)(normalizedValues, finalSchema, registeredFields);

	var validateJsonSchemaErrors = wrapAsErrors((0, _validateByJsonSchema2.default)(normalizedValues, finalSchema, finalErrorMessages, requiredPaths, notRequiredPaths));

	var userValidateErrors = {};
	if (finalUserValidate) {
		var userValidateErrorsUnwrapped = finalUserValidate(values, props);
		var userValidateErrorsUnwrappedDot = _dotObject2.default.dot(userValidateErrorsUnwrapped);
		var userValidateErrorsUnwrappedDotTranslated = (0, _mapValues3.default)(userValidateErrorsUnwrappedDot, function (errorName, propertyPath) {
			return _dotObject2.default.pick(propertyPath + '.' + errorName, errorMessages) || '' + errorName;
		});
		var userValidateErrorsUnwrappedTranslated = _dotObject2.default.object(userValidateErrorsUnwrappedDotTranslated);
		userValidateErrors = wrapAsErrors(userValidateErrorsUnwrappedTranslated);
	}

	var finalUserValidateErrors = _dotObject2.default.object((0, _reduce3.default)(_dotObject2.default.dot(userValidateErrors), function (result, value, key) {
		var path = key + '.' + value;
		result[key] = _dotObject2.default.pick(path, finalErrorMessages) || value; // eslint-disable-line no-param-reassign
		return result;
	}, {}));

	cb((0, _mergeWithArrays2.default)({}, validateJsonSchemaErrors, finalUserValidateErrors));
};

var normalizeErrors = function normalizeErrors(_ref2) {
	var registeredFields = _ref2.registeredFields,
	    errors = _ref2.errors;

	var tmp = (0, _reduceRight3.default)((0, _keys2.default)(registeredFields).sort(), function (acc, path) {
		if ((0, _startsWith3.default)((0, _get3.default)(acc, 'prevPath'), path)) {
			return (0, _extends4.default)({}, acc, {
				prevPath: path
			});
		}

		var picked = _dotObject2.default.pick(path, errors);
		if (!picked) {
			return (0, _extends4.default)({}, acc, {
				prevPath: path
			});
		}

		return {
			result: (0, _extends4.default)({}, (0, _get3.default)(acc, 'result'), (0, _defineProperty3.default)({}, path, picked)),
			prevPath: path
		};
	}, { result: {}, prevPath: '' });

	return _dotObject2.default.object((0, _get3.default)(tmp, 'result'));
};

var debouncedValidation = (0, _debounce3.default)(validation, 500);

var withForm = function withForm() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
		return (0, _isFunction3.default)(options) ? options(props) : options;
	}), (0, _recompose.withProps)(function (_ref3) {
		var initialValues = _ref3.initialValues;

		return {
			initialValues: deepMap(initialValues, function (v) {
				return v === null ? undefined : v;
			})
		};
	}), (0, _reactRedux.connect)(function (state, _ref4) {
		var form = _ref4.form;
		return { fieldsSchemas: (0, _get3.default)(state, ['formFieldsSchemas', form]) };
	}), (0, _recompose.withHandlers)({
		setExternalErrors: function setExternalErrors(_ref5) {
			var dispatch = _ref5.dispatch;
			return function (targetForm, errors) {
				dispatch((0, _reduxForm.stopSubmit)(targetForm, errors));
			};
		}
	}), (0, _recompose.withHandlers)({
		monkeyPatchedSubmitFactory: function monkeyPatchedSubmitFactory(_ref6) {
			var schema = _ref6.schema,
			    errorMessagesPrefix = _ref6.errorMessagesPrefix,
			    errorMessages = _ref6.errorMessages,
			    userValidate = _ref6.validate,
			    notRequiredPaths = _ref6.notRequiredPaths,
			    requiredPaths = _ref6.requiredPaths,
			    fieldsSchemas = _ref6.fieldsSchemas;
			return function (onSubmit) {
				return function (values, dispatch, props) {
					var registeredFields = props.registeredFields;


					return new _promise2.default(function (resolve) {
						validation({
							values: values,
							props: props,
							schema: schema,
							errorMessagesPrefix: errorMessagesPrefix,
							errorMessages: errorMessages,
							userValidate: userValidate,
							notRequiredPaths: notRequiredPaths,
							requiredPaths: requiredPaths,
							fieldsSchemas: fieldsSchemas
						}, function (errors) {
							var finalErrors = normalizeErrors({ registeredFields: registeredFields, errors: errors });

							if ((0, _size3.default)(finalErrors)) {
								throw new _SubmissionError2.default(finalErrors);
							} else {
								resolve();
							}
						});
					}).then(function () {
						return onSubmit(values, dispatch, props);
					});
				};
			};
		}
	}), (0, _recompose.withHandlers)(function (_ref7) {
		var _onSubmit = _ref7.onSubmit,
		    monkeyPatchedSubmitFactory = _ref7.monkeyPatchedSubmitFactory;

		return (0, _extends4.default)({
			asyncValidate: function asyncValidate(_ref8) {
				var schema = _ref8.schema,
				    errorMessagesPrefix = _ref8.errorMessagesPrefix,
				    errorMessages = _ref8.errorMessages,
				    userValidate = _ref8.validate,
				    notRequiredPaths = _ref8.notRequiredPaths,
				    requiredPaths = _ref8.requiredPaths,
				    fieldsSchemas = _ref8.fieldsSchemas;
				return function (values, _, props) {
					var registeredFields = props.registeredFields;

					var resolve = void 0;
					var reject = void 0;

					debouncedValidation({
						values: values,
						props: props,
						schema: schema,
						errorMessagesPrefix: errorMessagesPrefix,
						errorMessages: errorMessages,
						userValidate: userValidate,
						notRequiredPaths: notRequiredPaths,
						requiredPaths: requiredPaths,
						fieldsSchemas: fieldsSchemas
					}, function (errors) {
						var finalErrors = normalizeErrors({ registeredFields: registeredFields, errors: errors });

						if ((0, _size3.default)(finalErrors)) {
							reject(finalErrors);
						} else {
							resolve();
						}
					});

					return new _promise2.default(function (res, rej) {
						resolve = res;
						reject = rej;
					});
				};
			},

			checkErrors: function checkErrors(_ref9) {
				var setExternalErrors = _ref9.setExternalErrors,
				    formName = _ref9.form;
				return function (currentErrors, nextErrors, nextSubmitFailed) {
					if (!(0, _isEmpty3.default)(nextErrors) && !nextSubmitFailed && nextErrors !== currentErrors) {
						setExternalErrors(formName, nextErrors);
					}
				};
			}

		}, _onSubmit ? { onSubmit: function onSubmit() {
				return monkeyPatchedSubmitFactory(_onSubmit);
			} } : {});
	}), (0, _recompose.lifecycle)({
		componentWillMount: function componentWillMount() {
			var _props = this.props,
			    nextErrors = _props.errors,
			    checkErrors = _props.checkErrors;

			checkErrors({}, nextErrors, false);
		},
		componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
			var _props2 = this.props,
			    currentErrors = _props2.errors,
			    checkErrors = _props2.checkErrors;
			var nextErrors = nextProps.errors,
			    nextSubmitFailed = nextProps.submitFailed;

			checkErrors(currentErrors, nextErrors, nextSubmitFailed);
		}
	}), (0, _recompose.withProps)(function (_ref10) {
		var registeredFields = _ref10.registeredFields;

		return {
			asyncChangeFields: registeredFields,
			asyncBlurFields: registeredFields
		};
	}), (0, _omitProps2.default)(['errorMessagesPrefix', 'errorMessages', 'userValidate', 'checkErrors']), reduxForm({
		shouldAsyncValidate: function shouldAsyncValidate(_ref11) {
			var trigger = _ref11.trigger,
			    syncValidationPasses = _ref11.syncValidationPasses;

			if (!syncValidationPasses) {
				return false;
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
	}), (0, _recompose.withHandlers)({
		handleSubmit: function handleSubmit(_ref12) {
			var _handleSubmit = _ref12.handleSubmit,
			    monkeyPatchedSubmitFactory = _ref12.monkeyPatchedSubmitFactory;
			return function (submitOrEvent) {
				if (!submitOrEvent || submitOrEvent.stopPropagation && submitOrEvent.preventDefault) {
					return _handleSubmit(submitOrEvent);
				}

				return _handleSubmit(monkeyPatchedSubmitFactory(submitOrEvent));
			};
		}
	}), (0, _doOnPropsChange2.default)(['isBusy'], function (_ref13) {
		var dispatch = _ref13.dispatch,
		    form = _ref13.form,
		    isBusy = _ref13.isBusy;

		if (isBusy) {
			dispatch((0, _reduxForm.startSubmit)(form));
		} else {
			dispatch((0, _reduxForm.stopSubmit)(form));
		}
	}));
};

exports.default = withForm;