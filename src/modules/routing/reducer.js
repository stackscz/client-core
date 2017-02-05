// @flow
import Immutable from 'seamless-immutable';
import t from 'tcomb';
import createReducer from '../../utils/createReducer';
import { NAVIGATE } from './actions';

export default createReducer(
	t.struct({
		location: t.Object,
		action: t.String,
	}),
	Immutable.from({
		location: null,
		action: null,
	}),
	{
		[NAVIGATE]: [
			t.struct({
				location: t.Object,
				action: t.String,
			}),
			(state, action) => {
				const { location, action: routerAction } = action.payload;
				return state
					.set('location', location)
					.set('action', routerAction);
			},
		],
	},
	'routing'
);
