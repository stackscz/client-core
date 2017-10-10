'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _reduxForm = require('redux-form');

var _recompose = require('recompose');

var _omitProps = require('../../../utils/omitProps');

var _omitProps2 = _interopRequireDefault(_omitProps);

var _reactRedux = require('react-redux');

var _validateByJsonSchema = require('../validateByJsonSchema');

var _validateByJsonSchema2 = _interopRequireDefault(_validateByJsonSchema);

var _mergeWithArrays = require('../mergeWithArrays');

var _mergeWithArrays2 = _interopRequireDefault(_mergeWithArrays);

var _assignDefaultsToRequiredObjectProperties = require('../assignDefaultsToRequiredObjectProperties');

var _assignDefaultsToRequiredObjectProperties2 = _interopRequireDefault(_assignDefaultsToRequiredObjectProperties);

var _normalizeEmptyValues = require('../normalizeEmptyValues');

var _normalizeEmptyValues2 = _interopRequireDefault(_normalizeEmptyValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withForm = function withForm() {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	return (0, _recompose.compose)((0, _recompose.withProps)(function (props) {
		return (0, _isFunction3.default)(options) ? options(props) : options;
	}), (0, _reactRedux.connect)(false, function (dispatch) {
		return {
			setExternalErrors: function setExternalErrors(targetForm, errors) {
				dispatch((0, _reduxForm.stopSubmit)(targetForm, errors));
			}
		};
	}), (0, _recompose.withHandlers)({
		validate: function validate(_ref) {
			var schema = _ref.schema,
			    errorMessagesPrefix = _ref.errorMessagesPrefix,
			    errorMessages = _ref.errorMessages,
			    userValidate = _ref.validate;
			return function (values, props) {
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
				var valuesToValidate = (0, _normalizeEmptyValues2.default)((0, _assignDefaultsToRequiredObjectProperties2.default)(values, finalSchema), finalSchema);
				var validateJsonSchemaErrors = (0, _validateByJsonSchema2.default)(valuesToValidate, propsSchema || schema, finalErrorMessages);

				var userValidateErrors = finalUserValidate ? finalUserValidate(values, props) : {};

				var finalUserValidateErrors = _dotObject2.default.object((0, _reduce3.default)(_dotObject2.default.dot((0, _extends3.default)({}, userValidateErrors)), function (result, value, key) {
					var path = key + '.' + value;
					result[key] = _dotObject2.default.pick(path, finalErrorMessages) || value; // eslint-disable-line no-param-reassign
					return result;
				}, {}));

				return (0, _mergeWithArrays2.default)({}, validateJsonSchemaErrors, finalUserValidateErrors);
			};
		},
		checkErrors: function checkErrors(_ref2) {
			var setExternalErrors = _ref2.setExternalErrors,
			    formName = _ref2.form;
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
	}), (0, _omitProps2.default)(['schema', 'errorMessagesPrefix', 'errorMessages', 'userValidate', 'checkErrors']), (0, _reduxForm.reduxForm)());
};

exports.default = withForm;