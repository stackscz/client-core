import { get as g, reduce } from 'lodash';
import hash from 'utils/hash';

export const reconnectProbeResourceRetriesCountSelector = (state) => {
	return g(state, 'connectionSentry.reconnectProbeResourceRetriesCount');
};

export const reconnectProbeResourceLastFailureTimeSelector = (state) => {
	return g(state, 'connectionSentry.reconnectProbeResourceLastFailureTime');
};

export const reconnectProbeResourceLinkSelector = (state) => {
	return g(state, 'connectionSentry.reconnectProbeResourceLink');
};

export const reconnectProbeResourceSelector = (state) => {
	const reconnectProbeResourceLink = reconnectProbeResourceLinkSelector(state);
	if (!reconnectProbeResourceLink) {
		return undefined;
	}
	return g(state, ['resources', 'resources', hash(reconnectProbeResourceLink)]);
};

export const resourcesFailedOnErrorCodeSelectorFactory = (targetErrorCode) => {
	return (state) => {
		return reduce(
			g(state, 'resources.resources'),
			(acc, resource, resourceId) => {
				const errorCode = g(resource, 'error.code');
				const requestMethod = g(resource, 'error.requestMethod');
				if (errorCode === targetErrorCode && requestMethod === 'GET') {
					return {
						...acc,
						[resourceId]: resource,
					};
				}
				return acc;
			},
			{}
		);
	};
};

export const resourcesFailedOnNetworkErrorSelector = resourcesFailedOnErrorCodeSelectorFactory(5000);
export const resourcesFailedOnServerErrorSelector = resourcesFailedOnErrorCodeSelectorFactory(500);
