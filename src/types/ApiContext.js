// @flow
import type { Host } from './Host';
import type { ApiDescriptionService } from './ApiDescriptionService';

export type ApiContext = {
	host?: Host,
	service: ApiDescriptionService,
};
