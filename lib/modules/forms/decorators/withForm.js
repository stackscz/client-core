'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _compose2 = require('recompose/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

exports.default = withForm;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _reduxForm = require('redux-form');

var _reactRedux = require('react-redux');

var _validateByJsonSchema = require('../validateByJsonSchema');

var _validateByJsonSchema2 = _interopRequireDefault(_validateByJsonSchema);

var _mergeWithArrays = require('../mergeWithArrays');

var _mergeWithArrays2 = _interopRequireDefault(_mergeWithArrays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wraps component with redux-form enhanced with JSON schema validation
 *
 */
function withForm() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var _ref$schema = _ref.schema,
	    schema = _ref$schema === undefined ? {} : _ref$schema,
	    errorMessagesPrefix = _ref.errorMessagesPrefix,
	    _ref$errorMessages = _ref.errorMessages,
	    errorMessages = _ref$errorMessages === undefined ? {} : _ref$errorMessages,
	    userValidate = _ref.validate,
	    initialValues = _ref.initialValues,
	    config = (0, _objectWithoutProperties3.default)(_ref, ['schema', 'errorMessagesPrefix', 'errorMessages', 'validate', 'initialValues']);

	var validate = function validate(values, props) {
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
		var validateJsonSchemaErrors = (0, _validateByJsonSchema2.default)(values, propsSchema || schema, finalErrorMessages);

		var userValidateErrors = finalUserValidate ? finalUserValidate(values, props) : {};

		var finalUserValidateErrors = _dotObject2.default.object((0, _reduce3.default)(_dotObject2.default.dot((0, _extends3.default)({}, userValidateErrors)), function (result, value, key) {
			var path = key + '.' + value;
			result[key] = _dotObject2.default.pick(path, finalErrorMessages) || value; // eslint-disable-line no-param-reassign
			return result;
		}, {}));

		return (0, _mergeWithArrays2.default)({}, validateJsonSchemaErrors, finalUserValidateErrors);
	};

	return function wrapWithForm(WrappedComponent) {
		var FormContainer = function (_React$Component) {
			(0, _inherits3.default)(FormContainer, _React$Component);

			function FormContainer() {
				(0, _classCallCheck3.default)(this, FormContainer);
				return (0, _possibleConstructorReturn3.default)(this, (FormContainer.__proto__ || (0, _getPrototypeOf2.default)(FormContainer)).apply(this, arguments));
			}

			(0, _createClass3.default)(FormContainer, [{
				key: 'componentWillMount',
				value: function componentWillMount() {
					var nextErrors = this.props.errors;

					this.checkErrors({}, nextErrors, false);
				}
			}, {
				key: 'componentWillReceiveProps',
				value: function componentWillReceiveProps(nextProps) {
					var currentErrors = this.props.errors;
					var nextErrors = nextProps.errors,
					    nextSubmitFailed = nextProps.submitFailed;

					this.checkErrors(currentErrors, nextErrors, nextSubmitFailed);
				}
			}, {
				key: 'checkErrors',
				value: function checkErrors(currentErrors, nextErrors, nextSubmitFailed) {
					if (!(0, _isEmpty3.default)(nextErrors) && !nextSubmitFailed && nextErrors !== currentErrors) {
						var _props = this.props,
						    setExternalErrors = _props.setExternalErrors,
						    formName = _props.form;

						setExternalErrors(formName, nextErrors);
					}
				}
			}, {
				key: 'render',
				value: function render() {
					return _react2.default.createElement(WrappedComponent, this.props);
				}
			}]);
			return FormContainer;
		}(_react2.default.Component);

		FormContainer.propTypes = {
			form: _react.PropTypes.string,
			submitFailed: _react.PropTypes.bool,
			errors: _react.PropTypes.object, // eslint-disable-line
			setExternalErrors: _react.PropTypes.func.isRequired
		};

		return (0, _compose3.default)((0, _reactRedux.connect)(false, function (dispatch) {
			return {
				setExternalErrors: function setExternalErrors(targetForm, errors) {
					dispatch((0, _reduxForm.stopSubmit)(targetForm, errors));
				}
			};
		}), (0, _reduxForm.reduxForm)((0, _extends3.default)({}, config, {
			validate: validate,
			initialValues: initialValues
		})))(FormContainer);
	};
}