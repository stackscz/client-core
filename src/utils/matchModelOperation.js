import _ from 'lodash';
import URI from 'urijs';
import URITemplate from 'urijs/src/URITemplate'; // eslint-disable-line

export default function matchModelOperation(modelName, operationName, params, paths) {
	const filterParams = _.get(params, 'filter', {});
	const bodyParam = _.get(params, 'data');
	let matchingOpPath;
	let matchingOpMethod;
	let matchingOpExpandedPath;
	let matchingOpQueryParams;
	_.each(paths, (methods, path) => {
		_.each(methods, (operation, method) => {
			const opModelName = _.get(operation, 'x-model');
			const opName = _.get(operation, 'x-operation');
			const opId = _.get(operation, 'operationId');

			if (
				(modelName === opModelName && operationName === opName) ||
				(!modelName && operationName === opId)
			) {
				const pathParamsMap = {};
				const matchesPathParams = _.reduce(operation.parameters, (result, parameter) => {
					const paramName = parameter.name;
					const paramInPath = parameter.in === 'path';
					const paramFilterPropertyPath = _.get(parameter, 'x-filter-property');

					if (paramInPath && !paramFilterPropertyPath) {
						return false;
					} else if (paramInPath) {
						const paramValue = _.get(filterParams, paramFilterPropertyPath);
						if (_.isUndefined(paramValue)) {
							return false;
						}
						pathParamsMap[paramName] = paramValue;
					}

					return result;
				}, true);

				const queryParamsMap = {};
				const matchesQueryParams = _.reduce(operation.parameters, (result, parameter) => {
					const paramName = parameter.name;
					const paramInQuery = parameter.in === 'query';
					const paramFilterPropertyPath = _.get(parameter, 'x-filter-property');

					if (paramInQuery && !paramFilterPropertyPath) {
						return false;
					} else if (paramInQuery) {
						const paramValue = _.get(filterParams, paramFilterPropertyPath);
						if (!_.isUndefined(paramValue)) {
							queryParamsMap[paramName] = paramValue;
						}
					}

					return result;
				}, true);


				const bodyParamsCount = _.reduce(
					operation.parameters,
					(result, parameter) => (parameter.in === 'body' ? result + 1 : result),
					0
				);
				const formDataParamsCount = _.reduce(
					operation.parameters,
					(result, parameter) => (parameter.in === 'formData' ? result + 1 : result),
					0
				);
				const matchesBodyParam =
					formDataParamsCount ||
					(bodyParamsCount === 1 && bodyParam) ||
					(!bodyParamsCount && !bodyParam);

				if (matchesPathParams && matchesQueryParams && matchesBodyParam) {
					matchingOpPath = path;
					matchingOpMethod = method;
					matchingOpExpandedPath = URI.expand(
						matchingOpPath,
						pathParamsMap
					).toString();
					matchingOpQueryParams = queryParamsMap;

					// const querystring = qs.stringify(queryParamsMap, { encode: false });
					// if (querystring) {
					// 	matchingOpExpandedPath += `?${querystring}`;
					// 	debugger;
					// }
					return false;
				}
			}
			if (matchingOpPath) {
				return false;
			}
			return true;
		});
	});

	if (matchingOpPath) {
		const matchingOp = _.get(paths, [matchingOpPath, matchingOpMethod]);
		return {
			operationPath: matchingOpPath,
			operationExpandedPath: matchingOpExpandedPath,
			operationQueryParams: matchingOpQueryParams,
			operationMethod: matchingOpMethod,
			operation: matchingOp,
		};
	}
	return null;
}
