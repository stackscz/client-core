import { get as g } from 'lodash';
import resolveSchema from 'modules/resources/utils/resolveSchema';

export default (name, definitions) => {
	const defintion = g(definitions, name);
	if (!defintion) {
		return undefined;
	}
	return resolveSchema(
		{
			...defintion,
			definitions,
		}
	);
};
