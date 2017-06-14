'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createRoutingModule = undefined;

var _reactRouterRedux = require('react-router-redux');

var _createReducer = require('../../utils/createReducer');

var _createReducer2 = _interopRequireDefault(_createReducer);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _redux = require('redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createRoutingModule = function createRoutingModule(history) {
	return {
		reducers: {
			router: _reactRouterRedux.routerReducer,
			routes: (0, _createReducer2.default)(_tcomb2.default.Array, _seamlessImmutable2.default.from([]), {}, 'routes')
		},
		enhancers: [(0, _redux.applyMiddleware)((0, _reactRouterRedux.routerMiddleware)(history))]
	};
};

exports.createRoutingModule = createRoutingModule;