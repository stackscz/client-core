'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _hash = require('../../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _normalizeLink2 = require('../utils/normalizeLink2');

var _normalizeLink3 = _interopRequireDefault(_normalizeLink2);

var _normalizr = require('normalizr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generalResourceSchema = new _normalizr.schema.Entity('collection');

var ResourceSchema = function () {
	function ResourceSchema(key, schema, resource) {
		(0, _classCallCheck3.default)(this, ResourceSchema);

		this._key = key;
		this.schema = schema;
		this._resource = resource;
	}

	(0, _createClass3.default)(ResourceSchema, [{
		key: 'getLink',
		value: function getLink(input, parent, key) {
			var resource = this._resource;
			var resourceLinkName = (0, _get3.default)(resource, 'x-linkName');

			var link = (0, _normalizeLink3.default)({
				name: resourceLinkName,
				params: (0, _extends3.default)({}, input, { parent: parent })
			}, (0, _defineProperty3.default)({}, resourceLinkName, resource));
			return link;
		}
	}, {
		key: 'getId',
		value: function getId(input, parent, key) {
			var link = this.getLink(input, parent, key);
			return '' + (0, _hash2.default)(link);
		}
	}, {
		key: 'merge',
		value: function merge(entityA, entityB) {
			return entityA;
		}
	}, {
		key: 'normalize',
		value: function normalize(input, parent, key, visit, addEntity) {
			var visitedEntity = visit(input, parent, key, this.schema, addEntity);
			var id = this.getId(input, parent, key);
			addEntity(this, { content: visitedEntity, id: id, link: this.getLink(input, parent, key) }, input, parent, key);
			return id;
		}
	}, {
		key: 'denormalize',
		value: function denormalize(entity, unvisit) {
			var c = entity;
			// if (this._key !== this.schema._key) {
			c = (0, _get3.default)(unvisit(entity, generalResourceSchema), 'content');
			// }
			return unvisit(c, this.schema);
		}
	}, {
		key: 'key',
		get: function get() {
			return this._key;
		}
	}]);
	return ResourceSchema;
}();

exports.default = ResourceSchema;