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

export function setEntitiesToState(state, normalizedEntities, normalizedAssociationsUpdates) {
	let newState = state;
	newState = newState.update('collections', (currentValue, collections) => {
		let newValue = currentValue;
		each(collections, (entities, modelName) => {
			each(entities, (entity, entityId) => {
				// Merge entity with existing one.
				const existingEntity = g(newValue, [modelName, entityId], Immutable.from({}));
				newValue = newValue.setIn(
					[modelName, entityId],
					existingEntity.merge(entity)
				);
			});
		});
		return newValue;
	}, normalizedEntities);

	each(normalizedAssociationsUpdates, (modelAssociationUpdate, modelName) => {
		each(modelAssociationUpdate, (entityAssociationUpdate, entityId) => {
			each(entityAssociationUpdate, (entityPropertyAssociationUpdate, associationPropertyName) => {
				if (g(newState, ['collections', modelName, entityId])) {
					const propertyPath = ['collections', modelName, entityId, associationPropertyName];
					const currentAssocValue = g(newState, propertyPath);
					if (Array.isArray(currentAssocValue)) {
						newState = newState.setIn(
							propertyPath,
							union(
								currentAssocValue,
								Array.isArray(entityPropertyAssociationUpdate) ? (
									entityPropertyAssociationUpdate
								) : (
									[entityPropertyAssociationUpdate]
								)
							)
						);
					} else {
						newState = newState.setIn(propertyPath, entityPropertyAssociationUpdate);
					}
				}
			});
		});
	});
	return newState;
}

export default createReducer(
	t.struct({
		collections: NormalizedEntityDictionary,
	}),
	Immutable.from({
		collections: {},
	}),
	{
		[RECEIVE_ENTITIES]: [
			t.struct({
				normalizedEntities: NormalizedEntityDictionary,
			}),
			(state, action) => {
				const { normalizedEntities } = action.payload;
				return setEntitiesToState(state, normalizedEntities);
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
				each(['collections', 'statuses', 'errors'], (sliceName) => {
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
				each(['collections', 'statuses', 'errors'], (sliceName) => {
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
