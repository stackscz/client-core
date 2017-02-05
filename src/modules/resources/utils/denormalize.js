// @flow
/* eslint-disable no-use-before-define, no-param-reassign */
import { each, get as g, isObject, merge } from 'lodash';

import getIdPropertyName from 'client-core/src/modules/resources/utils/getIdPropertyName';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';

import type { JsonSchema } from 'client-core/src/types/JsonSchema';
import type { Entity } from 'client-core/src/types/Entity';
import type { NormalizedEntityDictionary } from 'client-core/src/types/NormalizedEntityDictionary';

function resolveEntityOrId(entityOrId, schema, entityDictionary) {
	const idPropertyName = getIdPropertyName(schema);
	const modelName = g(schema, 'x-model');
	let entityId;
	if (isObject(entityOrId)) {
		entityId = entityOrId[idPropertyName];
	} else {
		entityId = entityOrId;
	}
	const entity = g(entityDictionary, [modelName, entityId]);

	return {
		entity,
		id: entityId,
	};
}

function visitObject(obj, schema, entityDictionary, bag, maxLevel, currentLevel) {
	const denormalized = obj;
	each(g(schema, 'properties'), (propertySchema, key) => {
		// console.log('FOR KEY:', key, 'FOUND SCHEMA:', findSchemaForProperty(schema, key));
		if (propertySchema && obj[key]) {
			denormalized[key] = visit(
				obj[key],
				resolveSubschema(schema, ['properties', key]),
				entityDictionary,
				bag,
				maxLevel,
				currentLevel + 1
			);
		}
	});
	return denormalized;
}
function visitEntity(obj, inputSchema, entityDictionary, bag, maxLevel, currentLevel) {
	const schema = resolveSchema(inputSchema);
	const modelName = g(schema, 'x-model');
	const { entity, id } = resolveEntityOrId(obj, schema, entityDictionary);

	if (!bag.hasOwnProperty(modelName)) {
		bag[modelName] = {};
	}

	if (!bag[modelName].hasOwnProperty(id)) {
		// Ensure we don't mutate it non-immutable objects
		const newObj = merge({}, entity);

		// Need to set this first so that if it is referenced within the call to
		// visitObject, it will already exist.
		bag[modelName][id] = newObj;
		bag[modelName][id] = visitObject(newObj, schema, entityDictionary, bag, maxLevel, currentLevel);

		const allOf = g(schema, 'allOf');
		if (allOf) {
			each(allOf, (_, inputSubModelSchemaIndex) => {
				const subModelSchema = resolveSubschema(schema, ['allOf', inputSubModelSchemaIndex]);
				const subModelSchemaModelName = g(subModelSchema, 'x-model');
				if (subModelSchemaModelName) {
					bag[modelName][id] = {
						...bag[modelName][id],
						...visitEntity(
							g(entityDictionary, [subModelSchemaModelName, id], {}),
							subModelSchema,
							entityDictionary,
							bag,
							maxLevel,
							currentLevel
						),
					};
				} else {
					bag[modelName][id] = {
						...bag[modelName][id],
						...visitObject(
							bag[modelName][id],
							subModelSchema,
							entityDictionary,
							bag,
							maxLevel,
							currentLevel
						),
					};
				}
			});
		}
	}

	return bag[modelName][id];
}
function visitArray(arr, schema, entityDictionary, bag, maxLevel, currentLevel) {
	return arr.map(
		(item) => visit(
			item,
			resolveSubschema(schema, 'items'),
			entityDictionary,
			bag,
			maxLevel,
			currentLevel
		)
	);
}

function visit(obj, inputSchema, entityDictionary, bag, maxLevel, currentLevel = 0) {
	if (!(maxLevel >= currentLevel)) {
		return obj;
	}

	const schema = resolveSchema(inputSchema);
	const type = g(schema, 'type', 'object');
	if (obj === null || typeof obj === 'undefined' || !isObject(schema)) {
		return obj;
	}

	const modelName = g(schema, 'x-model');
	if (modelName && type === 'object') {
		return visitEntity(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
	} else if (type === 'array') {
		return visitArray(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
	}
	// return obj;
	return visitObject(obj, schema, entityDictionary, bag, maxLevel, currentLevel);
}

/**
 * Construct nested value by schema from entities dictionary
 *
 * @param {EntityId | Array<EntityId> | Entity | Array<Entity>} obj - entities spec
 * @param {JsonSchema} schema to denormalize by
 * @param {NormalizedEntityDictionary} entityDictionary
 * @param {?number} maxLevel - max level of nesting when denormalizing
 */
export default function denormalize(obj,
                                    schema: JsonSchema,
                                    entityDictionary: NormalizedEntityDictionary,
                                    maxLevel: number = 1): Entity|Array<Entity> {
	return visit(obj, schema, entityDictionary, {}, maxLevel);
}
