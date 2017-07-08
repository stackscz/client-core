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

const errorResponseHandlerFactory = (messageFactory) => (error) => {
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
		const { name, params, path, queryParams, resourceSchema } = resolvedLink;

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
			apiCall = axios.get(path, { params: queryParams });
		}

		return apiCall
			.then(
				(response) => g(response, 'data'),
			)
			.catch(
				errorResponseHandlerFactory(
					({ errorCode }) => `${errorCode}: GET resource failed`
				)
			);
	},
	postResource: ({ link, data, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, queryParams, path, resourceSchema } = resolvedLink;

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
				path,
				data,
				{
					params: queryParams,
				}
			);
		}

		return apiCall
			.then(
				(response) => g(response, 'data'),
			)
			.catch(
				errorResponseHandlerFactory(
					({ errorCode }) => `${errorCode}: POST resource failed`
				)
			);
	},
	putResource: ({ link, data, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, queryParams, path, resourceSchema } = resolvedLink;

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
				path,
				data,
				{
					params: queryParams,
				}
			);
		}

		return apiCall
			.then(
				(response) => g(response, 'data'),
			)
			.catch(
				errorResponseHandlerFactory(
					({ errorCode }) => `${errorCode}: PUT resource failed`
				)
			);
	},
	deleteResource: ({ link, data, apiDescription }) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, queryParams, path, resourceSchema } = resolvedLink;

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
				path,
				{
					params: queryParams,
				}
			);
		}
		return apiCall.catch(
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
