import { get as g, keys, each, union, merge, mapValues, reduce } from 'lodash';
import invariant from 'invariant';
import hash from 'object-hash';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import createReducer from 'client-core/src/utils/createReducer';
import deepMapValues from 'client-core/src/utils/deepMapValues';

import {
	ENSURE_ENTITY,
	ATTEMPT_FETCH_ENTITY,
	RECEIVE_ENTITIES,
	RECEIVE_FETCH_ENTITY_FAILURE,
	MERGE_ENTITY,
	PERSIST_ENTITY,
	RECEIVE_PERSIST_ENTITY_SUCCESS,
	RECEIVE_PERSIST_ENTITY_FAILURE,
	DELETE_ENTITY,
	RECEIVE_DELETE_ENTITY_SUCCESS,
	RECEIVE_DELETE_ENTITY_FAILURE,
	FORGET_ENTITY,
	FORGET_ENTITIES,
} from './actions';

import type { Error } from 'client-core/src/utils/types/Error';
// import type { EntitySchema } from 'client-core/src/utils/types/EntitySchema';
import type { CollectionName } from 'client-core/src/utils/types/CollectionName';
import type { EntityId } from 'client-core/src/utils/types/EntityId';
import type { EntityStatus } from 'client-core/src/utils/types/EntityStatus';
import type { NormalizedEntityDictionary } from 'client-core/src/utils/types/NormalizedEntityDictionary';

const defaultStatus = {
	transient: false,
	fetching: false,
	persisting: false,
	deleting: false,
};

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
								Array.isArray(entityPropertyAssociationUpdate) ?
									entityPropertyAssociationUpdate :
									[entityPropertyAssociationUpdate]
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

function setStatusWithDefaults(state, modelName, entityId, getNewStatus) {
	return state.updateIn(
		['statuses', modelName, entityId],
		(currentStatus) => merge({}, defaultStatus, currentStatus, getNewStatus(currentStatus))
	);
}

