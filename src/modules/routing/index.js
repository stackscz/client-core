import { routerMiddleware, routerReducer } from 'react-router-redux';
import createReducer from 'utils/createReducer';
import t from 'tcomb';
import Immutable from 'seamless-immutable';
import { applyMiddleware } from 'redux';

const createRoutingModule = (history)  => {
	return {
		reducers: {
			router: routerReducer,
			routes: createReducer(t.Array, Immutable.from([]), {}, 'routes'),
		},
		enhancers: [
			applyMiddleware(routerMiddleware(history)),
		],
	};
};

export {
	createRoutingModule,
};
