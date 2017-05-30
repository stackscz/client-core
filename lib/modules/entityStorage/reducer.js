'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _createReducer;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _hash = require('../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _createReducer2 = require('../../utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _CollectionName = require('./types/CollectionName');

var _modulesEntityStorageTypesCollectionName = _interopRequireWildcard(_CollectionName);

var _EntityId = require('./types/EntityId');

var _modulesEntityStorageTypesEntityId = _interopRequireWildcard(_EntityId);

var _NormalizedEntityDictionary = require('./types/NormalizedEntityDictionary');

var _modulesEntityStorageTypesNormalizedEntityDictionary = _interopRequireWildcard(_NormalizedEntityDictionary);

var _actions = require('./actions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CollectionName = _modulesEntityStorageTypesCollectionName.CollectionName || _tcomb2.default.Any;
var EntityId = _modulesEntityStorageTypesEntityId.EntityId || _tcomb2.default.Any;
var NormalizedEntityDictionary = _modulesEntityStorageTypesNormalizedEntityDictionary.NormalizedEntityDictionary || _tcomb2.default.Any;
exports.default = (0, _createReducer3.default)(_tcomb2.default.struct({
	entities: _tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.Any)
}), _seamlessImmutable2.default.from({
	entities: {}
}), (_createReducer = {}, (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_ENTITIES, [_tcomb2.default.struct({
	normalizedEntities: _tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.Any)
}), function (state, action) {
	var normalizedEntities = action.payload.normalizedEntities;

	return state.set('entities', state.entities.merge(normalizedEntities, { deep: true }));
}]), (0, _defineProperty3.default)(_createReducer, _actions.FORGET_ENTITY, [_tcomb2.default.struct({
	modelName: CollectionName,
	entityId: EntityId
}), function (state, action) {
	var _action$payload = action.payload,
	    modelName = _action$payload.modelName,
	    entityId = _action$payload.entityId;

	var newState = state;
	(0, _each3.default)(['entities', 'statuses', 'errors'], function (sliceName) {
		if ((0, _get3.default)(newState, [sliceName, modelName])) {
			newState = newState.updateIn([sliceName, modelName], function (selectedCollectionName, entityIdToForget) {
				if (selectedCollectionName) {
					return selectedCollectionName.without('' + entityIdToForget);
				}
				return selectedCollectionName;
			}, entityId);
		}
	});
	var invalidRefHashes = (0, _reduce3.default)(state.refs[modelName], function (invalidRefs, currentRef) {
		if (currentRef.entityId === entityId) {
			return [].concat((0, _toConsumableArray3.default)(invalidRefs), [(0, _hash2.default)(currentRef.where)]);
		}
		return invalidRefs;
	}, []);
	var modelRefs = (0, _get3.default)(newState, ['refs', modelName]);
	if (modelRefs) {
		newState = newState.setIn(['refs', modelName], modelRefs ? modelRefs.without(invalidRefHashes) : modelRefs);
	}
	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.FORGET_ENTITIES, [_tcomb2.default.struct({
	modelName: CollectionName,
	ids: _tcomb2.default.Array
}), function (state, action) {
	var _action$payload2 = action.payload,
	    modelName = _action$payload2.modelName,
	    ids = _action$payload2.ids;


	var newState = state;
	(0, _each3.default)(['entities', 'statuses', 'errors'], function (sliceName) {
		if ((0, _get3.default)(newState, [sliceName, modelName])) {
			newState = newState.updateIn([sliceName, modelName], function (selectedCollectionName, entityIdToForget) {
				if (selectedCollectionName) {
					return selectedCollectionName.without(entityIdToForget);
				}
				return selectedCollectionName;
			}, ids);
		}
	});

	var invalidRefHashes = (0, _reduce3.default)(state.refs[modelName], function (invalidRefs, currentRef) {
		if (ids.indexOf(currentRef.entityId) !== -1) {
			return [].concat((0, _toConsumableArray3.default)(invalidRefs), [(0, _hash2.default)(currentRef.where)]);
		}
		return invalidRefs;
	}, []);

	var modelRefs = (0, _get3.default)(newState, ['refs', modelName]);

	if (modelRefs) {
		newState = newState.setIn(['refs', modelName], modelRefs ? modelRefs.without(invalidRefHashes) : modelRefs);
	}

	return newState;
}]), _createReducer), 'entityStorage');