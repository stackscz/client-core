var path = require('path');

module.exports = function (options) {
	return {
		entry: {
			app: './src',
		},
		excludedModules: [
			'client-core',
			'reset-css',
		],
		rules: [
			{
				test: /\.js$/,
				loaders: [
					'babel-loader?babelrc=false&extends=' + path.resolve(__dirname, '.babelrc')
				],
				include: [
					/client-core/,
				],
			},
		],
	};
};
