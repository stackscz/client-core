export const REGISTER_FIELD_SCHEMA = 'client-core/forms/REGISTER_FIELD_SCHEMA';

export function registerFieldSchema({ form, name, schema }) {
	return { type: REGISTER_FIELD_SCHEMA, payload: { form, name, schema } };
}


export const UNREGISTER_FIELD_SCHEMA = 'client-core/forms/UNREGISTER_FIELD_SCHEMA';

export function unregisterFieldSchema({ form, name }) {
	return { type: UNREGISTER_FIELD_SCHEMA, payload: { form, name } };
}
