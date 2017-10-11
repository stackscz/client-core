'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _createReducer;

var _createReducer2 = require('../../utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createReducer3.default)(_tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.Object), _seamlessImmutable2.default.from({}), (_createReducer = {}, (0, _defineProperty3.default)(_createReducer, _actions.OPEN_MODAL, [_tcomb2.default.struct({
	modalId: _tcomb2.default.String,
	contentElement: _tcomb2.default.Object,
	persistent: _tcomb2.default.maybe(_tcomb2.default.Boolean)
}), function (state, action) {
	var _action$payload = action.payload,
	    modalId = _action$payload.modalId,
	    contentElement = _action$payload.contentElement,
	    persistent = _action$payload.persistent;

	return state.set(modalId, { contentElement: contentElement, persistent: persistent });
}]), (0, _defineProperty3.default)(_createReducer, _actions.CLOSE_MODAL, [_tcomb2.default.struct({
	modalId: _tcomb2.default.String
}), function (state, action) {
	var modalId = action.payload.modalId;

	return state.without(modalId);
}]), _createReducer), 'modals');