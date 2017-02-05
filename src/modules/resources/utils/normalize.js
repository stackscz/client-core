// @flow
/* eslint-disable no-param-reassign */
import { get as g, merge, isObject, memoize, reduce, each, isEqual, isArray } from 'lodash';
import safeJSONStringify from 'client-core/src/utils/safeJSONStrigify';
import mergeWithArraysUnique from 'client-core/src/utils/mergeWithArraysUnique';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';
import type { EntityId } from 'client-core/src/types/EntityId';
import type { JsonSchema } from 'client-core/src/types/JsonSchema';
import type { NormalizedEntityDictionary } from 'client-core/src/types/NormalizedEntityDictionary';
type NormalizationResult = {
	entities: NormalizedEntityDictionary,
	result: EntityId | Array<EntityId>,
}

function logIndented(level, ...msgs) { // eslint-disable-line
	if (process.env.DEBUG_LOGGING_ENABLED) {
		console.log(' '.repeat(level * 4), ...msgs);
	}
}

const findIdPropName = memoize(function findIdPropName(inputSchema) {
	const schema = resolveSchema(inputSchema);
	const idPropName = g(schema, 'x-idPropertyName');
	if (!idPropName) {
		const allOf = g(schema, 'allOf');
		if (allOf) {
			return reduce(allOf, (resultingIdPropName, _, partialSchemaIndex) => {
				if (resultingIdPropName) {
					return resultingIdPropName;
				}
				return findIdPropName(
					resolveSubschema(schema, ['allOf', partialSchemaIndex])
				);
			}, undefined);
		}
	}
	return idPropName;
});

const hasOwnSchemaProperty = function hasOwnSchemaProperty(schema, propertyName) {
	return !!g(schema, ['properties', propertyName]);
};

function assignEntity(normalized, key, entity, obj, schema) {
	if (hasOwnSchemaProperty(schema, key)) {
		normalized[key] = entity;
	}
}

function visitObject(clevel, obj, schema, bag, assocsBag) {
	logIndented(clevel, 'VISITING OBJECT');
	logIndented(clevel, 'OBJ          ', obj);
	logIndented(clevel, 'SCHEMA       ', safeJSONStringify(schema, 1));
	logIndented();
	const assocMap = g(schema, 'x-associationMapping');

	const normalized = {};
	each(obj, (value, key) => {
		const propertySchema = resolveSubschema(schema, ['properties', key]);
		const mappedAssoc = g(assocMap, key);
		const entity = visit( // eslint-disable-line
			clevel + 3,
			obj[key],
			propertySchema,
			bag,
			assocsBag,
			mappedAssoc,
			obj[findIdPropName(schema)],
		);
		assignEntity(normalized, key, entity, obj, schema);
	});
	logIndented();
	logIndented();
	return normalized;
}

function mergeIntoEntity(entityA, entityB, modelName) {
	each(entityB, (value, key) => {
		if (!entityB.hasOwnProperty(key)) {
			return;
		}

		if (!entityA.hasOwnProperty(key) || isEqual(entityA[key], entityB[key])) {
			entityA[key] = entityB[key];
			return;
		}

		console.warn(
			`When merging two ${modelName},
			found unequal data in their "${key}" values.
			Using the earlier value.`,
			entityA[key], entityB[key]
		);
	});
}

