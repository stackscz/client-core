/* eslint-disable no-param-reassign */
import { get as g, each, keys } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';

function visitSchema(inputSchema, writeOnlyProperties) {
	const schema = resolveSchema(inputSchema);
	const schemaWriteOnlyProperties = g(schema, 'x-writeOnly', []);
	each(schemaWriteOnlyProperties, (propName) => {
		writeOnlyProperties[propName] = true;
	});
	const allOf = g(schema, 'allOf');
	if (allOf) {
		each(allOf, (_, partialSchemaIndex) => {
			visitSchema(
				resolveSubschema(schema, ['allOf', partialSchemaIndex]),
				writeOnlyProperties
			);
		});
	}
}

export default function getWriteOnlyProperties(schema) {
	const writeOnlyProperties = {};
	visitSchema(schema, writeOnlyProperties);
	return keys(writeOnlyProperties);
}
