import createReducer from 'client-core/src/utils/createReducer';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import {
	OPEN_MODAL,
	CLOSE_MODAL,
} from './actions';

export default createReducer(
	t.dict(t.String, t.Object),
	Immutable.from({}),
	{
		[OPEN_MODAL]: [
			t.struct({
				modalId: t.String,
				contentElement: t.Object,
				persistent: t.maybe(t.Boolean),
			}),
			(state, action) => {
				const { modalId, contentElement, persistent } = action.payload;
				return state.set(modalId, { ...contentElement, persistent });
			},
		],
		[CLOSE_MODAL]: [
			t.struct({
				modalId: t.String,
			}),
			(state, action) => {
				const { modalId } = action.payload;
				return state.without(modalId);
			},
		],
	},
	'modals'
);
