import { isError } from 'lodash';
import typeInvariant from 'client-core/src/utils/typeInvariant';

export default function apiServiceResultTypeInvariant(result, type) {
	if (isError(result)) {
		throw result;
	}
	typeInvariant(result, type, 'ApiService result validation failed.');
}
