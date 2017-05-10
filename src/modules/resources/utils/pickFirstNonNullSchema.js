import { get as g, isArray } from 'lodash';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';


const pickFirstNonNullSchema = (schema) => {
	let resultSchema = schema;
	const anyOf = g(schema, 'anyOf');
	if (isArray(anyOf)) {
		resultSchema = anyOf.reduce(
			(schemaResult, _, partialSchemaIndex) => {
				const partialSchema = pickFirstNonNullSchema(
					resolveSubschema(schema, ['anyOf', partialSchemaIndex])
				);
				const partialSchemaType = g(partialSchema, 'type');
				return schemaResult || (partialSchemaType !== 'null' ? partialSchema : undefined);
			},
			undefined,
		);
	}
	// TODO I promise I will DRY this one day
	const oneOf = g(schema, 'oneOf');
	if (isArray(oneOf)) {
		resultSchema = oneOf.reduce(
			(schemaResult, _, partialSchemaIndex) => {
				const partialSchema = pickFirstNonNullSchema(
					resolveSubschema(schema, ['oneOf', partialSchemaIndex])
				);
				const partialSchemaType = g(partialSchema, 'type');
				return schemaResult || (partialSchemaType !== 'null' ? partialSchema : undefined);
			},
			undefined,
		);
	}
	return resultSchema;
};

export default pickFirstNonNullSchema;
