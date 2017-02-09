// @flow
import type { EntitySchema } from './EntitySchema';

export type DefinitionsDictionary = Object & {
	[key: string]: EntitySchema
};
