import { get as g } from 'lodash';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';
import getIdPropertyName from 'client-core/src/modules/resources/utils/getIdPropertyName';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';

export const initializedSelector =
	(state) =>
		g(state, ['entityDescriptors', 'initialized']);

export const modelSchemasSelector =
	(state) =>
		g(state, ['entityDescriptors', 'definitions']);

export const modelSchemaSelectorFactory = memoize(
	(modelName) => createSelector(
		modelSchemasSelector,
		(definitions) => {
			const userModelDefinition = g(definitions, modelName);
			if (!userModelDefinition) {
				return undefined;
			}
			return resolveSchema({ ...userModelDefinition, definitions });
		},
	)
);

export const modelIdPropertyNameSelectorFactory =
	(modelName) =>
		(state) =>
			getIdPropertyName(modelSchemaSelectorFactory(modelName)(state));
