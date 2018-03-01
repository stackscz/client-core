import createReducer from 'utils/createReducer';
import { DESTROY } from 'redux-form/lib/actionTypes';
import { each, reduce } from 'lodash';
import t from 'tcomb';
import Immutable from 'seamless-immutable';
import { REGISTER_FIELD_SCHEMA, UNREGISTER_FIELD_SCHEMA } from './actions';

export default createReducer(
	t.dict(t.String, t.maybe(t.Object)),
	Immutable.from({}),
	{
		[REGISTER_FIELD_SCHEMA]: [
			t.struct({
				form: t.String,
				name: t.String,
				schema: t.Any,
			}),
			(state, { payload: { form, name, schema } }) => {
				return state.setIn([form, name], schema);
			},
		],
		[UNREGISTER_FIELD_SCHEMA]: [
			t.struct({
				form: t.String,
				name: t.String,
				schema: t.Any,
			}),
			(state, { payload: { form, name } }) => {
				return state.setIn([form, name], undefined);
			},
		],
	},
	'formFieldsSchemas'
);
