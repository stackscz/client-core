import React, { PropTypes as T } from 'react';
import { Scrollbars as CustomScrollbars } from 'react-custom-scrollbars';
import { noop } from 'lodash';
import { bm, be } from 'utils/bliss';
import MobileDetect from 'mobile-detect';
import { compose, pure, withState, withProps, withHandlers, withPropsOnChange } from 'recompose';


const withScrollbars = compose(
	withState('autoScrollBottomChecked', 'setAutoScrollBottomChecked', false),
	withState('scrollbarsElement', 'setScrollbarsRef'),
	withPropsOnChange(
		({ autoScrollBottom }, { autoScrollBottom: nextAutoScrollBottom, setAutoScrollBottomChecked }) => {
			if (autoScrollBottom && autoScrollBottom !== nextAutoScrollBottom) {
				setAutoScrollBottomChecked(false);
			}
		},
		noop,
	),
	withProps(
		() => {
			const detect = new MobileDetect(window.navigator.userAgent);
			const isSmall = detect.phone() || detect.mobile() || detect.tablet();

			return {
				trackColor: isSmall ? 'transparent' : '#e4e4e4',
				thumbColor: isSmall ? 'transparent' : '#afafaf',
			};
		}
	),
	withHandlers(
		{
			handleScrollbarsUpdate: ({
				scrollbarsElement,
				autoScrollBottom,
				autoScrollBottomChecked,
				setAutoScrollBottomChecked,
				onUpdate = noop,
			}) =>
				(position) => {
					if (!autoScrollBottomChecked) {
						setAutoScrollBottomChecked(true);
						if (autoScrollBottom && scrollbarsElement) {
							scrollbarsElement.scrollToBottom();
						}
					}
					onUpdate(position);
				},
			handleScrollbarsRef: ({ setScrollbarsRef, scrollbarsRef = noop }) => (e) => {
				if (e) {
					setScrollbarsRef(e);
					scrollbarsRef(e); // ref from props
				}
			},
		}
	),
	pure,
);

const renderScrollbars = ({
	moduleName = 'Scrollbars',
	modifiers,
	autoHeight = false,
	autoHeightMin = 0,
	autoHeightMax = Infinity,
	autoScrollBottom, // eslint-disable-line
	autoScrollBottomChecked, // eslint-disable-line
	setAutoScrollBottomChecked, // eslint-disable-line
	scrollbarsElement, // eslint-disable-line
	setScrollbarsRef, // eslint-disable-line
	scrollbarsRef, // eslint-disable-line
	trackColor,
	thumbColor,
	handleScrollbarsRef,
	handleScrollbarsUpdate,
	children,
	...otherProps,
}) => {
	return (
		<CustomScrollbars
			className={bm(moduleName, modifiers)}

			renderTrackHorizontal={
				({ style, ...props }) => {
					const finalStyle = {
						...style,
						backgroundColor: trackColor,
					};
					return <div className={be(moduleName, 'trackHorizontal')} style={finalStyle} {...props} />;
				}
			}

			renderThumbHorizontal={
				({ style, ...props }) => {
					const finalStyle = {
						...style,
						backgroundColor: thumbColor,
					};
					return <div className={be(moduleName, 'thumbHorizontal')} style={finalStyle} {...props} />;
				}
			}

			renderTrackVertical={
				({ style, ...props }) => {
					const finalStyle = {
						...style,
						backgroundColor: trackColor,
					};
					return <div className={be(moduleName, 'trackVertical')} style={finalStyle} {...props} />;
				}
			}

			renderThumbVertical={
				({ style, ...props }) => {
					const finalStyle = {
						...style,
						backgroundColor: thumbColor,
					};
					return <div className={be(moduleName, 'thumbVertical')} style={finalStyle} {...props} />;
				}
			}

			renderView={
				(props) => {
					return <div className={be(moduleName, 'view')} {...props} />;
				}
			}

			hideTracksWhenNotNeeded

			ref={handleScrollbarsRef}

			autoHeight={autoHeight}
			autoHeightMin={autoHeightMin}
			autoHeightMax={autoHeightMax}

			{...otherProps}
			onUpdate={handleScrollbarsUpdate}
		>
			{children}
		</CustomScrollbars>
	);
};

const Scrollbars = withScrollbars(renderScrollbars);

Scrollbars.propTypes = {
	moduleName: T.string,
	children: T.node,
	modifiers: T.string,
	scrollbarsRef: T.func,
};

export default Scrollbars;
