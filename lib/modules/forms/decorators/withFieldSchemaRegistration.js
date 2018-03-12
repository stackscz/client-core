'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _recompose = require('recompose');

var _reactRedux = require('react-redux');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSectionFieldName = function getSectionFieldName(sectionPrefix, name) {
	return '' + (sectionPrefix ? sectionPrefix + '.' : '') + name;
};

exports.default = function (_ref) {
	var schema = _ref.schema;

	return (0, _recompose.compose)((0, _reactRedux.connect)(), (0, _recompose.getContext)({ _reduxForm: _noop3.default }), (0, _recompose.lifecycle)({
		componentWillMount: function componentWillMount() {
			var _props = this.props,
			    dispatch = _props.dispatch,
			    _props$_reduxForm = _props._reduxForm,
			    sectionPrefix = _props$_reduxForm.sectionPrefix,
			    form = _props$_reduxForm.form,
			    name = _props.name;

			dispatch((0, _actions.registerFieldSchema)({ form: form, name: getSectionFieldName(sectionPrefix, name), schema: schema }));
		},
		componentWillUnmount: function componentWillUnmount() {
			var _props2 = this.props,
			    dispatch = _props2.dispatch,
			    _props2$_reduxForm = _props2._reduxForm,
			    sectionPrefix = _props2$_reduxForm.sectionPrefix,
			    form = _props2$_reduxForm.form,
			    name = _props2.name;

			dispatch((0, _actions.unregisterFieldSchema)({ form: form, name: getSectionFieldName(sectionPrefix, name) }));
		}
	}));
};