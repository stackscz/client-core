import React, { PropTypes as T } from 'react';
import { bm } from 'utils/bliss';
import { compose, pure, withState, withHandlers } from 'recompose';
import Scrollbars from 'components/Scrollbars';
import { noop } from 'lodash';

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
	handleScrollFrame,
	handleScrollbarsUpdate,
	handleScrollbarsRef,
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
								onScrollFrame={handleScrollFrame}
								onUpdate={handleScrollbarsUpdate}
								autoHeight={autoHeight || !!maxContentHeight}
								autoHeightMax={maxContentHeight}
								autoScrollBottom={autoScrollBottom}
								scrollbarsRef={handleScrollbarsRef}
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
	withHandlers({
		handleScrollFrame: ({ setScrollPosition, onScroll = noop }) => (e) => {
			onScroll(e);
			setScrollPosition(e);
		},
		handleScrollbarsUpdate: ({ setScrollPosition, onScrollbarsUpdate = noop }) => (e) => {
			onScrollbarsUpdate(e);
			setScrollPosition(e);
		},
		handleScrollbarsRef: ({ scrollbarsRef = noop }) => (e) => {
			if (e) {
				scrollbarsRef(e);
			}
		}
	}),
)(renderContextLayout);

ContextLayout.propTypes = {
	header: T.node,
	children: T.node,
	footer: T.node,
	onScroll: T.func,
	onScrollbarsUpdate: T.func,
	scrollbarsRef: T.func,
};

export default ContextLayout;
