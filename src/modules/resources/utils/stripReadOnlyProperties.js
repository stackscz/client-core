import { omit } from 'lodash';
import getReadOnlyProperties from 'client-core/src/modules/resources/utils/getReadOnlyProperties';

export default function stripReadOnlyProperties(entity, schema) {
	return omit(entity, getReadOnlyProperties(schema));
}
