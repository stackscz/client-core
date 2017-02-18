import container from 'client-core/src/utils/decorators/container';

import React from 'react';
import { get as g, upperFirst } from 'lodash';
import { compose, pure, lifecycle, withHandlers, withProps, branch } from 'client-core/src/utils/react-fp';
import {
	ensureResource,
	mergeResource,
	deleteResource,
} from 'client-core/src/modules/resources/actions';
import {
	resourceSelectorFactory,
	denormalizedResourceSelectorFactory,
} from 'client-core/src/modules/resources/selectors';

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
	const handleLoadResourceKey = `handleLoad${upperFirst(outputPropsPrefix)}Resource`;

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
				[handleLoadResourceKey]: ({ dispatch, [resourceLinkKey]: resourceLink }) => () => {
					dispatch(
						ensureResource(
							{
								link: resourceLink,
							}
						)
					);
				},
				[`handleDelete${upperFirst(outputPropsPrefix)}Resource`]: ({
					dispatch,
					[resourceLinkKey]: resourceLink,
				}) => ({ collectionsLinks }) => {
					dispatch(
						deleteResource(
							{
								link: resourceLink,
								collectionsLinks,
							}
						)
					);
				},
				[`handleMerge${upperFirst(outputPropsPrefix)}Resource`]: ({ dispatch }) => ({ link, data, collectionLink }) => {
					dispatch(mergeResource({ link, data, collectionLink }));
				},
			}
		),
		lifecycle(
			(
				autoload ?
				(
					{
						componentWillMount({ [handleLoadResourceKey]: handleLoadResource }) {
							handleLoadResource();
						},
					}
				) : {}
			)
		),
	);
};
