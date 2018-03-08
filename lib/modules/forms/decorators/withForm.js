'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _recompose = require('recompose');

var _omitProps = require('../../../utils/omitProps');

var _omitProps2 = _interopRequireDefault(_omitProps);

var _reactRedux = require('react-redux');

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

var deepMap = function deepMap(obj, iterator, context) {
	return (0, _transform3.default)(obj, function (result, val, key) {
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

var withForm = function withForm() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
		return (0, _isFunction3.default)(options) ? options(props) : options;
	}), (0, _recompose.withProps)(function (_ref) {
		var initialValues = _ref.initialValues;

		return {
			initialValues: deepMap(initialValues, function (v) {
				return v === null ? undefined : v;
			})
		};
	}), (0, _reactRedux.connect)(function (state, _ref2) {
		var form = _ref2.form;
		return { fieldsSchemas: (0, _get3.default)(state, ['formFieldsSchemas', form]) };
	}), (0, _recompose.withHandlers)({
		setExternalErrors: function setExternalErrors(_ref3) {
			var dispatch = _ref3.dispatch;
			return function (targetForm, errors) {
				dispatch((0, _reduxForm.stopSubmit)(targetForm, errors));
			};
		}
	}), (0, _recompose.withHandlers)({
		validate: function validate(_ref4) {
			var schema = _ref4.schema,
			    errorMessagesPrefix = _ref4.errorMessagesPrefix,
			    errorMessages = _ref4.errorMessages,
			    userValidate = _ref4.validate,
			    notRequiredPaths = _ref4.notRequiredPaths,
			    requiredPaths = _ref4.requiredPaths,
			    fieldsSchemas = _ref4.fieldsSchemas;
			return function (values, props) {
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
					finalErrorMessages = _dotObject2.default.pick(finalErrorMessagesPrefix, _dotObject2.default.object((0, _extends3.default)({}, finalErrorMessages)));
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

				return (0, _mergeWithArrays2.default)({}, validateJsonSchemaErrors, finalUserValidateErrors);
			};
		},
		checkErrors: function checkErrors(_ref5) {
			var setExternalErrors = _ref5.setExternalErrors,
			    formName = _ref5.form;
			return function (currentErrors, nextErrors, nextSubmitFailed) {
				if (!(0, _isEmpty3.default)(nextErrors) && !nextSubmitFailed && nextErrors !== currentErrors) {
					setExternalErrors(formName, nextErrors);
				}
			};
		}
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
	}), (0, _omitProps2.default)(['errorMessagesPrefix', 'errorMessages', 'userValidate', 'checkErrors']), (0, _reduxForm.reduxForm)({
		shouldValidate: function shouldValidate(_ref6) {
			var values = _ref6.values,
			    nextProps = _ref6.nextProps,
			    props = _ref6.props,
			    initialRender = _ref6.initialRender,
			    lastFieldValidatorKeys = _ref6.lastFieldValidatorKeys,
			    fieldValidatorKeys = _ref6.fieldValidatorKeys,
			    structure = _ref6.structure;

			// debugger;
			if (initialRender) {
				return true;
			}
			var shouldValidate = !structure.deepEqual(values, nextProps && nextProps.values) || !structure.deepEqual(props.registeredFields, nextProps && nextProps.registeredFields) || !structure.deepEqual(lastFieldValidatorKeys, fieldValidatorKeys);
			// console.log('SHOULD VALIDATE', shouldValidate);
			return shouldValidate;
		}
	}), (0, _doOnPropsChange2.default)(['isBusy'], function (_ref7) {
		var dispatch = _ref7.dispatch,
		    form = _ref7.form,
		    isBusy = _ref7.isBusy;

		if (isBusy) {
			dispatch((0, _reduxForm.startSubmit)(form));
		} else {
			dispatch((0, _reduxForm.stopSubmit)(form));
		}
	}));
};

exports.default = withForm;