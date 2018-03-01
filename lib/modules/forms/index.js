'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reduxForm = require('redux-form');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	reducers: {
		form: _reduxForm.reducer,
		formFieldsSchemas: _reducer2.default
	}
};