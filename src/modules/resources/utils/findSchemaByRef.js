import { get as g } from 'lodash';

export default (ref, schema) => {
	const path = ref.replace(/^#\//, '').replace('/', '.');
	return g(schema, path);
};
