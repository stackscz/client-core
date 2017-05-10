import React from 'react';
import { range } from 'lodash';
import ContextLayout from 'components/ContextLayout';

export default {
	component: ContextLayout,
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
