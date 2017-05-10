import { get as g, reduce } from 'lodash';
import resolveSchema from 'modules/resources/utils/resolveSchema';
import resolveSubschema from 'modules/resources/utils/resolveSubschema';

const findRelationLinkName = (inputModelSchema, rel) => {
	const modelSchema = resolveSchema(inputModelSchema);
	const matchingSchemaLink = g(modelSchema, ['x-links', rel]);
	if (matchingSchemaLink) {
		return matchingSchemaLink;
	}
	const childSchemas = g(modelSchema, 'allOf', []);
	const matchingSubschemaLink = reduce(childSchemas, (result, _, childSchemaIndex) => {
		if (result) {
			return result;
		}
		return findRelationLinkName(resolveSubschema(modelSchema, ['allOf', childSchemaIndex]), rel);
	}, undefined);
	if (rel === 'self' && !matchingSubschemaLink) {
		return g(modelSchema, 'x-model');
	}
	return matchingSubschemaLink;
};

export default findRelationLinkName;
