import React from 'react';
import T from 'prop-types';
import { compose, pure, withState, withHandlers } from 'recompose';
import { bm, be } from 'utils/bliss';
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
				<div className={be(moduleName, 'header')}>
					{header}
				</div>
			)}
			<div className={be(moduleName, 'contentWrapper')}>
				<div className={be(moduleName, 'content')}>
					<span
						className={be(
							moduleName,
							'scrollIndicator',
							'top',
							{ isShown: scrolls && scrollTopRatio !== 0 }
						)}
					/>
					<span
						className={be(
							moduleName,
							'scrollIndicator',
							'bottom',
							{ isShown: scrolls && scrollTopRatio !== 1 }
						)}
					/>
					{!!children && (
						<Scrollbars
							onScrollFrame={setScrollPosition}
							onUpdate={setScrollPosition}
							autoHeight={autoHeight || !!maxContentHeight}
							autoHeightMax={maxContentHeight}
							autoScrollBottom={autoScrollBottom}
						>
							{children}
						</Scrollbars>
					)}
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
