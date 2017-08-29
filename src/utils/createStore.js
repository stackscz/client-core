// @flow
import { each, isArray } from 'lodash';
import {
	createStore as reduxCreateStore,
	applyMiddleware,
	compose,
	combineReducers,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { init } from 'utils/actions';

import type { StoreConfig } from 'types/StoreConfig';

function runSaga(sagaMiddleware: Function, saga: Function, store, runtimeErrorCallback?: (error: Object, store: Object) => void): void {
	const sagaPromise = sagaMiddleware.run(saga);
	if (!!runtimeErrorCallback) {
		sagaPromise.done.catch((error) => runtimeErrorCallback(error, store));
	}
}

export default function createStore(config: StoreConfig = {}, initialState = {}): Object {
	let reducers = config && config.reducers ? { ...config.reducers } : {};
	let sagas = config && config.sagas ? [...config.sagas] : [];
	let enhancers = [];

	if (config && isArray(config.modules)) {
		each(config.modules, (module) => {
			if (module.reducers) {
				reducers = { ...reducers, ...module.reducers };
			}
			if (module.sagas) {
				sagas = [...sagas, ...module.sagas];
			}
			if (module.enhancers) {
				enhancers = [...enhancers, ...module.enhancers];
			}
		});
	}
	let configEnhancers = config && config.enhancers ? [...config.enhancers] : [];
	enhancers = [...enhancers, ...configEnhancers];

	const sagaMiddleware = createSagaMiddleware();
	const middleware = [
		sagaMiddleware,
	];

	enhancers.unshift(applyMiddleware(...middleware));

	// avoid dependency on react-dom on server
	if ((0, window)) {
		const batchedSubscribe = require('redux-batched-subscribe').batchedSubscribe;
		const batchedUpdates = require('react-dom').unstable_batchedUpdates;
		if (batchedUpdates) {
			enhancers.push(batchedSubscribe(batchedUpdates));
		}
	}

	const rootReducer = combineReducers(reducers);
	const store = reduxCreateStore(
		rootReducer,
		initialState,
		compose(...enhancers),
	);
	store.dispatch(init());
	if (sagas.length) {
		sagas.forEach(saga => runSaga(sagaMiddleware, saga, store, config.runtimeErrorCallback));
	}
	return store;
}
