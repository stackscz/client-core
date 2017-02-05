import { get as g, map, reduce, keys, isArray, includes, isFunction } from 'lodash';
import memoize from 'fast-memoize';
import hash from 'object-hash';
import { createSelector } from 'reselect';
import denormalize from 'client-core/src/modules/entityDescriptors/utils/denormalize';
import getIdPropertyName from 'client-core/src/modules/entityDescriptors/utils/getIdPropertyName';

export const modelSchemasSelector =
	(state) =>
		g(state, ['entityDescriptors', 'definitions']);

export const modelSchemaSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityDescriptors', 'definitions', modelName]);

export const entitySelectorFactory =
	(modelName, entityId) =>
		(state) =>
			g(state, ['entityStorage', 'collections', modelName, entityId]);

export const entityDictionarySelector =
	(state) =>
		g(state, ['entityStorage', 'collections']);

export const collectionSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityStorage', 'collections', modelName]);

export const collectionContentSelectorFactory = memoize(
	(modelName) =>
		createSelector(
			collectionSelectorFactory(modelName),
			(collection) => keys(collection)
		)
);

export const collectionStatusesSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityStorage', 'statuses', modelName]);

export const collectionErrorsSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityStorage', 'errors', modelName]);

export const entityIndexSelectorFactoryByHash =
	(indexHash) =>
		(state) =>
			g(state, ['entityIndexes', 'indexes', indexHash]);

export const getEntityIdByRef = (modelName, where) =>
	(state) =>
		g(state.entityStorage, ['refs', modelName, hash(where), 'entityId'], hash(where));

export const entityIndexSelectorFactory =
	(indexHashOrModelName, filter) =>
		(state) => {
			let resolvedFilter = filter;

			if (isFunction(filter)) {
				resolvedFilter = filter(state);
			}

			if (typeof resolvedFilter === 'undefined') {
				const entityIndex = entityIndexSelectorFactoryByHash(indexHashOrModelName)(state);
				if (entityIndex) {
					return entityIndex;
				}
			}
			const indexHash = hash({ modelName: indexHashOrModelName, filter: resolvedFilter });
			return entityIndexSelectorFactoryByHash(indexHash)(state);
		};

export const entityListSelectorFactory = memoize(
	(modelName, ids) => createSelector(
		collectionSelectorFactory(modelName),
		(collection) => {
			if (!ids) {
				return undefined;
			}
			if (!collection) {
				return undefined;
			}
			return map(ids, (id) => g(collection, id));
		}
	)
);

export const entityStatusListSelectorFactory = memoize(
	(modelName, ids) => createSelector(
		collectionStatusesSelectorFactory(modelName),
		(statuses) => {
			if (!ids) {
				return undefined;
			}
			if (!statuses) {
				return undefined;
			}
			return reduce(
				ids,
				(selectedStatuses, id) => ({
					...selectedStatuses,
					[id]: g(statuses, id),
				}),
				{}
			);
		}
	)
);

export const entityStatusSelectorFactory =
	(modelName, entityId) =>
		(state) =>
			g(state, ['entityStorage', 'statuses', modelName, entityId]);

export const entityErrorSelectorFactory =
	(modelName, entityId) =>
		(state) =>
			g(state, ['entityStorage', 'errors', modelName, entityId]);

export const denormalizedEntitySelectorFactory = memoize(
	(modelName, entityId, maxLevel = 1) => createSelector(
		modelSchemaSelectorFactory(modelName),
		entityDictionarySelector,
		(modelSchema, entityDictionary) => {
			const entityExists = g(entityDictionary, [modelName, entityId]);
			if (modelSchema && entityDictionary && entityExists) {
				return denormalize(
					entityId,
					modelSchema,
					entityDictionary,
					maxLevel
				);
			}
			return undefined;
		}
	)
);

export const denormalizedEntityListSelectorFactory = memoize(
	(modelName, ids, maxLevel = 1) => createSelector(
		modelSchemaSelectorFactory(modelName),
		entityDictionarySelector,
		(modelSchema, entityDictionary) => {
			if (!ids) {
				return undefined;
			}
			return denormalize(
				ids,
				{
					type: 'array',
					items: modelSchema,
				},
				entityDictionary,
				maxLevel
			);
		}
	)
);

export const denormalizedEntityMapSelectorFactory = memoize(
	(modelName, ids, maxLevel = 1) => createSelector(
		modelSchemaSelectorFactory(modelName),
		entityDictionarySelector,
		(modelSchema, entityDictionary) => {
			if (!ids) {
				return undefined;
			}
			const denormalized = denormalize(
				ids,
				{
					type: 'array',
					items: modelSchema,
				},
				entityDictionary,
				maxLevel
			);
			const modelIdPropertyName = getIdPropertyName(modelSchema);
			return reduce(
				denormalized,
				(resultMap, entity) => ({ ...resultMap, [g(entity, modelIdPropertyName)]: entity }),
				{}
			);
		}
	)
);


export const userSchemaSelector = createSelector(
	modelSchemasSelector,
	(state) => g(state, ['auth', 'userModelName']),
	(modelSchemas, userModelName) => {
		return g(modelSchemas, userModelName);
	}
);

export const userSelector = createSelector(
	entityDictionarySelector,
	userSchemaSelector,
	(state) => g(state, ['auth', 'userId']),
	(entityDictionary, userSchema, userId) => {
		if (entityDictionary && userSchema && userId) {
			return denormalize(
				userId,
				userSchema,
				entityDictionary,
				2
			);
		}
		return undefined;
	}
);

export const isUserAnonymousOrUnauthenticatedSelector = createSelector(
	userSelector,
	(user) => {
		return g(user, 'anonymous', true);
	}
);

export const currentPathSelector = (state) =>
	`${g(state, 'routing.location.pathname')}${g(state, 'routing.location.search')}`;

export const routeActiveSelectorFactory = (route) =>
	(state) => {
		if (isArray(route)) {
			return includes(route, g(state, 'routing.locationRoute.name'));
		}
		return route === g(state, 'routing.locationRoute.name');
	};
