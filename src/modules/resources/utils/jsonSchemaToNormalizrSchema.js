import { get as g, size, first, values, isString, isArray, isObject, has, map, reduce, pickBy, assign, concat, uniq, cloneDeep } from 'lodash';
import { schema as NS } from 'normalizr';
import memoize from 'fast-memoize';
import hash from 'utils/hash';
import normalizeLink2 from 'modules/resources/utils/normalizeLink2';
import NormalizrResourceSchema from 'modules/resources/schemas/Resource';
import pathsToResources from './pathsToResources';

const resolveJsonPointer = (parentSchema, schema) => {
	const ref = g(schema, '$ref');
	if (!ref) {
		return schema;
	}
	const refParts = ref.replace(/^#\//, '').split('/');
	return {
		...g(parentSchema, refParts),
		definitions: g(parentSchema, 'definitions', {}),
	};
};

const defineObjectSchemaProperties = function (schema, definitions, entitySchema, properties, resources, resourceLinkName, schemasBag) {
	const links = g(schema, 'x-links', {});
	map(
		properties,
		(propertySchema, propertyName) => {
			const propertyResourceLinkName = g(links, propertyName);
			const resultPropertySchema = visitSchema(
				resolveJsonPointer(
					schema,
					{
						...propertySchema,
						definitions
					},
				),
				resources,
				propertyResourceLinkName,
				schemasBag,
			);
			if (resultPropertySchema) {
				entitySchema.define(
					{
						[propertyName]: resultPropertySchema
					}
				);
			}
		},
	);
};

const visitSchema = (schemaAttr, resources, resourceLinkName, schemasBag) => {
	if (isString(schemaAttr)) {
		return undefined;
	}

	let schema = schemaAttr;
	let allOfSchema = g(schema, 'allOf');
	if (allOfSchema && isArray(allOfSchema)) {
		const definitions = g(schema, 'definitions', {});
		const mergedSchemas = reduce(
			allOfSchema,
			(acc, schemaItem) => {
				if (isString(schemaItem)) {
					return acc;
				}

				const schemaElement = resolveJsonPointer(
					schema,
						{
							...schemaItem,
							definitions,
						},
				);

				if (!schemaElement) {
					return acc;
				}

				assign(
					acc.properties,
					g(schemaElement, 'properties', {}),
				);

				acc.required = uniq(
					concat(
						acc.required,
						g(schemaElement, 'required', []),
					)
				);

				return acc;
			},
			{
				properties: {},
				required: [],
			}
		);

		const schemaCopy = cloneDeep(schema);
		assign(
			schemaCopy,
			mergedSchemas
		);

		schema = schemaCopy;
	}

	let valueType = g(schema, 'type', g(schema, 'anyOf', 'object'));
	const definitions = g(schema, 'definitions', {});
	if (isArray(valueType)) {
		const unionSchemaDefinition = reduce(
			valueType,
			(acc, valueTypeItem) => {
				if (isString(valueTypeItem)) {
					return acc;
				}

				const elementSchema = visitSchema(
					resolveJsonPointer(
						schema,
						{
							...valueTypeItem,
							definitions,
						},
					),
					resources,
					resourceLinkName,
					schemasBag,
				);
				if (!elementSchema) {
					return acc;
				}
				const valueTypeItemType = g(valueTypeItem, 'type', 'object');
				return {
					schemas: { ...acc.schemas, [valueTypeItemType]: elementSchema },
				}
			},
			{
				schemas: {
					primitive: {}
				},
			}
		);
		if (size(unionSchemaDefinition.schemas) === 1) {
			return undefined;
			// return unionSchemaDefinition.schemas.primitive;
		} else if (size(unionSchemaDefinition.schemas) === 2) {
			delete unionSchemaDefinition.schemas.primitive;
			return first(values(unionSchemaDefinition.schemas));
		}
		return new NS.Union(
			unionSchemaDefinition.schemas,
			(value, parent, key) => {
				if (isArray(value)) {
					return 'array';
				}
				if (isObject(value)) {
					return 'object';
				}
				return 'primitive';
			},
		)
	} else {
		switch (valueType) {
			case 'array':
				// if(resourceLinkName && schemasBag[resourceLinkName]) {
				// 	return schemasBag[resourceLinkName];
				// }
				const arrayItemJSONSchema = resolveJsonPointer(schema, g(schema, 'items'));
				if (!arrayItemJSONSchema) {
					return undefined;
				}
				const arrayItemSchema = visitSchema(arrayItemJSONSchema, resources, undefined, schemasBag);
				if (!arrayItemSchema) {
					return undefined;
				}
				let resultingSchema = new NS.Array(arrayItemSchema);
				if (resourceLinkName) {
					resultingSchema = new NormalizrResourceSchema(resourceLinkName, resultingSchema, g(resources, resourceLinkName));
					// schemasBag[resourceLinkName] = resultingSchema
				}
				return resultingSchema;
			case 'object':
				const modelName = g(schema, 'x-model');
				const idPropertyName = g(schema, 'x-idPropertyName', 'id');
				const properties = g(schema, 'properties', {});
				const links = g(schema, 'x-links', {});
				if (modelName) {
					if (resourceLinkName && schemasBag[resourceLinkName]) {
						return schemasBag[resourceLinkName];
					}
					if (schemasBag[modelName]) {
						return schemasBag[modelName];
					}
					let entitySchema = new NS.Entity(
						modelName,
						{},
						{
							idAttribute: (value, parent, key) => {
								// return `${modelName}:${g(value, idPropertyName)}`;
								return `${hash({ name: modelName, params: { id: `${g(value, idPropertyName)}` } })}`;
							},
							processStrategy: (value, parent, key) => {
								let resultValue = { ...pickBy(value, (v, pn) => properties[pn]) };
								const links = g(schema, 'x-links');
								if (links) {
									resultValue = reduce(
										links,
										(acc, linkName, propertyName) => {
											if (acc[propertyName]) {
												return acc;
											}
											const nlink = normalizeLink2({
												name: linkName,
												params: { parent: value },
											}, resources);
											return {
												...acc,
												[propertyName]: `${hash(nlink)}`,
												[`${propertyName}_link`]: nlink,
											};
										},
										resultValue,
									);
								}
								return resultValue;
							},
						},
					);
					schemasBag[modelName] = entitySchema;
					defineObjectSchemaProperties(schema, definitions, entitySchema, properties, resources, resourceLinkName, schemasBag);
					if (resourceLinkName && resourceLinkName !== modelName) {
						// debugger;
						const entityResourceSchema = new NormalizrResourceSchema(resourceLinkName, entitySchema, g(resources, resourceLinkName));
						// schemasBag[resourceLinkName] = entityResourceSchema;
						return entityResourceSchema;
					}
					return entitySchema;
				} else {
					const objectSchema = new NS.Object({});
					defineObjectSchemaProperties(schema, definitions, objectSchema, properties, resources, undefined, schemasBag);
					if (resourceLinkName && resourceLinkName !== modelName) {
						// debugger;
						const objectResourceSchema = new NormalizrResourceSchema(resourceLinkName, objectSchema, g(resources, resourceLinkName));
						return objectResourceSchema;
					}
					return objectSchema;
				}
				break;
			default:
				return undefined;
		}
	}
};

export default memoize(
	(jsonSchema, paths, link) => {
		const schemasBag = {};
		const resources = pathsToResources(paths);
		return visitSchema(jsonSchema, resources, link && link.name, schemasBag);
	}
);
