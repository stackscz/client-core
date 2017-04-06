// @flow
import type { ResourceLink } from 'client-core/src/modules/resources/types/ResourceLink';
import type { AppError } from 'client-core/src/types/AppError';

export type Resource = {
	link: ResourceLink,
	links: {
		[rel: string]: string,
	},
	content?: any,
	error?: AppError,
	transient: boolean,
	fetching: boolean,
	persisting: boolean,
};
