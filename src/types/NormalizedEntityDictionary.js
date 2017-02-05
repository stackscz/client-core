// @flow
import type { CollectionName } from './CollectionName';
import type { EntityId } from './EntityId';
import type { NormalizedEntity } from './NormalizedEntity';
export type NormalizedEntityDictionary = {
	[key: CollectionName]:{
		[key: EntityId]: NormalizedEntity
	}
};
