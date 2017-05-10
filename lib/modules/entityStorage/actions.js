'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receiveEntities = receiveEntities;
exports.forgetEntity = forgetEntity;
exports.forgetEntities = forgetEntities;
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
var RECEIVE_ENTITIES = exports.RECEIVE_ENTITIES = 'client-core/entityStorage/RECEIVE_ENTITIES';
function receiveEntities(_ref) {
  var normalizedEntities = _ref.normalizedEntities,
      validAtTime = _ref.validAtTime;

  return { type: RECEIVE_ENTITIES, payload: { normalizedEntities: normalizedEntities, validAtTime: validAtTime } };
}

/**
 * Remove entity from storage
 */
var FORGET_ENTITY = exports.FORGET_ENTITY = 'client-core/entityStorage/FORGET_ENTITY';
function forgetEntity(_ref2) {
  var modelName = _ref2.modelName,
      entityId = _ref2.entityId;

  return { type: FORGET_ENTITY, payload: { modelName: modelName, entityId: entityId } };
}
var FORGET_ENTITIES = exports.FORGET_ENTITIES = 'client-core/entityStorage/FORGET_ENTITIES';
function forgetEntities(_ref3) {
  var modelName = _ref3.modelName,
      ids = _ref3.ids;

  return { type: FORGET_ENTITIES, payload: { modelName: modelName, ids: ids } };
}