export default function (moduleName, reducer = state => state, sagas = []) {
	return {
		reducers: {
			[moduleName]: reducer,
		},
		sagas,
	};
}
