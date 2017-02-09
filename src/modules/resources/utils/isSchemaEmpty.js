import { get as g } from 'lodash';

const isSchemaEmpty = (schema) => {
	return !schema || (g(schema, 'definitions') && Object.keys(schema).length === 1);
};

export default isSchemaEmpty;
