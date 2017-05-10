'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactCustomScrollbars = require('react-custom-scrollbars');

var _bliss = require('../../utils/bliss');

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withScrollbars = (0, _recompose.compose)((0, _recompose.withState)('autoScrollBottomChecked', 'setAutoScrollBottomChecked', false), (0, _recompose.withState)('scrollbarsElement', 'setScrollbarsRef'), (0, _recompose.withPropsOnChange)(function (_ref, _ref2) {
	var autoScrollBottom = _ref.autoScrollBottom;
	var nextAutoScrollBottom = _ref2.autoScrollBottom,
	    setAutoScrollBottomChecked = _ref2.setAutoScrollBottomChecked;

	if (autoScrollBottom && autoScrollBottom !== nextAutoScrollBottom) {
		setAutoScrollBottomChecked(false);
	}
}, _noop3.default), (0, _recompose.withProps)(function () {
	var detect = new _mobileDetect2.default(window.navigator.userAgent);
	var isSmall = detect.phone() || detect.mobile() || detect.tablet();

	return {
		trackColor: isSmall ? 'transparent' : '#e4e4e4',
		thumbColor: isSmall ? 'transparent' : '#afafaf'
	};
}), (0, _recompose.withHandlers)({
	handleScrollbarsUpdate: function handleScrollbarsUpdate(_ref3) {
		var scrollbarsElement = _ref3.scrollbarsElement,
		    autoScrollBottom = _ref3.autoScrollBottom,
		    autoScrollBottomChecked = _ref3.autoScrollBottomChecked,
		    setAutoScrollBottomChecked = _ref3.setAutoScrollBottomChecked,
		    _ref3$onUpdate = _ref3.onUpdate,
		    onUpdate = _ref3$onUpdate === undefined ? _noop3.default : _ref3$onUpdate;
		return function (position) {
			if (!autoScrollBottomChecked) {
				setAutoScrollBottomChecked(true);
				if (autoScrollBottom && scrollbarsElement) {
					scrollbarsElement.scrollToBottom();
				}
			}
			onUpdate(position);
		};
	},
	handleScrollbarsRef: function handleScrollbarsRef(_ref4) {
		var setScrollbarsRef = _ref4.setScrollbarsRef;
		return function (e) {
			if (e) {
				setScrollbarsRef(e);
			}
		};
	}
}), _recompose.pure);

var renderScrollbars = function renderScrollbars(_ref5) {
	var _ref5$moduleName = _ref5.moduleName,
	    moduleName = _ref5$moduleName === undefined ? 'Scrollbars' : _ref5$moduleName,
	    modifiers = _ref5.modifiers,
	    _ref5$autoHeight = _ref5.autoHeight,
	    autoHeight = _ref5$autoHeight === undefined ? false : _ref5$autoHeight,
	    _ref5$autoHeightMin = _ref5.autoHeightMin,
	    autoHeightMin = _ref5$autoHeightMin === undefined ? 0 : _ref5$autoHeightMin,
	    _ref5$autoHeightMax = _ref5.autoHeightMax,
	    autoHeightMax = _ref5$autoHeightMax === undefined ? Infinity : _ref5$autoHeightMax,
	    autoScrollBottom = _ref5.autoScrollBottom,
	    autoScrollBottomChecked = _ref5.autoScrollBottomChecked,
	    setAutoScrollBottomChecked = _ref5.setAutoScrollBottomChecked,
	    scrollbarsElement = _ref5.scrollbarsElement,
	    setScrollbarsRef = _ref5.setScrollbarsRef,
	    trackColor = _ref5.trackColor,
	    thumbColor = _ref5.thumbColor,
	    handleScrollbarsRef = _ref5.handleScrollbarsRef,
	    handleScrollbarsUpdate = _ref5.handleScrollbarsUpdate,
	    children = _ref5.children,
	    otherProps = (0, _objectWithoutProperties3.default)(_ref5, ['moduleName', 'modifiers', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'autoScrollBottom', 'autoScrollBottomChecked', 'setAutoScrollBottomChecked', 'scrollbarsElement', 'setScrollbarsRef', 'trackColor', 'thumbColor', 'handleScrollbarsRef', 'handleScrollbarsUpdate', 'children']);

	return _react2.default.createElement(
		_reactCustomScrollbars.Scrollbars,
		(0, _extends3.default)({
			className: (0, _bliss.bm)(moduleName, modifiers),

			renderTrackHorizontal: function renderTrackHorizontal(_ref6) {
				var style = _ref6.style,
				    props = (0, _objectWithoutProperties3.default)(_ref6, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: trackColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'trackHorizontal'), style: finalStyle }, props));
			},

			renderThumbHorizontal: function renderThumbHorizontal(_ref7) {
				var style = _ref7.style,
				    props = (0, _objectWithoutProperties3.default)(_ref7, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: thumbColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'thumbHorizontal'), style: finalStyle }, props));
			},

			renderTrackVertical: function renderTrackVertical(_ref8) {
				var style = _ref8.style,
				    props = (0, _objectWithoutProperties3.default)(_ref8, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: trackColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'trackVertical'), style: finalStyle }, props));
			},

			renderThumbVertical: function renderThumbVertical(_ref9) {
				var style = _ref9.style,
				    props = (0, _objectWithoutProperties3.default)(_ref9, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: thumbColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'thumbVertical'), style: finalStyle }, props));
			},

			renderView: function renderView(props) {
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'view') }, props));
			},

			hideTracksWhenNotNeeded: true,

			ref: handleScrollbarsRef,

			autoHeight: autoHeight,
			autoHeightMin: autoHeightMin,
			autoHeightMax: autoHeightMax

		}, otherProps, {
			onUpdate: handleScrollbarsUpdate
		}),
		children
	);
};

var Scrollbars = withScrollbars(renderScrollbars);

Scrollbars.propTypes = {
	moduleName: _react.PropTypes.string,
	children: _react.PropTypes.node,
	modifiers: _react.PropTypes.string
};

exports.default = Scrollbars;