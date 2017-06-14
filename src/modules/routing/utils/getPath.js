import { isString, isObject, get as g, reduce, each, startsWith } from 'lodash';

const walkRoutes = (to, routes, parentLocation) => {
	const { name: routeName } = to;
	const matchedPathname = reduce(
		routes,
		(locationAcc, route) => {
			if (locationAcc) {
				return locationAcc;
			}
			if (routeName === g(route, 'name')) {
				return g(route, 'path', '');
			}
			const routeLocation = g(route, 'path', '');
			return walkRoutes(
				to,
				g(route, 'routes', []),
				startsWith(routeLocation[0], '/') ? routeLocation : `${parentLocation}/${routeLocation}`
			);
		},
		null,
	);
	if (!matchedPathname) {
		return null;
	}
	return startsWith(matchedPathname[0], '/') ? matchedPathname : `${parentLocation}/${matchedPathname}`;
};

const getPath = (to, routes) => {
	if (!isObject(to) || !isString(to.name)) {
		return to;
	}
	let result = walkRoutes(to, routes, '');
	if (!result) {
		return undefined;
	}
	const { params = {}, query = {} } = to;
	let querystring = [];
	each(params, (paramValue, paramKey) => {
		const replaced = result.replace(new RegExp(`:${paramKey}(?=\/|$)`), paramValue);
		if (result === replaced) {
			// query param
			querystring = [...querystring, `${paramKey}=${paramValue}`];
		}
		result = replaced;
	});
	each(query, (paramValue, paramKey) => {
		querystring = [...querystring, `${paramKey}=${paramValue}`];
	});

	return `${result}${querystring.length ? `?${querystring.join('&')}` : ''}`;
};

export default getPath;
