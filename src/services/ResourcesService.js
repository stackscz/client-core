import type { ResourceLink } from 'client-core/src/modules/resources/types/ResourceLink';
import { get as g } from 'lodash';
import axios from 'axios';
import resolveSubschema from 'client-core/src/modules/resources/utils/resolveSubschema';
import resolveResourceLink from 'client-core/src/modules/resources/utils/resolveResourceLink';
import validateResource from 'client-core/src/modules/resources/utils/validateResource';

let createWrappedPromise = (cb) => new Promise(
	(resolve, reject) => {
		try {
			cb(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}
);
if (process.env.DELAY_RESOURCE_SERVICE_RESPONSE) {
	createWrappedPromise = (cb) => new Promise((resolve, reject) => setTimeout(() => {
		try {
			cb(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}, 1000));
}

const service = {
	getResource: ({ link, apiDescription }) => createWrappedPromise((resolve, reject) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);
		const { name, params, path, queryParams, resourceSchema } = resolvedLink;

		if (process.env.NODE_ENV !== 'production') {
			const getMockResource = g(apiDescription, 'getMockResource', () => {
			});
			const mockResource = getMockResource(
				{
					method: 'GET',
					linkName: name,
					linkParams: params,
					params,
					resourceSchema,
					definitions: g(apiDescription, 'definitions'),
				}
			);

			if (mockResource) {
				try {
					validateResource(mockResource, resourceSchema);
					resolve(mockResource);
				} catch (error) {
					reject(error);
				}
				return;
			}
		}

		axios.get(
			path,
			{
				params: queryParams,
			}
		).then(
			(response) => {
				const responseData = g(response, 'data');
				try {
					validateResource(responseData, resourceSchema);
				} catch (error) {
					reject(error);
				}
				resolve(responseData);
			}
		).catch((errorResponse) => {
			const response = errorResponse.response;
			reject({
				code: response.status || 5000,
				data: response.data || {},
				message: `${response.status}: Get resource failed`,
			});
		});
	}),
	postResource: ({ link, data, apiDescription }) => createWrappedPromise((resolve, reject) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);

		const { name, params, queryParams, path, resourceSchema } = resolvedLink;

		const finalResourceSchema = resourceSchema.items ? resolveSubschema(resourceSchema, 'items') : resourceSchema;

		if (process.env.NODE_ENV !== 'production') {
			const getMockResource = g(apiDescription, 'getMockResource', () => {
			});
			let mockResource;
			try {
				mockResource = getMockResource(
					{
						method: 'POST',
						data,
						linkName: name,
						linkParams: params,
						resourceSchema,
						definitions: g(apiDescription, 'definitions'),
					}
				);
			} catch (error) {
				reject(error);
				return;
			}

			if (mockResource) {
				try {
					validateResource(mockResource, finalResourceSchema);
					resolve(mockResource);
				} catch (error) {
					reject(error);
				}
				return;
			}
		}

		axios.post(
			path,
			data,
			{
				params: queryParams,
			}
		).then(
			(response) => {
				const responseData = g(response, 'data');
				try {
					validateResource(responseData, finalResourceSchema);
				} catch (error) {
					reject(error);
				}
				resolve(responseData);
			}
		).catch((errorResponse) => {
			const response = errorResponse.response;
			reject({
				code: response.status || 5000,
				data: response.data || {},
				message: `${response.status}: Post resource failed`,
			});
		});
	}),
	putResource: ({ link, data, apiDescription }) => createWrappedPromise((resolve, reject) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);

		const { name, params, queryParams, path, resourceSchema } = resolvedLink;

		if (process.env.NODE_ENV !== 'production') {
			const getMockResource = g(apiDescription, 'getMockResource', () => {
			});
			const mockResource = getMockResource(
				{
					method: 'PUT',
					data,
					linkName: name,
					linkParams: params,
					resourceSchema,
					definitions: g(apiDescription, 'definitions'),
				}
			);

			if (mockResource) {
				try {
					validateResource(mockResource, resourceSchema);
					resolve(mockResource);
				} catch (error) {
					reject(error);
				}
				return;
			}
		}

		axios.put(
			path,
			data,
			{
				params: queryParams,
			}
		).then((response) => {
			const responseData = g(response, 'data');
			try {
				validateResource(responseData, resourceSchema);
			} catch (error) {
				reject(error);
			}
			resolve(responseData);
		}).catch((errorResponse) => {
			const response = errorResponse.response;
			reject({
				code: response.status || 5000,
				data: response.data || {},
				message: `${response.status}: Put resource failed`,
			});
		});
	}),
	deleteResource: ({ link, data, apiDescription }) => createWrappedPromise((resolve, reject) => {
		const resolvedLink = resolveResourceLink(apiDescription, link);

		const { name, params, queryParams, path, resourceSchema } = resolvedLink;

		if (process.env.NODE_ENV !== 'production') {
			const getMockResource = g(apiDescription, 'getMockResource', () => {
			});
			const mockResource = getMockResource(
				{
					method: 'DELETE',
					data,
					linkName: name,
					linkParams: params,
					resourceSchema,
					definitions: g(apiDescription, 'definitions'),
				}
			);

			if (mockResource) {
				try {
					validateResource(mockResource, resourceSchema);
					resolve(mockResource);
				} catch (error) {
					reject(error);
				}
				return;
			}
		}

		axios.delete(
			path,
			{
				params: queryParams,
			}
		).then(
			resolve
		).catch((errorResponse) => {
			const response = errorResponse.response;
			reject({
				code: response.status || 5000,
				data: response.data || {},
				message: 'Delete resource failed',
			});
		});
	}),
	resolveResourceLink: (link: ResourceLink, apiDescription) => {
		return resolveResourceLink(apiDescription, link);
	},
};

export default service;
