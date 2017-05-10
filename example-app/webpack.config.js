module.exports = function (options) {
	return {
		entry: {
			app: './src',
		},
		excludedModules: [
			'client-core',
		],
	};
};
