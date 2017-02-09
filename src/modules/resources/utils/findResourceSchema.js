import { get as g, reduce } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';
import getDefinitionSchema from 'client-core/src/modules/resources/utils/getDefinitionSchema';

export default ({ paths, definitions, link }) => {
	let schema = reduce(paths, (schemaResult, pathSpec) => {
		if (schemaResult) {
			return schemaResult;
		}
		if (g(pathSpec, 'x-linkName') === link.name) {
			const presetResourceSchema = g(pathSpec, 'x-schema');
			if (presetResourceSchema) {
				return resolveSchema({ ...presetResourceSchema, definitions });
			}
			return reduce(
				[
					'get.responses.200.schema',
					// 'post.responses.200.schema',
					// 'put.responses.200.schema',
				],
				(linkSchemaResult, schemaPath) => {
					if (linkSchemaResult) {
						return linkSchemaResult;
					}
					const subschema = g(pathSpec, schemaPath);
					if (subschema) {
						return { ...g(pathSpec, schemaPath), definitions };
					}
					return linkSchemaResult;
				},
				undefined,
			);
		}
		return schemaResult;
	}, undefined);

	if (!schema) {
		schema = getDefinitionSchema(link.name, definitions);
	}

	return resolveSchema(schema);
};
