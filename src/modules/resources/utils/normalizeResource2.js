import { reduce, mapValues } from 'lodash';
import { normalize } from 'normalizr';
import jsonSchemaToNormalizrSchema from './jsonSchemaToNormalizrSchema';
import hash from 'utils/hash';

export default function normalizeResource2(resourceSchema, paths, link, data) {
	const dataSchema = jsonSchemaToNormalizrSchema(resourceSchema, paths);
	const { entities, result } = normalize(data, dataSchema);
	const resultEntities = reduce(
		entities,
		(acc, resourcesEntities, modelName) => {
			return {
				...acc,
				...resourcesEntities,
			};
		},
		{
			[hash(link)]: {
				content: result,
				id: hash(link),
				link,
			},
		}
	);
	return resultEntities;
}
