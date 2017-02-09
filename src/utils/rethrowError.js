import { isError } from 'lodash';

export default function rethrowError(e) {
	if (isError(e)) {
		throw e;
	}
}
