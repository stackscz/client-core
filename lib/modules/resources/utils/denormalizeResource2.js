'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = denormalizeResource2;

var _normalizr = require('normalizr');

var _jsonSchemaToNormalizrSchema = require('./jsonSchemaToNormalizrSchema');

var _jsonSchemaToNormalizrSchema2 = _interopRequireDefault(_jsonSchemaToNormalizrSchema);

var _hash = require('../../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function denormalizeResource2(resourceSchema, paths, entityDictionary) {
	var maxLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
	var link = arguments[4];

	var dataSchema = (0, _jsonSchemaToNormalizrSchema2.default)(resourceSchema, paths, link);
	var denormaliedEntities = (0, _normalizr.denormalize)((0, _hash2.default)(link), dataSchema, function (schemaKey, entityId) {
		return entityDictionary[entityId];
	});
	return denormaliedEntities;
} /* eslint-disable no-use-before-define, no-param-reassign */