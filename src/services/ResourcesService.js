import type { ResourceLink } from 'modules/resources/types/ResourceLink';
import { get as g, isFunction, upperCase } from 'lodash';
import axios from 'axios';
import resolveResourceLink from 'modules/resources/utils/resolveResourceLink';

const mockApiCall = (apiDescription,
	{
		method,
		data,
		linkName,
		linkParams,
		resourceSchema,
		definitions,
	} = {},) => {
	const mockResources = g(apiDescription, 'mockResources');
	if (!mockResources) {
		return undefined;
	}
	const mockResource = g(mockResources, linkName);
	if (!isFunction(mockResource)) {
		return undefined;
	}
	return Promise.resolve(
		mockResource(
			{
				method,
				data,
				linkName,
				linkParams,
				resourceSchema,
				definitions,
			}
		)
	);
};

const successResponseHandlerFactory = ({ method, resolvedLink }) => (response) => {
	const { name, params, url, queryParams, resourceSchema } = resolvedLink;
	console.log(`Mock request finished loading: ${method} ${JSON.stringify(url)}`);
	return g(response, 'data');
};

const errorResponseHandlerFactory = (messageFactory) => (error) => {
	// CORS errors are opaque - https://github.com/mzabriskie/axios/issues/838
	const errorCode = g(error, 'response.status', 5000);
	const responseData = g(error, 'response.data');
	const requestMethod = upperCase(g(error, 'config.method'));
	throw {
		code: errorCode,
		data: responseData,
		message: messageFactory ? messageFactory({ errorCode, responseData }) : 'Request Failed',
		requestMethod,
	}
};

const service = {
	getResource: ({ link, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, url, queryParams, resourceSchema } = resolvedLink;

		let apiCall = mockApiCall(
			apiDescription,
			{
				method: 'GET',
				linkName: name,
				linkParams: params,
				params,
				resourceSchema,
				definitions: g(apiDescription, 'definitions'),
			}
		);
		if (!apiCall) {
			apiCall = axios.get(url, { params: queryParams });
		}

		return apiCall
			.then(
				successResponseHandlerFactory({ resolvedLink, method: 'GET' }),
			)
			.catch(
				errorResponseHandlerFactory(
					({ errorCode }) => `${errorCode}: GET resource failed`
				)
			);
	},
	postResource: ({ link, data, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, queryParams, url, resourceSchema } = resolvedLink;

		let apiCall = mockApiCall(
			apiDescription,
			{
				method: 'POST',
				data,
				linkName: name,
				linkParams: params,
				params,
				resourceSchema,
				definitions: g(apiDescription, 'definitions'),
			}
		);
		if (!apiCall) {
			apiCall = axios.post(
				url,
				data,
				{
					params: queryParams,
				}
			);
		}

		return apiCall
			.then(
				successResponseHandlerFactory({ resolvedLink, method: 'POST' }),
			)
			.catch(
				errorResponseHandlerFactory(
					({ errorCode }) => `${errorCode}: POST resource failed`
				)
			);
	},
	putResource: ({ link, data, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, queryParams, url, resourceSchema } = resolvedLink;

		let apiCall = mockApiCall(
			apiDescription,
			{
				method: 'PUT',
				data,
				linkName: name,
				linkParams: params,
				resourceSchema,
				definitions: g(apiDescription, 'definitions'),
			}
		);
		if (!apiCall) {
			apiCall = axios.put(
				url,
				data,
				{
					params: queryParams,
				}
			);
		}

		return apiCall
			.then(
				successResponseHandlerFactory({ resolvedLink, method: 'PUT' }),
			)
			.catch(
				errorResponseHandlerFactory(
					({ errorCode }) => `${errorCode}: PUT resource failed`
				)
			);
	},
	deleteResource: ({ link, data, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, queryParams, url, resourceSchema } = resolvedLink;

		let apiCall = mockApiCall(
			apiDescription,
			{
				method: 'DELETE',
				data,
				linkName: name,
				linkParams: params,
				resourceSchema,
				definitions: g(apiDescription, 'definitions'),
			}
		);
		if (!apiCall) {
			apiCall = axios.delete(
				url,
				{
					params: queryParams,
				}
			);
		}
		return apiCall
			.then(
				successResponseHandlerFactory({ resolvedLink, method: 'DELETE' }),
			)
			.catch(
			errorResponseHandlerFactory(
				({ errorCode }) => `${errorCode}: DELETE resource failed`
			)
		);
	},
	resolveResourceLink: (link: ResourceLink, apiDescription) => {
		return resolveResourceLink(apiDescription, link);
	},
};

export default service;
