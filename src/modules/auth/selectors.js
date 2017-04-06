import { get as g } from 'lodash';
import { createSelector } from 'reselect';

import denormalize from 'client-core/src/modules/resources/utils/denormalize';
import { denormalizedResourceSelectorFactory } from 'client-core/src/modules/resources/selectors';
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

export const userLinkSelector =
	state =>
		g(state, ['auth', 'userLink']);

export const userSchemaSelector = // TODO can't do better selector?
	createSelector(
		(state) => g(state, ['auth', 'userModelName']),
		(state) => state,
		(userModelName, state) => {
			return modelSchemaSelectorFactory(userModelName)(state);
		},
	);

export const userSelector = createSelector(
	userLinkSelector,
	(state) => state,
	(userLink, state) => g(
		denormalizedResourceSelectorFactory(userLink)(state),
		'content'
	),
);

export const isUserAnonymousSelector = createSelector(
	userSelector,
	(user) =>
		g(user, 'anonymous', true)
);
