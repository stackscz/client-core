'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

exports.default = createStore;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _actions = require('./actions');

var _StoreConfig = require('../types/StoreConfig');

var _typesStoreConfig = _interopRequireWildcard(_StoreConfig);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StoreConfig = _typesStoreConfig.StoreConfig || _tcomb2.default.Any;


function runSaga(sagaMiddleware, saga, store, runtimeErrorCallback) {
	_assert(sagaMiddleware, _tcomb2.default.Function, 'sagaMiddleware');

	_assert(saga, _tcomb2.default.Function, 'saga');

	_assert(runtimeErrorCallback, _tcomb2.default.maybe(_tcomb2.default.Function), 'runtimeErrorCallback');

	var ret = function (sagaMiddleware, saga, store, runtimeErrorCallback) {
		var sagaPromise = sagaMiddleware.run(saga);
		if (!!runtimeErrorCallback) {
			sagaPromise.done.catch(function (error) {
				return runtimeErrorCallback(error, store);
			});
		}
	}.call(this, sagaMiddleware, saga, store, runtimeErrorCallback);

	_assert(ret, _tcomb2.default.Nil, 'return value');

	return ret;
}

function createStore() {
	var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	_assert(config, StoreConfig, 'config');

	var ret = function (config, initialState) {
		var reducers = config && config.reducers ? (0, _extends3.default)({}, config.reducers) : {};
		var sagas = config && config.sagas ? [].concat((0, _toConsumableArray3.default)(config.sagas)) : [];
		var enhancers = [];

		if (config && (0, _isArray3.default)(config.modules)) {
			(0, _each3.default)(config.modules, function (module) {
				if (module.reducers) {
					reducers = (0, _extends3.default)({}, reducers, module.reducers);
				}
				if (module.sagas) {
					sagas = [].concat((0, _toConsumableArray3.default)(sagas), (0, _toConsumableArray3.default)(module.sagas));
				}
				if (module.enhancers) {
					enhancers = [].concat((0, _toConsumableArray3.default)(enhancers), (0, _toConsumableArray3.default)(module.enhancers));
				}
			});
		}
		var configEnhancers = config && config.enhancers ? [].concat((0, _toConsumableArray3.default)(config.enhancers)) : [];
		enhancers = [].concat((0, _toConsumableArray3.default)(enhancers), (0, _toConsumableArray3.default)(configEnhancers));

		var sagaMiddleware = (0, _reduxSaga2.default)();
		var middleware = [sagaMiddleware];

		enhancers.unshift(_redux.applyMiddleware.apply(undefined, middleware));

		// avoid dependency on react-dom on server
		if (0, window) {
			var batchedSubscribe = require('redux-batched-subscribe').batchedSubscribe;
			var batchedUpdates = require('react-dom').unstable_batchedUpdates;
			if (batchedUpdates) {
				enhancers.push(batchedSubscribe(batchedUpdates));
			}
		}

		var rootReducer = (0, _redux.combineReducers)(reducers);
		var store = (0, _redux.createStore)(rootReducer, initialState, _redux.compose.apply(undefined, (0, _toConsumableArray3.default)(enhancers)));
		store.dispatch((0, _actions.init)());
		if (sagas.length) {
			sagas.forEach(function (saga) {
				return runSaga(sagaMiddleware, saga, store, config.runtimeErrorCallback);
			});
		}
		return store;
	}.call(this, config, initialState);

	_assert(ret, _tcomb2.default.Object, 'return value');

	return ret;
}

function _assert(x, type, name) {
	if (false) {
		_tcomb2.default.fail = function (message) {
			console.warn(message);
		};
	}

	if (_tcomb2.default.isType(type) && type.meta.kind !== 'struct') {
		if (!type.is(x)) {
			type(x, [name + ': ' + _tcomb2.default.getTypeName(type)]);
		}
	} else if (!(x instanceof type)) {
		_tcomb2.default.fail('Invalid value ' + _tcomb2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcomb2.default.getTypeName(type) + ')');
	}

	return x;
}