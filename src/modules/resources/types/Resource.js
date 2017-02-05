// @flow
import type { ResourceLink } from 'client-core/src/modules/resources/types/ResourceLink';
import type { Error } from 'client-core/src/types/Error';
export type Resource = {
	link: ResourceLink,
	links: {
		[rel: string]: string,
	},
	content?: any,
	error?: Error,
	transient: boolean,
	fetching: boolean,
	persisting: boolean,
};
