'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createReducer = require('redux-form/lib/createReducer');

var _createReducer2 = _interopRequireDefault(_createReducer);

var _plainStructure = require('./plainStructure');

var _plainStructure2 = _interopRequireDefault(_plainStructure);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	reducers: {
		form: (0, _createReducer2.default)(_plainStructure2.default),
		formFieldsSchemas: _reducer2.default
	}
};