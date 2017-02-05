import t from 'tcomb';
import Immutable from 'seamless-immutable';

import createReducer from 'client-core/src/utils/createReducer';
import { RECEIVE_ENTITY_DESCRIPTORS } from './actions';

import type { DefinitionsDictionary } from 'client-core/src/types/DefinitionsDictionary';
import type { FieldsetsDictionary } from 'client-core/src/types/FieldsetsDictionary';

export default createReducer(
	t.struct({
		definitions: DefinitionsDictionary,
		fieldsets: FieldsetsDictionary,
		initialized: t.Boolean,
	}),
	Immutable.from({
		definitions: {},
		fieldsets: {},
		initialized: false,
	}),
	{
		[RECEIVE_ENTITY_DESCRIPTORS]: [
			t.struct({
				definitions: t.Object,
				fieldsets: t.Object,
			}),
			(state, action) => {
				const { definitions, fieldsets } = action.payload;
				return state.merge({
					definitions,
					fieldsets,
					initialized: true,
				}, { deep: true });
			},
		],
	},
	'entityDescriptors'
);
