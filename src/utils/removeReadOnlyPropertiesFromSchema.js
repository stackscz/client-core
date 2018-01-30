import { get as g, cloneDeep, pull } from 'lodash';
import traverse from 'utils/traverse';

const removeReadOnlyPropertiesFromSchema = (inputSchema) => {
	const schemaClone = cloneDeep(inputSchema);
	traverse(schemaClone).forEach(
		function (schema) {
			const parentObjectSchemaContext = g(this, 'parent.parent');
			const propertyName = g(this, 'key');
			const parentRequired = g(parentObjectSchemaContext, 'node.required', []);
			if (schema.readOnly && parentObjectSchemaContext.node.type === 'object') {
				delete parentObjectSchemaContext.node.properties[propertyName];
				parentObjectSchemaContext.node.required = pull(parentRequired, propertyName);
			}
		},
	);
	return schemaClone;
};

export default removeReadOnlyPropertiesFromSchema;
