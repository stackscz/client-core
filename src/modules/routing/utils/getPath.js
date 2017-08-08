import { isString, isObject, get as g, reduce, each, startsWith, isUndefined } from 'lodash';

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
	let queryStringParts = [];
	each(params, (paramValue, paramKey) => {
		const replaced = result.replace(new RegExp(`:${paramKey}(?=\/|$)`), paramValue);
		if (result === replaced) {
			if (isUndefined(paramValue)) {
				return;
			}
			// query param
			queryStringParts = [...queryStringParts, `${paramKey}=${encodeURIComponent(paramValue)}`];
		}
		result = replaced;
	});
	each(query, (paramValue, paramKey) => {
		queryStringParts = [...queryStringParts, `${paramKey}=${paramValue}`];
	});

	return `${result}${queryStringParts.length ? `?${queryStringParts.join('&')}` : ''}`;
};

export default getPath;
