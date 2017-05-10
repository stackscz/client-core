import { get as g, setWith, isObject, isArray, each, isEqual, isUndefined } from 'lodash';
import invariant from 'invariant';
import resolveSchema from 'modules/resources/utils/resolveSchema';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';
import getIdPropertyName from 'modules/resources/utils/getIdPropertyName';
import walkSchemaProperties from 'modules/resources/utils/walkSchemaProperties';
import pickFirstNonNullSchema from 'modules/resources/utils/pickFirstNonNullSchema';
import getFirstNonNullSchemaType from 'modules/resources/utils/getFirstNonNullSchemaType';
import isSchemaEmpty from 'modules/resources/utils/isSchemaEmpty';

const mergeIntoEntity = (entityA, entityB, modelName) => {
	each(entityB, (value, key) => {
		if (!entityB.hasOwnProperty(key)) {
			return;
		}

		if (!entityA.hasOwnProperty(key) || isEqual(entityA[key], entityB[key])) {
			entityA[key] = entityB[key]; // eslint-disable-line no-param-reassign
			return;
		}

		console.warn(
			`When merging two ${modelName},
			found unequal data in their "${key}" values.
			Using the earlier value.`,
			entityA[key], entityB[key]
		);
	});
};

export const visitEntity = (value, entitySchema, resourcesDict) => {
	// console.log('visitEntity:', value);

	const idPropertyName = getIdPropertyName(entitySchema);
	const modelName = g(entitySchema, 'x-model');

	const id = g(value, idPropertyName);
	if (!id) {
		return value;
	}

	const stored = g(
		setWith(
			resourcesDict,
			[modelName, id],
			g(
				resourcesDict,
				[modelName, id],
				{}
			),
			Object,
		),
		[modelName, id],
	);
	let normalized = visitObject(value, entitySchema, resourcesDict); // eslint-disable-line no-use-before-define
	mergeIntoEntity(stored, normalized);


	// is it composite entity?
	const allOf = g(entitySchema, 'allOf');
	if (isArray(allOf)) {
		each(allOf, (_, inputComposedSchemaIndex) => {
			const composedSchema = resolveSubschema(entitySchema, ['allOf', inputComposedSchemaIndex]);
			const composedSchemaModelName = g(composedSchema, 'x-model');
			if (composedSchemaModelName) {
				visitEntity(
					value,
					composedSchema,
					resourcesDict,
				);
			} else {
				normalized = visitObject( // eslint-disable-line no-use-before-define
					value,
					{
						// 'x-associationMapping': assocMap,
						'x-idPropertyName': idPropertyName,
						...composedSchema,
					},
					resourcesDict,
				);
				mergeIntoEntity(stored, normalized, modelName);
			}
		});
	}


	return id;
};

export const visitArray = (value, arraySchema, resourcesDict) => {
	invariant(isArray(value), 'Value is not an array: %s for schema %s', value, arraySchema);
	const arrayItemSchema = resolveSubschema(arraySchema, 'items');
	return value.map((item) => visit(item, arrayItemSchema, resourcesDict)); // eslint-disable-line no-use-before-define
};

export const visitObject = (value, objectSchema, resourcesDict) => {
	// console.log('visitObject:', value);

	const modelName = g(objectSchema, 'x-model');
	const normalized = {};
	walkSchemaProperties(
		objectSchema,
		(propertySchema, propertyName, propertyParentSchema) => {
			const propertyParentModelName = g(propertyParentSchema, 'x-model');
			if (!modelName || modelName === propertyParentModelName) {
				const result = visit( // eslint-disable-line no-use-before-define
					g(value, propertyName),
					propertySchema,
					resourcesDict,
				);
				if (!isUndefined(result)) {
					setWith(
						normalized,
						propertyName,
						result,
						Object,
					);
				}
			}
		}
	);
	const additionalProperties = g(objectSchema, 'additionalProperties');
	if (additionalProperties) {
		each(value, (_, propertyName) => {
			const result = visit( // eslint-disable-line no-use-before-define
				g(value, propertyName),
				additionalProperties,
				resourcesDict,
			);
			if (!isUndefined(result)) {
				setWith(
					normalized,
					propertyName,
					result,
					Object,
				);
			}
		});
	}

	return normalized;
};

export const visit = (value, inputSchema, resourcesDict) => {
	// console.log();
	// console.log();
	// console.log('visit:', value);
	const schema = pickFirstNonNullSchema(resolveSchema(inputSchema));

	if (!isObject(value) || isSchemaEmpty(schema)) {
		return value;
	}

	const valueType = getFirstNonNullSchemaType(schema);
	const idPropertyName = getIdPropertyName(schema);
	const modelName = g(schema, 'x-model');

	if (idPropertyName && modelName) {
		return visitEntity(value, schema, resourcesDict);
	} else if (valueType === 'array') {
		return visitArray(value, schema, resourcesDict);
	} else if (valueType === 'object') {
		return visitObject(value, schema, resourcesDict);
	}

	return value;
};

export default (value, schema) => {
	const resourcesDict = {};
	const result = visit(value, schema, resourcesDict);

	return {
		result,
		entities: resourcesDict,
	};
};
