import React from 'react';
import { compose, pure, withState } from 'recompose';
import Scrollbars from 'components/Scrollbars';
// import rerenderOnResize from 'client-core/lib/decorators/rerenderOnResize';

import './index.sass';

const renderContextLayout = ({
	header,
	children,
	footer,
	scrollPosition: {
		top: scrollTopRatio = 0,
		clientHeight,
		scrollHeight,
	} = {},
	setScrollPosition,
} = {}) => {
	const scrolls = clientHeight < scrollHeight;
	return (
		<div className="ContextLayout">
			{!!header && (
				<div className="ContextLayout-header">
					{header}
				</div>
			)}
			<div className="ContextLayout-contentWrapper">
				<div className="ContextLayout-content">
					{scrolls && scrollTopRatio !== 0 && (
						<span className="ContextLayout-scrollIndicator ContextLayout-scrollIndicator--top" />
					)}
					{scrolls && scrollTopRatio !== 1 && (
						<span className="ContextLayout-scrollIndicator ContextLayout-scrollIndicator--bottom" />
					)}
					<Scrollbars
						style={{ width: '100%', height: '100%' }}
						onScrollFrame={setScrollPosition}
						onUpdate={setScrollPosition}
					>
						{children}
					</Scrollbars>
				</div>
			</div>
			{!!footer && (
				<div className="ContextLayout-footer">
					{footer}
				</div>
			)}
		</div>
	);
};

const ContextLayout = compose(
	pure,
	withState('scrollPosition', 'setScrollPosition', {}),
)(renderContextLayout);

export default ContextLayout;
