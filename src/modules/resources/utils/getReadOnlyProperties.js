/* eslint-disable no-param-reassign */
import { get as g, each, keys } from 'lodash';
import resolveSchema from 'modules/resources/utils/resolveSchema';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';

function visitSchema(inputSchema, readOnlyProperties) {
	const schema = resolveSchema(inputSchema);
	const schemaReadOnlyProperties = g(schema, 'x-readOnly', []);
	each(schemaReadOnlyProperties, (propName) => {
		readOnlyProperties[propName] = true;
	});
	const allOf = g(schema, 'allOf');
	if (allOf) {
		each(allOf, (_, partialSchemaIndex) => {
			visitSchema(
				resolveSubschema(schema, ['allOf', partialSchemaIndex]),
				readOnlyProperties
			);
		});
	}
}

export default function getReadOnlyProperties(schema) {
	const readOnlyProperties = {};
	visitSchema(schema, readOnlyProperties);
	return keys(readOnlyProperties);
}
