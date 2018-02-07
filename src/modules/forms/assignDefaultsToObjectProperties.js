import { isPlainObject, reduce, mapValues } from 'lodash';
import dot from 'dot-object';

const assignDefaultsToObjectProperties = (data, schema, registeredFields) => {

	const dotData = dot.dot(JSON.parse(JSON.stringify(data)));
	const dotTemplate = mapValues(registeredFields, () => (undefined));

	return dot.object(
		Object.assign(
			{},
			dotTemplate,
			dotData,
		),
	);
};

export default assignDefaultsToObjectProperties;
