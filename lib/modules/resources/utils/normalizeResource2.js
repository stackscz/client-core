'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _reduce3 = require('lodash/reduce');

var _reduce4 = _interopRequireDefault(_reduce3);

exports.default = normalizeResource2;

var _normalizr = require('normalizr');

var _jsonSchemaToNormalizrSchema = require('./jsonSchemaToNormalizrSchema');

var _jsonSchemaToNormalizrSchema2 = _interopRequireDefault(_jsonSchemaToNormalizrSchema);

var _hash = require('../../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeResource2(resourceSchema, paths, link, data) {
	var dataSchema = (0, _jsonSchemaToNormalizrSchema2.default)(resourceSchema, paths);

	var _normalize = (0, _normalizr.normalize)(data, dataSchema),
	    entities = _normalize.entities,
	    result = _normalize.result;

	var resultEntities = (0, _reduce4.default)(entities, function (acc, resourcesEntities, modelName) {
		return (0, _extends3.default)({}, acc, resourcesEntities);
	}, (0, _defineProperty3.default)({}, (0, _hash2.default)(link), {
		content: result,
		id: (0, _hash2.default)(link),
		link: link
	}));
	return resultEntities;
}