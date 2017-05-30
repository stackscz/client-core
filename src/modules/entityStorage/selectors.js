import { get as g, keys, map } from 'lodash';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';

export const entityDictionarySelector =
	(state) =>
		g(state, ['entityStorage', 'entities']);

export const collectionSelectorFactory =
	(modelName) =>
		(state) =>
			g(state, ['entityStorage', 'entities', modelName]);

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
			g(state, ['entityStorage', 'entities', modelName, entityId]);

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
