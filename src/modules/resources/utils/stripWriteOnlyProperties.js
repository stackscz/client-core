import { omit } from 'lodash';
import getWriteOnlyProperties from 'modules/resources/utils/getWriteOnlyProperties';

export default function stripWriteOnlyProperties(entity, schema) {
	return omit(entity, getWriteOnlyProperties(schema));
}
