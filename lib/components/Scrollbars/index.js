'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _withPropsOnChange2 = require('recompose/withPropsOnChange');

var _withPropsOnChange3 = _interopRequireDefault(_withPropsOnChange2);

var _withHandlers2 = require('recompose/withHandlers');

var _withHandlers3 = _interopRequireDefault(_withHandlers2);

var _withProps2 = require('recompose/withProps');

var _withProps3 = _interopRequireDefault(_withProps2);

var _withState2 = require('recompose/withState');

var _withState3 = _interopRequireDefault(_withState2);

var _pure2 = require('recompose/pure');

var _pure3 = _interopRequireDefault(_pure2);

var _compose2 = require('recompose/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactCustomScrollbars = require('react-custom-scrollbars');

var _bliss = require('../../utils/bliss');

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withScrollbars = (0, _compose3.default)((0, _withState3.default)('autoScrollBottomChecked', 'setAutoScrollBottomChecked', false), (0, _withState3.default)('scrollbarsElement', 'setScrollbarsRef'), (0, _withPropsOnChange3.default)(function (_ref, _ref2) {
	var autoScrollBottom = _ref.autoScrollBottom;
	var nextAutoScrollBottom = _ref2.autoScrollBottom,
	    setAutoScrollBottomChecked = _ref2.setAutoScrollBottomChecked;

	if (autoScrollBottom && autoScrollBottom !== nextAutoScrollBottom) {
		setAutoScrollBottomChecked(false);
	}
}, _noop3.default), (0, _withProps3.default)(function () {
	var isSmall = false;
	if ((typeof window === 'undefined' ? 'undefined' : (0, _typeof3.default)(window)) === 'object') {
		var detect = new _mobileDetect2.default(window.navigator.userAgent);
		isSmall = detect.phone() || detect.mobile() || detect.tablet();
	}
	return {
		trackColor: isSmall ? 'transparent' : '#e4e4e4',
		thumbColor: isSmall ? 'transparent' : '#afafaf'
	};
}), (0, _withHandlers3.default)({
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
		var setScrollbarsRef = _ref4.setScrollbarsRef,
		    _ref4$scrollbarsRef = _ref4.scrollbarsRef,
		    scrollbarsRef = _ref4$scrollbarsRef === undefined ? _noop3.default : _ref4$scrollbarsRef;
		return function (e) {
			if (e) {
				setScrollbarsRef(e);
				scrollbarsRef(e); // ref from props
			}
		};
	}
}), _pure3.default);

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
	    scrollbarsRef = _ref5.scrollbarsRef,
	    trackColor = _ref5.trackColor,
	    thumbColor = _ref5.thumbColor,
	    handleScrollbarsRef = _ref5.handleScrollbarsRef,
	    handleScrollbarsUpdate = _ref5.handleScrollbarsUpdate,
	    children = _ref5.children,
	    otherProps = (0, _objectWithoutProperties3.default)(_ref5, ['moduleName', 'modifiers', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'autoScrollBottom', 'autoScrollBottomChecked', 'setAutoScrollBottomChecked', 'scrollbarsElement', 'setScrollbarsRef', 'scrollbarsRef', 'trackColor', 'thumbColor', 'handleScrollbarsRef', 'handleScrollbarsUpdate', 'children']);

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
	modifiers: _react.PropTypes.string,
	scrollbarsRef: _react.PropTypes.func
};

exports.default = Scrollbars;