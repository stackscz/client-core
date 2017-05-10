import { get as g, reduce } from 'lodash';
import { compose, withProps } from 'recompose';

const extractParams = (string) => {
	return reduce(
		string.split('&'),
		(buffer, value) => {
			const parts = value.split('=');
			return {
				...buffer,
				[parts[0]]: parts[1],
			};
		},
		{},
	);
};

export default compose(
	withProps(
		({ location }) => {
			const querystring = g(location, 'search', '').replace('?', '');
			const queryParams = extractParams(querystring);

			const hashQuerystring = g(location, 'hash', '').replace('#', '');
			const hashQueryParams = extractParams(hashQuerystring);

			return {
				queryParams,
				hashQueryParams,
			};
		}
	)
);
