// @flow
import { each, isArray } from 'lodash';
import {
	createStore as reduxCreateStore,
	applyMiddleware,
	compose,
	combineReducers,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { init } from 'client-core/src/utils/actions';

import type { StoreConfig } from 'client-core/src/types/StoreConfig';

function runSaga(sagaMiddleware: Function, saga: Function): void {
	sagaMiddleware.run(saga);
	// .done.catch((error) => {
	// 	// TODO logging
	// 	console.error(error);
	// 	runSaga(sagaMiddleware, saga);
	// });
}

export default function createStore(config: StoreConfig = {}, initialState = {}): Object {
	let reducers = config && config.reducers ? { ...config.reducers } : {};
	let sagas = config && config.sagas ? [...config.sagas] : [];
	const enhancers = config && config.enhancers ? [...config.enhancers] : [];

	if (config && isArray(config.modules)) {
		each(config.modules, (module) => {
			if (module.reducers) {
				reducers = { ...reducers, ...module.reducers };
			}
			if (module.sagas) {
				sagas = [...sagas, ...module.sagas];
			}
		});
	}

	const sagaMiddleware = createSagaMiddleware();
	const middleware = [
		sagaMiddleware,
	];

	enhancers.unshift(applyMiddleware(...middleware));

	// avoid dependency on react-dom on server
	if (process.env.UNIVERSAL_ENV !== 'server') {
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
		sagas.forEach(saga => runSaga(sagaMiddleware, saga));
	}
	return store;
}
