import { get as g } from 'lodash';
import { createSelector } from 'reselect';

import denormalize from 'client-core/src/modules/resources/utils/denormalize';
import { modelSchemaSelectorFactory } from 'client-core/src/modules/entityDescriptors/selectors';
import { entityDictionarySelector } from 'client-core/src/modules/entityStorage/selectors';

export const authStateSelector =
	state =>
		g(state, ['auth']);

export const authContextSelector =
	state =>
		g(state, ['auth', 'context'], {});

export const authErrorSelector =
	state =>
		g(state, ['auth', 'error']);

export const userIdSelector =
	state =>
		g(state, ['auth', 'userId']);

export const userSchemaSelector = // TODO can't do better selector?
	createSelector(
		(state) => g(state, ['auth', 'userModelName']),
		(state) => state,
		(userModelName, state) => {
			return modelSchemaSelectorFactory(userModelName)(state);
		},
	);

export const userSelector = createSelector(
	entityDictionarySelector,
	userSchemaSelector,
	userIdSelector,
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

export const isUserAnonymousSelector = createSelector(
	userSelector,
	(user) =>
		g(user, 'anonymous', true)
);
