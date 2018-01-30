'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _pull2 = require('lodash/pull');

var _pull3 = _interopRequireDefault(_pull2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _traverse = require('./traverse');

var _traverse2 = _interopRequireDefault(_traverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeReadOnlyPropertiesFromSchema = function removeReadOnlyPropertiesFromSchema(inputSchema) {
	var schemaClone = (0, _cloneDeep3.default)(inputSchema);
	(0, _traverse2.default)(schemaClone).forEach(function (schema) {
		var parentObjectSchemaContext = (0, _get3.default)(this, 'parent.parent');
		var propertyName = (0, _get3.default)(this, 'key');
		var parentRequired = (0, _get3.default)(parentObjectSchemaContext, 'node.required', []);
		if (schema.readOnly && parentObjectSchemaContext && parentObjectSchemaContext.node.type === 'object') {
			delete parentObjectSchemaContext.node.properties[propertyName];
			parentObjectSchemaContext.node.required = (0, _pull3.default)(parentRequired, propertyName);
		}
	});
	return schemaClone;
};

exports.default = removeReadOnlyPropertiesFromSchema;