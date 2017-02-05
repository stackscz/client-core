import { get as g } from 'lodash';
import invariant from 'invariant';
import findSchemaByRef from 'client-core/src/modules/resources/utils/findSchemaByRef';

export default (schema) => {
	const schemaRef = g(schema, '$ref');

	if (schemaRef) {
		const foundSchema = findSchemaByRef(schemaRef, schema);
		invariant(foundSchema, 'Could not find schema at %s', schemaRef);
		return { ...foundSchema, definitions: g(schema, 'definitions') };
	}
	return schema;
};
