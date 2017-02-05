import { get as g } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';

export default (inputSchema, subschemaPath) => {
	const schema = resolveSchema(inputSchema);
	const subschema = g(schema, subschemaPath);
	return resolveSchema({ ...subschema, definitions: g(schema, 'definitions', g(subschema, 'definitions')) });
};
