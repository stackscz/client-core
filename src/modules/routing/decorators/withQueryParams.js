import { get as g, reduce } from 'lodash';
import { withRouter } from 'react-router';
import { compose, withProps } from 'recompose';

const extractParams = (string) => {
	return reduce(
		string ? string.split('&') : [],
		(buffer, value) => {
			const parts = value.split('=');
			try {
				return {
					...buffer,
					// Coalesce parameter without value to `true`
					[parts[0]]: parts[1] === undefined || decodeURIComponent(parts[1]),
				};
			} catch (e) {
				console.warn(`Malformed query param encoding for key ${parts[0]}`);
				return buffer;
			}
		},
		{},
	);
};

export default compose(
	withRouter,
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
