import React from 'react';
import { range } from 'lodash';
import ContextLayout from 'components/ContextLayout';

export default {
	title: 'ContextLayout',
	component: ContextLayout,
	viewports: [
		[300, 300],
		[500],
		[600, 1000],
	],
	initialProps: {
		header: 'Header content',
		footer: (
			<div>
				foo
				<br />
				bar
			</div>
		),
		children: range(0, 100).map((i) => <div>item {i}.</div>),
	}
};
