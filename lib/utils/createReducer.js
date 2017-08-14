'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _merge2 = require('lodash/merge');

var _merge3 = _interopRequireDefault(_merge2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

exports.default = createReducer;

var _typeInvariant = require('./typeInvariant');

var _typeInvariant2 = _interopRequireDefault(_typeInvariant);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates reducer function in an unobtrusive way
 *
 * @param {?Function} stateType tcomb type to test state against after action
 * @param {any} initialState state to start with, can be seamless-immutable structure
 * @param {Object} handlers
 * @param {?string} name
 * @returns {Function} reducer function
 */
function createReducer() {
	var stateType = void 0;
	var initialState = arguments.length <= 0 ? undefined : arguments[0];
	var handlers = arguments.length <= 1 ? undefined : arguments[1];
	var name = arguments.length <= 2 ? undefined : arguments[2];

	if (_tcomb2.default.isType(arguments.length <= 0 ? undefined : arguments[0])) {
		// we have state type
		stateType = arguments.length <= 0 ? undefined : arguments[0];
		initialState = arguments.length <= 1 ? undefined : arguments[1];
		handlers = arguments.length <= 2 ? undefined : arguments[2];
		name = arguments.length <= 3 ? undefined : arguments[3];
	}

	(0, _invariant2.default)(!(0, _isUndefined3.default)(initialState), 'undefined passed to `createReducer` as initial state.');
	(0, _invariant2.default)((0, _isUndefined3.default)(handlers) || (0, _isObject3.default)(handlers), 'Invalid handlers object passed to `createReducer`');

	return function reducer() {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
		var action = arguments[1];

		var resultState = state;
		if (action.type === _actions.INIT) {
			if (initialState.asMutable) {
				if (initialState.merge) {
					resultState = initialState.merge(state, { deep: true });
				} else if (initialState.concat) {
					resultState = initialState.concat(state);
				}
			} else {
				resultState = (0, _merge3.default)({}, initialState, state);
			}

			if (stateType && process.env.NODE_ENV !== 'production') {
				(0, _typeInvariant2.default)(resultState, stateType, 'Invalid state after ' + _actions.INIT);
			}
			return resultState;
		}

		if (handlers && handlers.hasOwnProperty(action.type)) {
			var handlerDefinition = handlers[action.type];
			var handler = handlerDefinition;
			var actionPayloadType = null;
			if ((0, _isArray3.default)(handler)) {
				handler = handlerDefinition[1] || function (x) {
					return x;
				};
				actionPayloadType = handlerDefinition[0];
			}
			if (actionPayloadType && process.env.NODE_ENV !== 'production') {
				(0, _typeInvariant2.default)(action.payload, actionPayloadType, 'Action ' + action.type + ' has invalid payload');
			}

			resultState = handler(state, action);

			if (stateType && process.env.NODE_ENV !== 'production') {
				(0, _invariant2.default)((0, _isFunction3.default)(resultState.asMutable) && (0, _isFunction3.default)(initialState.asMutable), 'Reducer returned mutable state for action %s.', action.type);
				(0, _typeInvariant2.default)(resultState, stateType, 'Reducer "' + (name || 'unknown') + '" returned invalid state for action ' + action.type);
			}
		}
		return resultState;
	};
}