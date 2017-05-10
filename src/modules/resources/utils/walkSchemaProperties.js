import { each, get as g } from 'lodash';
import resolveSchema from 'modules/resources/utils/resolveSchema';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';

export default function walkSchemaProperties(inputSchema, iteratee) {
	const schema = resolveSchema(inputSchema);
	const properties = g(schema, 'properties', {});
	each(Object.keys(properties), (propertyName) => {
		iteratee(
			resolveSubschema(schema, ['properties', propertyName]),
			propertyName,
			schema,
		);
	});
	const allOf = g(schema, 'allOf');
	if (allOf) {
		each(allOf, (subSchema, subSchemaIndex) => {
			walkSchemaProperties(
				resolveSubschema(schema, ['allOf', subSchemaIndex]),
				iteratee
			);
		});
	}
}
