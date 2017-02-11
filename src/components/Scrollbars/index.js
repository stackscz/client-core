import React from 'react';
import { compose, pure, withProps } from 'recompose';
import ReactCustomScrollbars from 'react-custom-scrollbars';

export default compose(
	pure,
	withProps(
		// {
		// 	autoHide: true,
		// }
	),
	// rerenderOnResize,
)(ReactCustomScrollbars);
