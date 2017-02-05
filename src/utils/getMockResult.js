import _ from 'lodash';
import fakerDesc from 'public/faker.json';

export default function getMockResult(apiDescription, mockResults, config) {
	const fakedApiDescription = _.merge({}, apiDescription, fakerDesc);

	const { definitions } = fakedApiDescription;
	const { modelName, operationName, operationId, params } = config;
	const operationMocks = _.get(mockResults, [operationId || operationName]);
	let mockResultFactory;
	if (_.isFunction(operationMocks)) {
		mockResultFactory = operationMocks;
	} else {
		mockResultFactory = _.get(operationMocks, modelName);
	}
	if (_.isFunction(mockResultFactory)) {
		const mockResult = mockResultFactory(params, definitions);
		console.log('MOCK RESULT', config, mockResult);
		return mockResult;
	}
	return undefined;
}
