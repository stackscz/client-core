import { get as g, keys, reduce, map, some } from 'lodash';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';
import hash from 'object-hash';
import getIdPropertyName from 'client-core/src/modules/resources/utils/getIdPropertyName';
import {
	modelSchemaSelectorFactory,
} from 'client-core/src/modules/entityDescriptors/selectors';
import denormalize from 'client-core/src/modules/resources/utils/denormalize';

export const entityIdSelectorByRef =
	(modelName, where) =>
		(state) => {
			const hashedWhere = hash(where);
			return g(state, ['entityStorage', 'refs', modelName, hashedWhere, 'entityId'], hashedWhere);
		};

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
			(collection) => keys(collection) // => an array of entityIds
		)
);

export const entitySelectorFactory =
	(modelName, entityId) =>
		(state) =>
			g(state, ['entityStorage', 'collections', modelName, entityId]);

export const entityListSelectorFactory = memoize(
	(modelName, ids) => createSelector(
		collectionSelectorFactory(modelName),
		(collection) => {
			if (!ids || !collection) {
				return undefined;
			}

			return map(ids, (id) => g(collection, id));
		}
	)
);

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
					definitions: modelSchema.definitions,
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
					definitions: modelSchema.definitions,
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

export const collectionStatusesSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityStorage', 'statuses', modelName]);

export const collectionCreatingSelectorFactory =
	(modelName) => createSelector(
		collectionStatusesSelectorFactory(modelName),
		(statuses) => some(statuses, status => g(status, 'persisting') && g(status, 'transient'))
	);

export const entityStatusSelectorFactory =
	(modelName, entityId) =>
		(state) =>
			g(state, ['entityStorage', 'statuses', modelName, entityId]);

export const entityPersistingSelectorFactory =
	(modelName, entityId) => createSelector(
		entityStatusSelectorFactory(modelName, entityId),
		(status) => g(status, 'persisting')
	);

export const entityStatusMapSelectorFactory = memoize(
	(modelName, ids) => createSelector(
		collectionStatusesSelectorFactory(modelName),
		(statuses) => {
			if (!ids || !statuses) {
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

export const collectionErrorsSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityStorage', 'errors', modelName]);

export const entityErrorSelectorFactory =
	(modelName, entityId) =>
		(state) =>
			g(state, ['entityStorage', 'errors', modelName, entityId]);
