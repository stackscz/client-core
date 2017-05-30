import { get as g, reduce } from 'lodash';
import memoize from 'fast-memoize';

export default memoize(
	(paths) => {
		return reduce(
			paths,
			(acc, path) => {
				const linkName = g(path, 'x-linkName');
				if (linkName) {
					return { ...acc, [linkName]: path }
				}
				return acc;
			},
			{},
		)
	}
);
