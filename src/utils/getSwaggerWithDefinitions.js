export default (swagger, definitionsContext) => {
	return {
		...swagger,
		definitions: definitionsContext.keys().reduce((currentDefinitions, key) => {
			return { ...currentDefinitions, [key.match(/([a-z]+)/ig)[0]]: definitionsContext(key).default };
		}, {}),
	}
}