export default createReducer(
	t.struct({
		refs: t.dict(
			CollectionName,
			t.dict(
				t.String,
				t.struct({
					where: t.Object,
					entityId: t.maybe(EntityId),
				})
			)
		),
		collections: NormalizedEntityDictionary,
		statuses: t.dict(CollectionName, t.dict(EntityId, t.maybe(EntityStatus))),
		errors: t.dict(CollectionName, t.dict(EntityId, t.maybe(Error))),
	}),
	Immutable.from({
		refs: {},
		collections: {},
		statuses: {},
		errors: {},
	}),
	{
		[ENSURE_ENTITY]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
			}),
			(state, action) => {
				const { modelName, where } = action.payload;
				let newState = state;

				const whereHash = hash(where);
				let statusEntityId = g(state, ['refs', modelName, whereHash, 'entityId']);
				if (!statusEntityId) {
					newState = newState.setIn(['refs', modelName, whereHash], {
						where,
					});
					statusEntityId = whereHash;
				}
				return setStatusWithDefaults(newState, modelName, statusEntityId, (currentStatus) => ({
					transient: currentStatus ? currentStatus.transient : true,
				}));
			},
		],
		[ATTEMPT_FETCH_ENTITY]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
			}),
			(state, action) => {
				const { modelName, where } = action.payload;
				const whereHash = hash(where);
				let statusEntityId = g(state, ['refs', modelName, whereHash, 'entityId']);
				if (!statusEntityId) {
					statusEntityId = whereHash;
				}
				return setStatusWithDefaults(state, modelName, statusEntityId, (currentStatus) => ({
					transient: currentStatus ? currentStatus.transient : true,
					fetching: true,
				}));
			},
		],
		[RECEIVE_ENTITIES]: [
			t.struct({
				refs: t.Object,
				normalizedEntities: NormalizedEntityDictionary,
				validAtTime: t.String,
			}),
			(state, action) => {
				const { refs, normalizedEntities, validAtTime } = action.payload;

				let newState = state;

				// set entities to state
				newState = setEntitiesToState(state, normalizedEntities);

				// merge received refs
				newState = newState.setIn(['refs'], newState.refs.merge(refs, { deep: true }));

				// set statuses for refs
				newState = newState.merge({
					statuses: mapValues(
						refs,
						(refsForModel, refModelName) => reduce(refsForModel, (modelSatuses, ref) => {
							const currentStatus = g(
								state,
								['statuses', refModelName, ref.entityId]
							);
							return {
								...modelSatuses,
								[ref.entityId]: merge({}, defaultStatus, currentStatus, {
									validAtTime,
									transient: false,
									fetching: false,
								}),
							};
						}, {})
					),
				}, { deep: true });

				// set statuses for entities
				newState = newState.merge({
					statuses: mapValues(
						normalizedEntities,
						(entityList, statusCollectionName) => mapValues(entityList, (x, statusEntityId) => {
							const currentStatus = g(
								state,
								['statuses', statusCollectionName, statusEntityId]
							);
							return merge({}, defaultStatus, currentStatus, {
								validAtTime,
								transient: false,
								fetching: false,
							});
						})
					),
				}, { deep: true });

				// cleanup transient statuses and errors
				each(refs, (refsForModel, refModelName) => {
					const modelStatuses = g(newState, ['statuses', refModelName]);
					if (modelStatuses) {
						newState = newState.setIn(
							['statuses', refModelName],
							modelStatuses.without(keys(refsForModel))
						);
					}
					const modelErrors = g(newState, ['errors', refModelName]);
					if (modelErrors) {
						newState = newState.setIn(
							['errors', refModelName],
							modelErrors.without(keys(refsForModel))
						);
					}
				});

				return newState;
			},
		],
		[RECEIVE_FETCH_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
				error: Error,
			}),
			(state, action) => {
				const { modelName, where, error } = action.payload;
				let newState = state;
				newState = setStatusWithDefaults(newState, modelName, hash(where), () => ({
					transient: true,
					fetching: false,
				}));
				newState = newState.setIn(['errors', modelName, hash(where)], error);
				return newState;
			},
		],
		[MERGE_ENTITY]: [
			t.struct({
				modelName: t.String,
				where: t.Object,
				data: t.Object,
				noInteraction: t.Boolean,
			}),
		],
		[PERSIST_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				where: t.Object,
				normalizedEntities: NormalizedEntityDictionary,
				blueprintData: t.maybe(t.Object),
				noInteraction: t.Boolean,
			}),
			(state, action) => {
				const { modelName, entityId, normalizedEntities, associationsUpdates } = action.payload;

				let newState = state;
				// newState = newState.setIn(['collections', modelName, entityId], entity);
				newState = setEntitiesToState(newState, normalizedEntities, associationsUpdates);
				newState = setStatusWithDefaults(newState, modelName, entityId, (currentStatus) => ({
					persisting: true,
					transient: currentStatus ? currentStatus.transient : true,
				}));
				newState = newState.setIn(['errors', modelName, entityId], null);
				return newState;
			},
		],
		[RECEIVE_PERSIST_ENTITY_SUCCESS]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				normalizedEntities: NormalizedEntityDictionary,
				validAtTime: t.String,
				transientEntityId: t.maybe(EntityId),
			}),
			(state, action) => {
				const {
					modelName,
					entityId,
					normalizedEntities,
					transientEntityId,
					validAtTime,
				} = action.payload;

				let newState = setEntitiesToState(state, normalizedEntities);

				const statuses = mapValues(
					normalizedEntities,
					(entityList) => mapValues(entityList, () => ({
						validAtTime,
						persisting: false,
						transient: false,
					}))
				);

				newState = newState.merge({
					statuses,
				}, { deep: true });
				newState = newState.setIn(
					['errors', modelName, entityId],
					null
				);

				if (transientEntityId && entityId !== transientEntityId) {
					// remove transient entity from store
					each(newState.collections, (collections, collectionModelName) => {
						newState = newState.setIn(
							['collections', collectionModelName],
							newState.collections[collectionModelName].without(transientEntityId)
						);
						newState = newState.setIn(
							['statuses', modelName],
							newState.statuses[modelName].without(transientEntityId)
						);
					});

					// Map over associations values and replace transient id in associations
					const transientIdPaths = [];
					deepMapValues(newState, (value, path) => {
						if (value === transientEntityId) {
							transientIdPaths.push(path);
						}
					});
					transientIdPaths.forEach((path) => {
						newState = newState.setIn(path.split('.'), entityId);
					});
				}
				return newState;
			},
		],
		[RECEIVE_PERSIST_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				error: Error,
			}),
			(state, action) => {
				const { modelName, entityId, error } = action.payload;

				const isTransient = g(
					state,
					['statuses', modelName, entityId, 'transient'],
					false
				);

				let newState = state.merge({
					statuses: {
						[modelName]: {
							[entityId]: {
								transient: isTransient,
								persisting: false,
							},
						},
					},
					errors: {
						[modelName]: {
							[entityId]: error,
						},
					},
				}, { deep: true });

				if (error.validationErrors) {
					newState = newState.merge({
						validationErrors: {
							[modelName]: {
								[entityId]: error.validationErrors,
							},
						},
					}, { deep: true });
				}
				return newState;
			},
		],
		[DELETE_ENTITY]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				where: t.maybe(t.Object),
			}),
			(state, action) => {
				const { modelName, entityId } = action.payload;
				invariant(
					g(state, ['collections', modelName, entityId]),
					'unknown entity to delete'
				);

				return state.setIn(['statuses', modelName, entityId], {
					transient: true,
					deleting: true,
				});
			},
		],
		[RECEIVE_DELETE_ENTITY_SUCCESS]: [
			t.struct({
				modelNames: t.list(t.String),
				entityId: EntityId,
				relations: t.dict(t.String, t.list(t.String)),
			}),
			(state, action) => {
				const { modelNames, entityId, relations } = action.payload;
				let newState = state;
				each(modelNames, (modelName) => {
					const modelCollection = g(state, ['collections', modelName]);
					if (modelCollection) {
						newState = newState.setIn(
							['collections', modelName],
							modelCollection.without(`${entityId}`)
						);
					}

					const modelStatuses = g(state, ['statuses', modelName]);
					if (modelStatuses) {
						newState = newState.setIn(
							['statuses', modelName],
							modelStatuses.without(`${entityId}`)
						);
					}
				});
				each(relations, (properties, modelName) => {
					const modelCollection = g(state, ['collections', modelName]);
					if (modelCollection) {
						each(modelCollection, (entity, relatedEntityId) => {
							let newEntity = entity;
							each(properties, (propertyName) => {
								let newPropertyValue = g(newEntity, propertyName);
								if (newPropertyValue) {
									if (Array.isArray(newPropertyValue)) {
										newPropertyValue = newPropertyValue.filter(
											(x) => String(x) !== String(entityId)
										);
									} else if (String(newPropertyValue) === String(entityId)) {
										newPropertyValue = undefined;
									}
									newEntity = newEntity.setIn(
										[propertyName],
										newPropertyValue
									);
								}
							});
							newState = newState.setIn(
								['collections', modelName, relatedEntityId],
								newEntity
							);
						});
					}
				});
				return newState;
			},
		],
		[RECEIVE_DELETE_ENTITY_FAILURE]: [
			t.struct({
				modelName: t.String,
				entityId: EntityId,
				error: Error,
			}),
			(state, action) => {
				const { modelName, entityId, error } = action.payload;
				return state.merge({
					statuses: {
						[modelName]: {
							[entityId]: {
								transient: false,
								deleting: false,
							},
						},
					},
					errors: {
						[modelName]: {
							[entityId]: error,
						},
					},
				}, { deep: true });
			},
		],
		[FORGET_ENTITY]: [
			t.struct({
				modelName: t.String,
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
				modelName: t.String,
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
