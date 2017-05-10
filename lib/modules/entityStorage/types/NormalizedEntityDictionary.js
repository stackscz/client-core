'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.NormalizedEntityDictionary = undefined;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _CollectionName = require('./CollectionName');

var _EntityId = require('./EntityId');

var _NormalizedEntity = require('./NormalizedEntity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NormalizedEntityDictionary = exports.NormalizedEntityDictionary = _tcomb2.default.dict(_CollectionName.CollectionName, _tcomb2.default.dict(_EntityId.EntityId, _NormalizedEntity.NormalizedEntity), 'NormalizedEntityDictionary');