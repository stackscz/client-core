import { get as g, isFunction, map } from 'lodash';
import jsf from 'json-schema-faker';

const mockResourceFactories = {
	exampleMockResource: ({ linkParams: { id, profilingId }, data, method, resourceSchema, definitions }) => {
		if (method === 'GET') {
			return map(
				jsf(
					{
						...resourceSchema,
						items: {
							...resourceSchema.items,
							required: [
								...resourceSchema.items.required,
								'author',
							],
						},
						definitions,
					}
				),
				(comment) => (
					{
						...comment,
						profilingId,
						profilingVersionId: id,
					}
				)
			);
		} else if (method === 'POST') {
			return {
				...jsf(
					{
						...resourceSchema.items,
						required: [
							...resourceSchema,
							'author',
						],
						definitions,
					}
				),
				...data,
			};
		}
		return undefined;
	},
};

export default ({
	method,
	data,
	linkName,
	linkParams,
	resourceSchema,
	definitions,
} = {}) => {
	const factory = g(mockResourceFactories, linkName);
	if (!isFunction(factory)) {
		return undefined;
	}
	return factory(
		{
			method,
			data,
			linkName,
			linkParams,
			resourceSchema,
			definitions,
		}
	);
};
