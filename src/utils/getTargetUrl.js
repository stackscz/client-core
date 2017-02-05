import URI from 'urijs';

export default function getTargetUrl(apiContext, path) {
	const { host } = apiContext;
	if (host) {
		return new URI('')
			.host(host.name)
			.path(path)
			.protocol(`http${(host.ssl ? 's' : '')}`)
			.readable()
			.toString();
	}
	return new URI('')
		.protocol(window.location.protocol)
		.host(window.location.host)
		.path(path)
		.readable()
		.toString();
}