function visitEntity(clevel, obj, schema, bag, assocsBag, mappedAssoc, parentId) {
	const modelName = g(schema, 'x-model');
	const assocMap = g(schema, 'x-associationMapping', {});

	logIndented(clevel, 'VISITING ENTITY');
	logIndented(clevel, 'OBJ          ', obj);
	logIndented(clevel, 'MODEL        ', modelName);
	logIndented(clevel, 'SCHEMA       ', safeJSONStringify(schema, 1));
	logIndented(clevel, 'MAPPED ASSOC ', safeJSONStringify(mappedAssoc, 1));
	logIndented(clevel);

	const idPropertyName = findIdPropName(schema);
	const id = g(obj, idPropertyName);
	if (!id) {
		return undefined;
	}

	if (!bag.hasOwnProperty(modelName)) {
		bag[modelName] = {};
	}

	if (!bag[modelName].hasOwnProperty(id)) {
		bag[modelName][id] = {};
	}

	const stored = bag[modelName][id];
	let normalized = visitObject(clevel + 1, obj, schema, bag, assocsBag);
	mergeIntoEntity(stored, normalized, modelName);

	// is it composite entity?
	const allOf = g(schema, 'allOf');
	if (isArray(allOf)) {
		each(allOf, (_, inputComposedSchemaIndex) => {
			const composedSchema = resolveSubschema(schema, ['allOf', inputComposedSchemaIndex]);
			const composedSchemaModelName = g(composedSchema, 'x-model');
			if (composedSchemaModelName) {
				visitEntity(
					clevel + 1,
					obj,
					composedSchema,
					bag,
					assocsBag,
					mappedAssoc,
					parentId
				);
			} else {
				normalized = visitObject(
					clevel + 1,
					obj,
					{
						'x-associationMapping': assocMap,
						'x-idPropertyName': idPropertyName,
						...composedSchema,
					},
					bag,
					assocsBag
				);
				mergeIntoEntity(stored, normalized, modelName);
			}
		});
	}

	if (mappedAssoc) {
		const mappedModelName = g(mappedAssoc, ['model']);
		if (g(mappedAssoc, 'many', false)) {
			mergeWithArraysUnique(assocsBag, { [mappedModelName]: { [id]: { [g(mappedAssoc, ['property'])]: [parentId] } } });
		} else {
			merge(assocsBag, { [mappedModelName]: { [id]: { [g(mappedAssoc, ['property'])]: parentId } } });
		}
	}

	logIndented();
	logIndented();

	return id;
}

function visitArray(clevel, obj, schema, bag, assocsBag, mappedAssoc, parentId) {
	const itemSchema = resolveSubschema(schema, 'items');
	// eslint-disable-next-line no-use-before-define
	return obj.map((item) => visit(clevel + 3, item, itemSchema, bag, assocsBag, mappedAssoc, parentId));
}

/**
 *
 * @param clevel - more or less current recursion level, used only for log indentation
 * @param obj - value to normalize
 * @param inputSchema - schema describing how to normalize obj value
 * @param bag - intermediate result of entity normalization, mutable entity dictionary
 * @param assocsBag - intermediate result of association normalization, mutable association dictionary
 * @param mappedAssoc - description of parent model property to which current value (obj) is connected
 * @param parentId - primary key value of current parent entity
 * @returns {*}
 */
function visit(clevel, obj, inputSchema, bag, assocsBag, mappedAssoc, parentId) {
	logIndented(clevel, 'VISITING VALUE');
	logIndented(clevel, 'OBJ       ', obj);
	if (process.env.DEBUG_LOGGING_ENABLED) {
		logIndented(clevel, 'SCHEMA    ', safeJSONStringify(inputSchema, 1));
		logIndented(clevel, 'PARENT ID ', parentId);
	}
	const schema = resolveSchema(inputSchema);
	if (!isObject(obj) || !isObject(schema)) {
		logIndented(clevel, 'END, PRIMITIVE DETECTED', obj);
		logIndented(clevel, '----');
		logIndented(clevel);
		return obj;
	}
	logIndented();

	const type = g(schema, 'type', 'object');
	const modelName = g(schema, 'x-model');

	if (modelName) {
		// if it has x-model, it is entity schema
		return visitEntity(clevel + 1, obj, schema, bag, assocsBag, mappedAssoc, parentId);
	} else if (type === 'array') {
		// array schema
		return visitArray(clevel + 1, obj, schema, bag, assocsBag, mappedAssoc, parentId);
	} else if (type === 'object') {
		return obj;
	}

	logIndented();
	logIndented();
	// value schema
	return visitObject(clevel + 1, obj, schema, bag, assocsBag, parentId);
}

/**
 * Normalizes value according to json schema
 *
 * @param {Entity | Array<Entity>} obj value to normalize
 * @param {JsonSchema} schema - schema to normalize value by
 * @returns {{entities:NormalizedEntityDictionary, result:EntityId|Array<EntityId>}|*}
 */
export default function normalizeResource(obj: any, schema: JsonSchema): NormalizationResult {
	const bag = {};
	const assocsBag = {};
	logIndented('-----------------------------------------------');
	const result = visit(0, obj, schema, bag, assocsBag);
	logIndented();
	logIndented();
	return {
		result,
		entities: bag,
		associations: assocsBag,
	};
}
