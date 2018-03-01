'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _createReducer;

var _createReducer2 = require('../../utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _actionTypes = require('redux-form/lib/actionTypes');

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createReducer3.default)(_tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.maybe(_tcomb2.default.Object)), _seamlessImmutable2.default.from({}), (_createReducer = {}, (0, _defineProperty3.default)(_createReducer, _actions.REGISTER_FIELD_SCHEMA, [_tcomb2.default.struct({
	form: _tcomb2.default.String,
	name: _tcomb2.default.String,
	schema: _tcomb2.default.Any
}), function (state, _ref) {
	var _ref$payload = _ref.payload,
	    form = _ref$payload.form,
	    name = _ref$payload.name,
	    schema = _ref$payload.schema;

	return state.setIn([form, name], schema);
}]), (0, _defineProperty3.default)(_createReducer, _actions.UNREGISTER_FIELD_SCHEMA, [_tcomb2.default.struct({
	form: _tcomb2.default.String,
	name: _tcomb2.default.String,
	schema: _tcomb2.default.Any
}), function (state, _ref2) {
	var _ref2$payload = _ref2.payload,
	    form = _ref2$payload.form,
	    name = _ref2$payload.name;

	return state.setIn([form, name], undefined);
}]), _createReducer), 'formFieldsSchemas');