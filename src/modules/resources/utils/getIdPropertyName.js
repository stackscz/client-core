import { get as g, reduce } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';

export default function getIdPropertyName(inputSchema) {
	const schema = resolveSchema(inputSchema);
	const idPropertyName = g(schema, 'x-idPropertyName');
	if (idPropertyName) {
		return idPropertyName;
	}
	const allOf = g(schema, 'allOf');
	if (allOf) {
		return reduce(allOf, (currentIdPropertyName, _, partialSchemaIndex) => {
			if (currentIdPropertyName) {
				return currentIdPropertyName;
			}
			return getIdPropertyName(resolveSubschema(schema, ['allOf', partialSchemaIndex]));
		}, undefined);
	}
	return undefined;
}
