import _ from 'lodash';
import getTargetUrl from './getTargetUrl';
import axios from 'axios';
import matchModelOperation from './matchModelOperation';
import { Validator as JSONSchemaValidator } from 'jsonschema';

axios.defaults.headers['Content-Type'] = 'application/json';

function getEndpointUrl(apiContext, apiDescription, apiEndpointPath) {
	return getTargetUrl(apiContext, `${apiDescription.basePath}${apiEndpointPath}`);
}

import { EntityIndexFilter } from 'client-core/src/types/EntityIndexFilter';

type ApiCallConfig = {
	operationName: string,
	modelName?: string,
	params?: {
		filter?: EntityIndexFilter,
		headers?: {
			[key: string]: string | Array<string>
		},
		data?: any,
	},
	onProgress?: Function
}

export default function apiCall(apiDescription,
								config:ApiCallConfig,
								apiContext,
								authContext,
								mockResults = {}) {
	return new Promise((resolve, reject) => {
		// if (process.env.NODE_ENV !== 'production') {
		// 	const mockResult = require('./getMockResult').default(apiDescription, mockResults, config);
		// 	if (mockResult) {
		// 		setTimeout(() => {
		// 			resolve(mockResult);
		// 		}, 400);
		// 		return;
		// 	}
		// }

		const {
			modelName,
			operationName,
			params,
			cancelToken,
		} = config;
		const operationDescription = matchModelOperation(
			modelName,
			operationName,
			params,
			apiDescription.paths
		);
		if (!operationDescription) {
			reject({
				modelName,
				operationName,
				params,
				code: 5001,
				message: 'Unknown operation',
			});
			return;
		}

		const {
			operationPath, // eslint-disable-line
			operationExpandedPath,
			operationQueryParams,
			operationMethod,
			operation,
		} = operationDescription;

		const headers = _.get(params, 'headers', {});
		const onProgress = _.get(config, 'onProgress', () => {});
		const axiosParams = {
			headers,
			params: operationQueryParams,
			progress: onProgress,
			onUploadProgress: onProgress,
			onDownloadProgress: onProgress,
		};
		if (cancelToken) {
			axiosParams.cancelToken = cancelToken;
		}
		const httpCallParams = [
			axiosParams,
		];
		const bodyParam = _.get(params, 'data', {});
		if (bodyParam) {
			httpCallParams.unshift(bodyParam);
		}

		axios(
			{
				method: operationMethod,
				url: getEndpointUrl(
					apiContext,
					apiDescription,
					operationExpandedPath
				),
				data: bodyParam,
				...axiosParams,
			},
		)
			.then((response) => {
				const status = _.get(response, 'status');
				const responseType = _.get(operation, ['responses', status]);
				if (!responseType) {
					// TODO proper error
					reject({
						code: 5002,
						message: 'Unknown response',
					});
					return;
				}

				let errors;
				const bodySchema = _.get(responseType, 'schema');
				if (bodySchema) {
					const v = new JSONSchemaValidator;
					const s = {
						...bodySchema,
						definitions: apiDescription.definitions,
					};
					v.addSchema(s, 'responseBodySchema');
					errors = v.validate(response.data, s).errors;

					if (errors.length > 0) {
						let bodyValidationError = {
							code: 5005,
							message: 'Invalid response format',
						};
						if (process.env.NODE_ENV === 'development') {
							bodyValidationError = {
								...bodyValidationError,
								data: response.data,
								expectedSchema: s,
								validationErrors: errors,
							};
						}
						reject(bodyValidationError);
						return;
					}
				}

				let result = {
					code: status,
					message: _.get(responseType, 'x-message', response.statusText),
					data: response.data,
				};
				switch (operationName) {
					case 'DETAIL':
						break;
					case 'INDEX':
						result = {
							...result,
							existingCount: _.get(response.headers, _.get(operation, 'x-total-count-header'), 0),
						};
						break;
					case 'CREATE':
					case 'UPDATE':
						break;
					default:
						break;
				}
				resolve(result);
			})
			.catch((originalResponse) => {
				const response = _.get(originalResponse, 'response');
				const status = _.get(response, 'status');
				const responseType = _.get(operation, ['responses', status]);
				if (!responseType) {
					// TODO proper error
					reject({
						code: 5003,
						message: 'Unknown error',
						originalResponse: response,
					});
					return;
				}
				let result = {
					code: response.status,
					message: _.get(responseType, 'x-message', response.statusText),
					data: response.data,
				};
				switch (operationName) {
					case 'CREATE':
					case 'UPDATE':
						result = {
							...result,
							validationResults: response.data,
						};
						break;
					default:
						break;
				}
				if (process.env.NODE_ENV === 'development') {
					result = {
						...result,
						originalResponse: JSON.parse(JSON.stringify(originalResponse)),
					};
				}
				reject(result);
			});
	});
}
