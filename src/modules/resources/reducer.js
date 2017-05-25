// @flow
import { get as g, each, isArray, includes } from 'lodash';
import hash from 'utils/hash';
import Immutable from 'seamless-immutable';
import t from 'tcomb';

import type { Resource } from 'modules/resources/types/Resource';
import type { ResourceLink } from 'modules/resources/types/ResourceLink';
import type { ResourcesService } from 'modules/resources/types/ResourcesService';

import type { AppError } from 'types/AppError';
import createReducer from 'utils/createReducer';

import {
	ENSURE_RESOURCE,
	FETCH_RESOURCE,
	RECEIVE_FETCH_RESOURCE_FAILURE,
	RECEIVE_RESOURCE,
	MERGE_RESOURCE,
	PERSIST_RESOURCE,
	RECEIVE_PERSIST_RESOURCE_SUCCESS,
	RECEIVE_PERSIST_RESOURCE_FAILURE,
	DELETE_RESOURCE,
	RECEIVE_DELETE_RESOURCE_SUCCESS,
	RECEIVE_DELETE_RESOURCE_FAILURE,
	DEFINE_RESOURCE,
	FORGET_RESOURCE,
} from './actions';

const defaultResource = Immutable.from({
	link: undefined,
	links: {},
	content: undefined,
	transient: false,
	fetching: false,
	persisting: false,
	error: undefined,
});

const resourceDefaults = (state, resourceId, updateData) => {
	const newResource = g(
		state,
		['resources', resourceId],
		Immutable.from(defaultResource)
	);
	return newResource.merge(updateData);
};

const removeResourceHandlerSpec = [
	t.struct({
		link: ResourceLink,
		collectionsLinks: t.maybe(t.list(ResourceLink)),
	}),
	(state, { payload: { link, collectionsLinks } }) => {
		let newState = state;
		const resourceId = hash(link);
		const resource = g(newState, ['resources', resourceId]);
		if (resource) {
			const idToRemove = g(resource, 'content');
			if (!isArray(idToRemove)) {
				each(collectionsLinks, (collectionLink) => {
					const collectionResourceId = hash(collectionLink);
					const collectionResource = g(newState, ['resources', collectionResourceId]);
					if (collectionResource) {
						const collectionResourceContent = g(collectionResource, 'content');
						if (isArray(collectionResourceContent) && collectionResourceContent.includes(idToRemove)) {
							newState = newState.updateIn(
								['resources', collectionResourceId, 'content'],
								(currentCollectionResourceContent) =>
									currentCollectionResourceContent.filter(containedEntityId => containedEntityId !== idToRemove)
							);
						}
					}
				});
			}
		}

		return newState.updateIn(['resources'], (currentResources) =>
			currentResources.without(resourceId)
		);
	},
];

