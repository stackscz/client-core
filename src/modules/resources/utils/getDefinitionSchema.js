import { get as g } from 'lodash';
import resolveSchema from 'client-core/src/modules/resources/utils/resolveSchema';

export default (name, definitions) => {
	const defintion = g(definitions, name);
	return resolveSchema(
		{
			...defintion,
			definitions,
		}
	);
};
