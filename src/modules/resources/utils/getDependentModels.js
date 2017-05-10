import { get as g, each, includes } from 'lodash';
import getComposingModels from 'modules/resources/utils/getComposingModels';
import resolveSchema from 'modules/resources/utils/resolveSchema';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';

export default function getDependentModels(inputSchema) {
	if (!inputSchema) {
		return [];
	}
	const schema = resolveSchema(inputSchema);

	const definitions = g(schema, 'definitions');
	const modelName = g(schema, 'x-model');
	const result = [];

	each(Object.keys(definitions), (definitionKey) => {
		const definition = resolveSubschema(schema, ['definitions', definitionKey]);
		const otherModelName = g(definition, 'x-model');
		if (otherModelName) {
			const composingModels = getComposingModels(definition);
			if (includes(composingModels, modelName)) {
				result.push(otherModelName);
			}
		}
	});

	return result;
}
