import React, { PropTypes as T } from 'react';
import { bm } from 'utils/bliss';
import { compose, pure, withState } from 'recompose';
import Scrollbars from 'components/Scrollbars';

import './index.sass';

const renderContextLayout = ({
	moduleName = 'ContextLayout',
	header,
	children,
	footer,
	autoHeight = false,
	maxContentHeight,
	autoScrollBottom,
	scrollPosition: {
		top: scrollTopRatio = 0,
		clientHeight,
		scrollHeight,
	} = {},
	setScrollPosition,
} = {}) => {
	const scrolls = clientHeight < scrollHeight;
	return (
		<div className={bm(moduleName, { autoHeight, hasMaxContentHeight: !!maxContentHeight })}>
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
					{
						!!children && (
							<Scrollbars
								onScrollFrame={setScrollPosition}
								onUpdate={setScrollPosition}
								autoHeight={autoHeight || !!maxContentHeight}
								autoHeightMax={maxContentHeight}
								autoScrollBottom={autoScrollBottom}
							>
								{children}
							</Scrollbars>
						)
					}
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

ContextLayout.propTypes = {
	header: T.node,
	children: T.node,
	footer: T.node,
};

export default ContextLayout;
