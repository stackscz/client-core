import { get as g, set, reduce, each, size } from 'lodash';
import { INTERNAL_ID_PROPERTY_NAME } from 'modules/resources/constants';

export default (link, resources) => {
	const { name: linkName, params: linkParams } = link;
	let parameters = g(resources, [linkName, 'parameters'], [])

	const finalParams = {};
	each(parameters, (parameter) => {
		const linkParamPath = g(parameter, 'x-linkParam');
		const paramValue = g(linkParams, linkParamPath);
		if (paramValue) {
			set(finalParams, linkParamPath, `${paramValue}`);
		}
	});

	const result = {
		name: linkName,
	};
	if (size(finalParams)) {
		result.params = finalParams;
	}
	return result;
};
