// @flow
import type { Error } from 'client-core/src/utils/types/Error';
export type AuthModuleState = {
	context: Object,
	userLink: { name: string, params?: Object },
	error?: Error,
	initializing: boolean,
	initialized: boolean,
	authenticating: boolean,
}
