import { omit } from 'lodash';
import getWriteOnlyProperties from 'client-core/src/modules/resources/utils/getWriteOnlyProperties';

export default function stripWriteOnlyProperties(entity, schema) {
	return omit(entity, getWriteOnlyProperties(schema));
}
