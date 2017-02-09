// @flow
import type { EntitySchema } from './EntitySchema';
export type EntityPropertySchema = {
	type?: string,
	$ref?: string,
	allOf?: Array<EntitySchema>,
};
