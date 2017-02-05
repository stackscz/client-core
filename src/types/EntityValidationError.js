// @flow
import type { Error } from './Error';
export type EntityValidationError = Error & {
	validationResults?: {}
}
