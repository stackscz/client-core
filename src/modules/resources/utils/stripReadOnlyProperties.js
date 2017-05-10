import { omit } from 'lodash';
import getReadOnlyProperties from 'modules/resources/utils/getReadOnlyProperties';

export default function stripReadOnlyProperties(entity, schema) {
	return omit(entity, getReadOnlyProperties(schema));
}
