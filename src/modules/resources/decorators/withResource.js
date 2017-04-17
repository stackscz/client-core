import container from 'client-core/src/decorators/container';

import React from 'react';
import { get as g, upperFirst, omit } from 'lodash';
import { compose, pure, withHandlers, withProps, branch, mapProps } from 'recompose';
import lifecycle from 'client-core/src/utils/lifecycle';
import {
	ensureResource,
	fetchResource,
	mergeResource,
	deleteResource,
	forgetResource,
} from 'client-core/src/modules/resources/actions';
import {
	resourceSelectorFactory,
	denormalizedResourceSelectorFactory,
} from 'client-core/src/modules/resources/selectors';

import hash from 'client-core/src/utils/hash';

const emptyResource = {};

export default ({
		link: linkFactory,
		linkPropName = 'resourceLink',
		outputPropsPrefix = '',
		autoload = false,
	}) => {
	const resourceLinkKey = outputPropsPrefix ? `${outputPropsPrefix}ResourceLink` : 'resourceLink';
	const resourceKey = outputPropsPrefix ? `${outputPropsPrefix}Resource` : 'resource';
	const resourceContentKey = outputPropsPrefix ? `${outputPropsPrefix}ResourceContent` : 'resourceContent';
	const handleEnsureResourceKey = `handleEnsure${upperFirst(outputPropsPrefix)}Resource`;
	const handleFetchResourceKey = `handleFetch${upperFirst(outputPropsPrefix)}Resource`;

	return compose(
		pure,
		branch(
			() => !!linkFactory,
			withProps(
				(props) => ({ link: linkFactory(props) })
			),
			withProps(
				(props) => ({ link: g(props, linkPropName) })
			),
		),
		container(
			(state, ownerProps) => {
				const { link: resourceLink } = ownerProps;
				const denormalizedResource = denormalizedResourceSelectorFactory(resourceLink, 5)(state);
				return {
					[resourceLinkKey]: resourceLink,
					[resourceKey]: resourceSelectorFactory(resourceLink)(state) || emptyResource,
					[resourceContentKey]: g(denormalizedResource, 'content'),
				};
			},
		),
		withHandlers(
			{
				[handleEnsureResourceKey]: ({ dispatch, [resourceLinkKey]: resourceLink }) => () => {
					console.log('handleEnsureResourceKey', handleEnsureResourceKey);
					dispatch(
						ensureResource(
							{
								link: resourceLink,
							}
						)
					);
				},
				[handleFetchResourceKey]: ({ dispatch, [resourceLinkKey]: resourceLink }) => () => {
					console.log('handleFetchResourceKey', handleFetchResourceKey);
					dispatch(
						fetchResource(
							{
								link: resourceLink,
							}
						)
					);
				},
				[`handleDelete${upperFirst(outputPropsPrefix)}Resource`]: ({
						dispatch,
						[resourceLinkKey]: resourceLink,
					}) =>
					({ collectionsLinks, link: customLink } = {}) => {
						dispatch(
							deleteResource(
								{
									link: customLink || resourceLink,
									collectionsLinks,
								}
							)
						);
					},
				[`handleMerge${upperFirst(outputPropsPrefix)}Resource`]: ({
						dispatch,
						[resourceLinkKey]: resourceLink
					} = {}) =>
					({ link, data, collectionLink } = {}) => {
						dispatch(mergeResource({ link: link || resourceLink, data, collectionLink }));
					},
				[`handleForget${upperFirst(outputPropsPrefix)}Resource`]: ({
						dispatch,
						[resourceLinkKey]: resourceLink
					}) =>
					({ link, collectionsLinks } = {}) => {
						dispatch(forgetResource({ link: link || resourceLink, collectionsLinks }));
					},
			}
		),
		lifecycle(
			(
				autoload ? (
					{
						componentWillMount({ [handleEnsureResourceKey]: handleEnsureResource }) {
							console.log('withResourceMounted');
							handleEnsureResource();
						},
						componentWillReceiveProps({ [resourceLinkKey]: oldResourceLink },
							{ [resourceLinkKey]: resourceLink, [handleEnsureResourceKey]: handleEnsureResource }) {
							if (hash(resourceLink) !== hash(oldResourceLink)) {
								console.log('LINK CHANGED', oldResourceLink, resourceLink);
								handleEnsureResource();
							}
						},
					}
				) : {}
			)
		),
		mapProps(
			(props) => omit(props, ['link']),
		),
	);
};
