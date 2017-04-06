/**
 * Receive normalized entities
 *
 * @example
 *
 *    receiveEntities({
 *      normalizedEntities: {
 * 			posts: {
 * 				1: {
 * 					title: 'Title 1'
 *		 		},
 * 				2: {
 * 					title: 'Title 2'
 *	 			},
 *	 		},
 *	 		tags: {
 * 				5: {
 * 					title: 'Tag 5'
 *	 			}
 *		 	}
 * 		},
 *      validAtTime: "2016-07-14T00:00:00.000+02:00"
 *    })
 *
 * @param {object} normalizedEntities
 * @param {string} validAtTime
 *
 * @type {object}
 */
export const RECEIVE_ENTITIES = 'client-core/src/entityStorage/RECEIVE_ENTITIES';
export function receiveEntities({ refs, normalizedEntities, validAtTime }) {
	return { type: RECEIVE_ENTITIES, payload: { refs, normalizedEntities, validAtTime } };
}

/**
 * Remove entity from storage
 */
export const FORGET_ENTITY = 'client-core/src/entityStorage/FORGET_ENTITY';
export function forgetEntity({ modelName, entityId }) {
	return { type: FORGET_ENTITY, payload: { modelName, entityId } };
}
export const FORGET_ENTITIES = 'client-core/src/entityStorage/FORGET_ENTITIES';
export function forgetEntities({ modelName, ids }) {
	return { type: FORGET_ENTITIES, payload: { modelName, ids } };
}
