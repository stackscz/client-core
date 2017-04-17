import { get as g, isFunction } from 'lodash';
import invariant from 'invariant';
import hash from 'client-core/src/utils/hash';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';
import { entityDictionarySelector } from 'client-core/src/modules/entityStorage/selectors';
import denormalizeResource from 'client-core/src/modules/resources/utils/denormalizeResource';
import findRelationLinkName from 'client-core/src/modules/resources/utils/findRelationLinkName';
import getIdPropertyName from 'client-core/src/modules/resources/utils/getIdPropertyName';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';
import normalizeLink from 'client-core/src/modules/resources/utils/normalizeLink';
import type { ResourceLink } from 'client-core/src/modules/resources/types/ResourceLink';
import { INTERNAL_ID_PROPERTY_NAME } from 'client-core/src/modules/resources/constants';
import findResourceSchema from './utils/findResourceSchema';

export const resourcesModuleStateSelector = (state) => g(state, 'resources');
export const resourcesServiceSelector = (state) => g(state, 'resources.service', {});
export const pathsSelector = (state) => g(state, 'resources.paths');
export const definitionsSelector = (state) => g(state, 'resources.definitions');

export const normalizedLinkSelectorFactory = memoize(
	(link = {}) =>
		createSelector(
			(state) => g(state, 'resources.paths'),
			(paths) => {
				return normalizeLink(link, paths);
			}
		)
);

export const resolvedLinkSelectorFactory = memoize(
	(link = {}) =>
		createSelector(
			resourcesServiceSelector,
			(state) => g(state, 'resources'),
			(resourcesService, apiDescription) => {
				const { resolveResourceLink } = resourcesService;
				invariant(isFunction(resolveResourceLink), '`ResourcesService.resolveResourceLink` must be a Function!');
				return resolveResourceLink(link, apiDescription);
			}
		)
);

export const resourceSelectorFactory = memoize(
	(link = {}) => (state) => {
		return g(state, ['resources', 'resources', hash(link)]);
	}
);

export const relatedResourceSelectorFactory = (link = {}, rel) => (state) => {
	const definitions = definitionsSelector(state);
	const { params, resourceSchema } = resolvedLinkSelectorFactory(link)(state);

	let resourceSchemaRef = g(resourceSchema, '$ref', g(resourceSchema, 'items.$ref')); // TODO rename
	resourceSchemaRef = resourceSchemaRef.split('/');
	resourceSchemaRef.shift();
	resourceSchemaRef = resourceSchemaRef.join('.');
	const responseSchema = g(
		{ definitions },
		resourceSchemaRef
	);
	const relatedResourceLinkName = findRelationLinkName(responseSchema, rel);

	const relatedResourceLink = { name: relatedResourceLinkName, params };
	return g(state, ['resources', 'resources', hash(relatedResourceLink)]);
};

export const resourceSchemaSelectorFactory = memoize(
	(link: ResourceLink) =>
		createSelector(
			pathsSelector,
			definitionsSelector,
			(paths, definitions) => {
				if (!link) {
					return undefined;
				}
				return findResourceSchema(
					{
						paths,
						definitions,
						link,
					}
				);
			}
		)
);

export const denormalizedResourceSelectorFactory = memoize(
	(link: ResourceLink, maxLevel = 1) =>
		createSelector(
			pathsSelector,
			definitionsSelector,
			resourceSelectorFactory(link),
			entityDictionarySelector,
			(paths, definitions, resource, entityDictionary) => {
				if (!resource) {
					return undefined;
				}
				if (!resource.content) {
					return resource;
				}
				const resourceSchema = findResourceSchema(
					{
						paths,
						definitions,
						link,
					}
				);


				let finalResourceSchema = resourceSchema;
				if (g(resourceSchema, 'type') === 'array') {
					const itemSchema = resolveSubschema(resourceSchema, 'items');
					const idPropertyName = getIdPropertyName(itemSchema);
					if (!idPropertyName) {
						finalResourceSchema = {
							...finalResourceSchema,
							items: {
								...itemSchema,
								'x-idPropertyName': INTERNAL_ID_PROPERTY_NAME,
							},
						};
					}
				} else {
					const idPropertyName = getIdPropertyName(resourceSchema);
					if (!idPropertyName) {
						finalResourceSchema = {
							...finalResourceSchema,
							'x-idPropertyName': INTERNAL_ID_PROPERTY_NAME,
						};
					}
				}

				const content = denormalizeResource(
					resource.content,
					finalResourceSchema,
					entityDictionary,
					maxLevel,
				);
				return {
					...resource,
					content,
				};
			}
		)
);
