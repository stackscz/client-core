import { connect } from 'react-redux';

import React from 'react';
import { get as g, upperFirst, omit } from 'lodash';
import { compose, pure, withHandlers, withProps, branch, mapProps } from 'recompose';
import memoize from 'fast-memoize';
import lifecycle from 'utils/lifecycle';
import {
	ensureResource,
	fetchResource,
	mergeResource,
	deleteResource,
	forgetResource,
} from 'modules/resources/actions';
import {
	resourceSelectorFactory,
	denormalizedResourceSelectorFactory,
} from 'modules/resources/selectors';

import hash from 'utils/hash';

const emptyResource = {};
const linkSelector = (props, linkPropName) => g(props, linkPropName);

export default ({
	link,
	linkPropName = 'resourceLink',
	outputPropsPrefix = '',
	autoload = false,
}) => {
	const resourceLinkKey = outputPropsPrefix ? `${outputPropsPrefix}ResourceLink` : 'resourceLink';
	const resourceKey = outputPropsPrefix ? `${outputPropsPrefix}Resource` : 'resource';
	const resourceContentKey = outputPropsPrefix ? `${outputPropsPrefix}ResourceContent` : 'resourceContent';
	const handleEnsureResourceKey = `handleEnsure${upperFirst(outputPropsPrefix)}Resource`;
	const handleFetchResourceKey = `handleFetch${upperFirst(outputPropsPrefix)}Resource`;

	const linkFactory = !!link ? link : (props) => g(props, linkPropName);
	// const memoizedLinkFactory = memoize(linkFactory);

	return compose(
		pure,
		withProps(
			(props) => {
				return { link: linkFactory(props) }
			},
		),
		connect(
			(state, ownerProps) => {
				const { link: resourceLink } = ownerProps;
				// TODO dynamic denormalization schema instead of 5 levels deep
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
					({ link, data, parentLink } = {}) => {
						dispatch(mergeResource({ link: link || resourceLink, data, parentLink }));
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
