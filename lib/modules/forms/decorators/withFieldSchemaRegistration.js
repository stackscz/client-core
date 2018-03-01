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

exports.default = function (_ref) {
	var schema = _ref.schema;

	return (0, _recompose.compose)((0, _reactRedux.connect)(), (0, _recompose.getContext)({ _reduxForm: _noop3.default }), (0, _recompose.lifecycle)({
		componentWillMount: function componentWillMount() {
			var _props = this.props,
			    dispatch = _props.dispatch,
			    form = _props._reduxForm.form,
			    name = _props.name;

			dispatch((0, _actions.registerFieldSchema)({ form: form, name: name, schema: schema }));
		},
		componentWillUnmount: function componentWillUnmount() {
			var _props2 = this.props,
			    dispatch = _props2.dispatch,
			    form = _props2._reduxForm.form,
			    name = _props2.name;

			dispatch((0, _actions.unregisterFieldSchema)({ form: form, name: name }));
		}
	}));
};