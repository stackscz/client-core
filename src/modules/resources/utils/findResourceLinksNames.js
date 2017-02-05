import { get as g, reduce } from 'lodash';

const findResourceLinksNames = (modelSchema) => {
	const schemaLinks = g(modelSchema, 'x-links', {});
	const childSchemas = g(modelSchema, 'allOf', []);
	return {
		...schemaLinks,
		...reduce(childSchemas, (result, childSchema) => {
			return {
				...result,
				...findResourceLinksNames(childSchema),
			};
		}, {}),
	};
};

export default findResourceLinksNames;
