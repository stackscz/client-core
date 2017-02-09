import React from 'react';

export default function debug(value) {
	return (
		<pre>{JSON.stringify(value, null, 2)}</pre>
	);
}
