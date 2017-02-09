// @flow
import type { Host } from './Host';
import type { ApiService } from './ApiService';
export type ApiContext = {
	host?: Host,
	service: ApiService,
};
