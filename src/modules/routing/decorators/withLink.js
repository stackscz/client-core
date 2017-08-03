import React from 'react';
import { compose, withProps, shouldUpdate, shallowEqual } from 'recompose';
import { startsWith, isObject, isEqual } from 'lodash';
import memoize from 'fast-memoize';
import { connect } from 'react-redux';
import { omitProps } from 'utils';
import getPath from '../utils/getPath';

// const toSelector = memoize((to, pathname) => ({ ...to, pathname }));

const withLink = compose(
	shouldUpdate(
		({ to, ...props }, { to: nextTo, ...nextProps }) => {
			const isToEqual = isEqual(to, nextTo);
			const isOthersShallowEqual = shallowEqual(props, nextProps);
			const update = !isOthersShallowEqual || !isToEqual;
			return update;
		},
	),
	connect(({ routes = {}, router: { location } = {} }) => ({ routes, location })),
	withProps(
		({ to, routes, location, onlyActiveOnIndex = true }) => {
			if (isObject(to)) {
				const matchResult = getPath(to, routes) || '';
				if (!matchResult) {
					console.warn('Could not find route for ', to);
				}
				const pathname = matchResult.split('?')[0];
				return {
					to: matchResult || '/',
					isActive: onlyActiveOnIndex ? pathname === location.pathname : startsWith(location.pathname, pathname),
				};
			}
			return {};
		},
	),
	omitProps(['routes', 'location']),
);

export default withLink;
