import { get as g, reduce } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';

export default ({ paths, definitions, link }) => {
	return resolveSchema(
		reduce(paths, (schemaResult, pathSpec) => {
			if (schemaResult) {
				return schemaResult;
			}
			if (g(pathSpec, 'x-linkName') === link.name) {
				return reduce(
					[
						'get.responses.200.schema',
						'post.responses.200.schema',
						'put.responses.200.schema',
					],
					(linkSchemaResult, schemaPath) => {
						if (linkSchemaResult) {
							return linkSchemaResult;
						}
						const schema = g(pathSpec, schemaPath);
						if (schema) {
							return { ...g(pathSpec, schemaPath), definitions };
						}
						return linkSchemaResult;
					},
					undefined,
				);
			}
			return schemaResult;
		}, undefined)
	);
};
