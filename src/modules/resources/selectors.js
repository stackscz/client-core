import { get as g, isFunction } from 'lodash';
import invariant from 'invariant';
import hash from 'object-hash';
import memoize from 'fast-memoize';
import { createSelector } from 'reselect';
import {
	modelSchemasSelector,
} from 'client-core/src/modules/entityDescriptors/selectors';
import {
	entityDictionarySelector,
} from 'client-core/src/modules/entityStorage/selectors';
import denormalize from 'client-core/src/modules/resources/utils/denormalize';
import findRelationLinkName from 'client-core/src/modules/resources/utils/findRelationLinkName';
import type { ResourceLink } from 'client-core/src/modules/resources/types/ResourceLink';
import findResourceSchema from './utils/findResourceSchema';

export const resourcesModuleStateSelector = (state) => g(state, 'resources');
export const resourcesServiceSelector = (state) => g(state, 'resources.service', {});
export const pathsSelector = (state) => g(state, 'resources.paths');
export const definitionsSelector = (state) => g(state, 'resources.definitions');

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

const emptyResource = {};

export const resourceSelectorFactory = memoize(
	(link = {}) => (state) => {
		return g(state, ['resources', 'resources', hash(link)], emptyResource);
	}
);

export const relatedResourceSelectorFactory = (link = {}, rel) => (state) => {
	const definitions = modelSchemasSelector(state);
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
				return {
					...resource,
					content: denormalize(
						resource.content,
						resourceSchema,
						entityDictionary,
						maxLevel,
					),
				};
			}
		)
);
