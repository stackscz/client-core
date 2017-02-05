import container from 'client-core/src/decorators/container';

import React from 'react';
import { get as g, upperFirst } from 'lodash';
import { compose, pure, lifecycle, withHandlers } from 'client-core/src/utils/react-fp';
import {
	ensureResource,
	mergeResource,
	deleteResource,
} from 'client-core/src/modules/resources/actions';
import {
	resourceSelectorFactory,
	denormalizedResourceSelectorFactory,
} from 'client-core/src/modules/resources/selectors';

export default ({
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
		container(
			(state, ownerProps) => {
				const resourceLink = g(ownerProps, linkPropName);
				const denormalizedResource = denormalizedResourceSelectorFactory(resourceLink)(state);
				return {
					[resourceLinkKey]: resourceLink,
					[resourceKey]: resourceSelectorFactory(resourceLink)(state),
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
