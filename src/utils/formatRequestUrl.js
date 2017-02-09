import { isArray } from 'lodash';
import URI from 'urijs';

export default function formatRequestUrl(apiRootUrl, path) {
	const normalizedPath = isArray(path) ? path.join('/') : path;
	return new URI(`${apiRootUrl}/${normalizedPath}`).normalize().toString();
}