export default createReducer(
	t.struct({
		service: ResourcesService,
		paths: t.dict(
			t.String,
			t.Object
		),
		definitions: t.dict(
			t.String,
			t.Object
		),
		resources: t.dict(
			t.String,
			Resource
		),
		mergeDataMutator: t.maybe(t.Function),
	}),
	Immutable.from({
		paths: {},
		definitions: {},
		resources: {},
	}),
	{
		[ENSURE_RESOURCE]: [
			t.struct({
				link: ResourceLink,
				relations: t.maybe(t.list(t.String)),
			}),
			(state, action) => {
				const { link } = action.payload;
				let newState = state;

				const resourceId = hash(link);
				const existingResource = g(state, ['resources', resourceId]);
				if (!existingResource) {
					newState = newState
						.setIn(
							['resources', resourceId],
							defaultResource
						)
						.setIn(
							['resources', resourceId, 'link'],
							link
						);
				}
				return newState;
			},
		],
		[FETCH_RESOURCE]: [
			t.struct({
				link: ResourceLink,
			}),
			(state, action) => {
				const { link } = action.payload;
				let newState = state;

				const resourceId = hash(link);
				const existingResource = g(state, ['resources', resourceId]);
				if (!existingResource) {
					newState = newState
						.setIn(
							['resources', resourceId],
							defaultResource
						)
						.setIn(
							['resources', resourceId, 'link'],
							link
						);
				}

				newState = newState
					.setIn(
						['resources', resourceId, 'fetching'],
						true
					)
					.setIn(
						['resources', resourceId, 'error'],
						undefined
					);

				return newState;
			},
		],
		[RECEIVE_FETCH_RESOURCE_FAILURE]: [
			t.struct({
				link: ResourceLink,
				error: AppError,
			}),
			(state, action) => {
				const { link, error } = action.payload;
				let newState = state;
				const resourceId = hash(link);
				const existingResource = g(state, ['resources', resourceId]);
				if (existingResource) {
					newState = newState
						.setIn(
							['resources', resourceId, 'fetching'],
							false
						)
						.setIn(
							['resources', resourceId, 'error'],
							error
						);
				}
				return newState;
			},
		],
		[RECEIVE_RESOURCE]: [
			t.struct({
				link: ResourceLink,
				transientLink: t.maybe(ResourceLink),
				content: t.Any,
			}),
			(state, action) => {
				const { link, content, transientLink } = action.payload;
				const resourceId = hash(link);
				let newState = state;
				if (transientLink) {
					const transientResourceId = hash(transientLink);
					newState = newState.set('resources', newState.resources.without(transientResourceId));
				}
				newState = newState.updateIn(
					['resources', resourceId],
					(resource) => {
						let baseResource = resource;
						if (!baseResource) {
							baseResource = Immutable.from(defaultResource);
						}
						return baseResource.merge(
							{
								link,
								content,
								error: undefined,
								fetching: false,
							},
							{ deep: true }
						);
					}
				);
				return newState;
			},
		],
		[MERGE_RESOURCE]: [
			t.struct({
				link: t.maybe(ResourceLink),
				collectionLink: t.maybe(ResourceLink),
				data: t.Any,
			}),
			// just typecheck action
		],
		[PERSIST_RESOURCE]: [
			t.struct({
				link: ResourceLink,
				transientLink: t.maybe(ResourceLink),
				links: t.dict(
					t.String,
					t.String,
				),
				content: t.Any,
			}),
			(state, { payload: { link, links, content, transient, collectionLink } }) => {
				const resourceId = hash(link);
				let newState = state;
				newState = newState.updateIn(
					['resources', resourceId],
					(resource) => {
						let baseResource = resource;
						if (!baseResource) {
							baseResource = Immutable.from(defaultResource);
						}
						return baseResource.merge(
							{
								link,
								content,
								links,
								error: undefined,
								transient,
								persisting: true,
							}
						);
					}
				);

				// update parent collection
				if (collectionLink) {
					const collectionResourceId = hash(collectionLink);
					const collectionResource = g(newState, ['resources', collectionResourceId]);
					if (!collectionResource) {
						newState = newState.setIn(
							['resources', collectionResourceId],
							resourceDefaults(
								state,
								collectionResourceId,
								{
									link: collectionLink,
									content: [],
								}
							),
						);
					}

					newState = newState.updateIn(
						['resources', collectionResourceId],
						(updatedCollectionResource) => {
							let updatedContent = updatedCollectionResource.content;
							if (
								isArray(updatedCollectionResource.content) && !includes(updatedContent, content)
							) {
								updatedContent = updatedContent.concat([content]);
							}
							return updatedCollectionResource.set('content', updatedContent);
						}
					);
				}

				return newState;
			},
		],
		[RECEIVE_PERSIST_RESOURCE_SUCCESS]: [
			t.struct({
				link: ResourceLink,
				content: t.Any,
				collectionLink: t.maybe(ResourceLink),
				transientLink: t.maybe(ResourceLink),
				transientContent: t.Any,
			}),
			(state, { payload: { link, transientLink, transientContent, content, collectionLink } }) => {
				let newState = state;
				const resourceId = hash(link);
				newState = newState.setIn(['resources', resourceId], resourceDefaults(
					state,
					resourceId,
					{
						link,
						content,
						persisting: false,
					}
				));

				if (transientLink) {
					const transientResourceId = hash(transientLink);
					if (transientResourceId !== resourceId) {
						const transientResource = g(newState, ['resources', transientResourceId]);
						if (transientResource) {
							newState = newState.updateIn(['resources'], (currentResources) =>
								currentResources.without(transientResourceId)
							);
						}
					}
				}

				if (collectionLink) {
					const collectionResourceId = hash(collectionLink);
					const collectionResource = g(newState, ['resources', collectionResourceId]);
					if (collectionResource) {
						newState = newState.updateIn(
							['resources', collectionResourceId, 'content'],
							(collectionContent) => {
								return collectionContent
									.map(containedEntityId => (containedEntityId === transientContent ? content : containedEntityId));
							}
						);
					}
				}

				return newState;
			},
		],
		[RECEIVE_PERSIST_RESOURCE_FAILURE]: [
			t.struct({
				link: ResourceLink,
				content: t.Any,
			}),
			(state, { payload: { link, error } }) => {
				const resourceId = hash(link);
				return state
					.setIn(['resources', resourceId, 'error'], error)
					.setIn(['resources', resourceId, 'persisting'], false);
			},
		],
		[DEFINE_RESOURCE]: [
			t.struct({
				link: ResourceLink,
				content: t.Any,
			}),
			(state, { payload: { link, content } }) => {
				const resourceId = hash(link);
				const newResource = resourceDefaults(
					state,
					resourceId,
					{
						content,
					}
				);
				return state.setIn(['resources', resourceId], newResource);
			},
		],
		[DELETE_RESOURCE]: [
			t.struct({
				link: ResourceLink,
				collectionsLinks: t.maybe(t.list(ResourceLink)),
			}),
			(state, { payload: { link } }) => {
				const resourceId = hash(link);
				const newResource = resourceDefaults(
					state,
					resourceId,
					{
						link,
						deleting: true,
					}
				);
				return state.setIn(['resources', resourceId], newResource);
			},
		],
		[RECEIVE_DELETE_RESOURCE_SUCCESS]: removeResourceHandlerSpec,
		[RECEIVE_DELETE_RESOURCE_FAILURE]: [
			t.struct({
				link: ResourceLink,
				error: AppError,
			}),
			(state, { payload: { link, error } }) => {
				const resourceId = hash(link);
				return state
					.setIn(['resources', resourceId, 'error'], error)
					.setIn(['resources', resourceId, 'deleting'], false);
			},
		],
		[FORGET_RESOURCE]: removeResourceHandlerSpec,
	},
	'resources'
);
