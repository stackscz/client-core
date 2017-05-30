// @flow
import type { ResourceLink } from 'modules/resources/types/ResourceLink';
import type { AppError } from 'types/AppError';

export type Resource = {
	link: ResourceLink,
	fetched: boolean,
	error?: AppError,
	transient: boolean,
	fetching: boolean,
	persisting: boolean,
};
