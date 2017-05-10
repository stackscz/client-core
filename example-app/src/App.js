import React from 'react';
import { bm } from 'utils/bliss';

const renderApp = ({
	moduleName = 'App',
}) => {
	return (
		<div className={bm(moduleName)}>
			aaa
		</div>
	);
};

const App = renderApp;

export default App;
