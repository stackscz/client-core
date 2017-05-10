import { each, get as g } from 'lodash';
import walkSchemaProperties from 'modules/resources/utils/walkSchemaProperties';
import resolveSchema from 'modules/resources/utils/resolveSchema';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';

export default function getAssociationsProperties(inputSchema) {
	const schema = resolveSchema(inputSchema);
	const definitions = g(schema, 'definitions');
	const modelName = g(schema, 'x-model');
	const result = {};
	each(Object.keys(definitions), (definitionKey) => {
		const definition = resolveSubschema(schema, ['definitions', definitionKey]);
		const definitionModelName = g(definition, 'x-model');
		if (definitionModelName) {
			const modelAssociationProperties = [];
			walkSchemaProperties(definition, (propertySchema, propertyName) => {
				const propertySchemaModelName = g(
					propertySchema,
					'x-model',
					g(
						resolveSubschema(propertySchema, 'items'),
						['x-model']
					)
				);
				if (propertySchemaModelName === modelName) {
					modelAssociationProperties.push(propertyName);
				}
			});

			if (modelAssociationProperties.length) {
				result[definitionModelName] = modelAssociationProperties;
			}
		}
	});
	return result;
}
