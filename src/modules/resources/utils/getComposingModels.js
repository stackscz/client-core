import { get as g, reduce } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';

export default function getComposingModels(inputSchema) {
	const schema = resolveSchema(inputSchema);
	const modelName = g(schema, 'x-model');
	const result = modelName ? [modelName] : [];
	const allOf = g(schema, 'allOf');
	if (allOf) {
		return reduce(
			allOf,
			(currentModels, _, partialSchemaIndex) =>
				[
					...currentModels,
					...getComposingModels(
						resolveSubschema(schema, ['allOf', partialSchemaIndex])
					),
				],
			result
		);
	}
	return result;
}
