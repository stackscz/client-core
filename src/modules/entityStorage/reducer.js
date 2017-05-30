import { get as g, each, union, reduce } from 'lodash';
import hash from 'utils/hash';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import createReducer from 'utils/createReducer';

import type { CollectionName } from 'modules/entityStorage/types/CollectionName';
import type { EntityId } from 'modules/entityStorage/types/EntityId';
import type {
	NormalizedEntityDictionary,
} from 'modules/entityStorage/types/NormalizedEntityDictionary';


import {
	RECEIVE_ENTITIES,
	FORGET_ENTITY,
	FORGET_ENTITIES,
} from './actions';

export default createReducer(
	t.struct({
		entities: t.dict(t.String, t.Any),
	}),
	Immutable.from({
		entities: {},
	}),
	{
		[RECEIVE_ENTITIES]: [
			t.struct({
				normalizedEntities: t.dict(t.String, t.Any),
			}),
			(state, action) => {
				const { normalizedEntities } = action.payload;
				return state.set(
					'entities',
					state.entities.merge(normalizedEntities, { deep: true })
				);
			},
		],
		[FORGET_ENTITY]: [
			t.struct({
				modelName: CollectionName,
				entityId: EntityId,
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				let newState = state;
				each(['entities', 'statuses', 'errors'], (sliceName) => {
					if (g(newState, [sliceName, modelName])) {
						newState = newState.updateIn(
							[sliceName, modelName],
							(selectedCollectionName, entityIdToForget) => {
								if (selectedCollectionName) {
									return selectedCollectionName.without(`${entityIdToForget}`);
								}
								return selectedCollectionName;
							},
							entityId
						);
					}
				});
				const invalidRefHashes = reduce(state.refs[modelName], (invalidRefs, currentRef) => {
					if (currentRef.entityId === entityId) {
						return [...invalidRefs, hash(currentRef.where)];
					}
					return invalidRefs;
				}, []);
				const modelRefs = g(newState, ['refs', modelName]);
				if (modelRefs) {
					newState = newState.setIn(
						['refs', modelName],
						modelRefs ? modelRefs.without(invalidRefHashes) : modelRefs,
					);
				}
				return newState;
			},
		],
		[FORGET_ENTITIES]: [
			t.struct({
				modelName: CollectionName,
				ids: t.Array,
			}),
			(state, action) => {
				const { modelName, ids } = action.payload;

				let newState = state;
				each(['entities', 'statuses', 'errors'], (sliceName) => {
					if (g(newState, [sliceName, modelName])) {
						newState = newState.updateIn(
							[sliceName, modelName],
							(selectedCollectionName, entityIdToForget) => {
								if (selectedCollectionName) {
									return selectedCollectionName.without(entityIdToForget);
								}
								return selectedCollectionName;
							},
							ids
						);
					}
				});

				const invalidRefHashes = reduce(state.refs[modelName], (invalidRefs, currentRef) => {
					if (ids.indexOf(currentRef.entityId) !== -1) {
						return [...invalidRefs, hash(currentRef.where)];
					}
					return invalidRefs;
				}, []);

				const modelRefs = g(newState, ['refs', modelName]);

				if (modelRefs) {
					newState = newState.setIn(
						['refs', modelName],
						modelRefs ? modelRefs.without(invalidRefHashes) : modelRefs,
					);
				}

				return newState;
			},
		],
	},
	'entityStorage'
);
