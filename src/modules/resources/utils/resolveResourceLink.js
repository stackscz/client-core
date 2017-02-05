import { get as g, set, reduce, each } from 'lodash';
import invariant from 'invariant';
import URI from 'urijs';
import URITemplate from 'urijs/src/URITemplate'; // eslint-disable-line no-unused-vars
import findResourceSchema from '../utils/findResourceSchema';

export default (apiDescription, link) => {
	const { name, params } = link;
	const paths = g(apiDescription, 'paths', {});
	const matchingLink = reduce(
		paths,
		(result, value, key) => {
			if (result) {
				return result;
			}
			if (g(value, 'x-linkName') === name) {
				return {
					resourceSchema: findResourceSchema(
						{
							...apiDescription,
							link,
						}
					),
					pathTemplate: key,
					parameters: g(value, 'parameters', []),
				};
			}
			return undefined;
		},
		undefined
	);

	if (!matchingLink) {
		return undefined;
	}

	const {
		pathTemplate,
		parameters,
		resourceSchema,
	} = matchingLink;

	const finalParams = {};
	const expandParams = {};
	const queryParams = {};
	try {
		each(parameters, (parameter) => {
			const linkParamName = g(parameter, 'name');
			const linkParamPath = g(parameter, 'x-linkParam');
			const paramValue = g(params, linkParamPath);
			invariant(
				paramValue,
				'link param %s not present for link name %s, params: %s',
				linkParamPath,
				name,
				JSON.stringify(params, null, 2)
			);
			set(finalParams, linkParamPath, paramValue);
			set(expandParams, linkParamName, paramValue);
			if (g(parameter, 'in') === 'query') {
				set(queryParams, linkParamName, paramValue);
			}
		});
	} catch (error) {
		if (error.message.includes('not present for link name')) {
			return undefined;
		}
		throw error;
	}

	const path = `${g(apiDescription, 'basePath')}${URI.expand(pathTemplate, expandParams).toString()}`;
	return {
		name,
		params: finalParams,
		queryParams,
		pathTemplate,
		path,
		resourceSchema,
	};
};
