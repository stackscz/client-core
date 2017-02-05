// @flow
import type { Error } from './Error';
import type { EntityId } from './EntityId';
export type AuthModuleState = {
	context: Object,
	userId?: EntityId,
	userModelName: string,
	error?: Error,
	initializing: boolean,
	initialized: boolean,
	authenticating: boolean,
}
