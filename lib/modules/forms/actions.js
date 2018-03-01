'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.registerFieldSchema = registerFieldSchema;
exports.unregisterFieldSchema = unregisterFieldSchema;
var REGISTER_FIELD_SCHEMA = exports.REGISTER_FIELD_SCHEMA = 'client-core/forms/REGISTER_FIELD_SCHEMA';

function registerFieldSchema(_ref) {
	var form = _ref.form,
	    name = _ref.name,
	    schema = _ref.schema;

	return { type: REGISTER_FIELD_SCHEMA, payload: { form: form, name: name, schema: schema } };
}

var UNREGISTER_FIELD_SCHEMA = exports.UNREGISTER_FIELD_SCHEMA = 'client-core/forms/UNREGISTER_FIELD_SCHEMA';

function unregisterFieldSchema(_ref2) {
	var form = _ref2.form,
	    name = _ref2.name;

	return { type: UNREGISTER_FIELD_SCHEMA, payload: { form: form, name: name } };
}