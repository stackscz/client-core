import React from 'react';

const examples = require.context('../examples', false, /\.js$/);

import Showcase from './Showcase';

const renderApp = () => {
	return (
		<div style={{ height: '100%' }}>
			<Showcase
				examples={examples.keys().reduce((acc, key) => ({...acc, [key]: examples(key).default}), {})}
			/>
		</div>
	);
};

const App = renderApp;

export default App;
