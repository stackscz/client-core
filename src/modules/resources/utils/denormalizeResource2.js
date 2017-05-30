/* eslint-disable no-use-before-define, no-param-reassign */
import { denormalize } from 'normalizr';
import jsonSchemaToNormalizrSchema from './jsonSchemaToNormalizrSchema';
import hash from 'utils/hash';

export default function denormalizeResource2(resourceSchema, paths, entityDictionary, maxLevel = 1, link) {
	const dataSchema = jsonSchemaToNormalizrSchema(resourceSchema, paths, link);
	const denormaliedEntities = denormalize(hash(link), dataSchema, (schemaKey, entityId) => {
		return entityDictionary[entityId];
	});
	return denormaliedEntities;
}
