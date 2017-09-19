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

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Children = function Children(_ref) {
	var children = _ref.children;
	return _react2.default.createElement(
		'div',
		null,
		children
	);
};

var withScrollbars = (0, _recompose.compose)((0, _recompose.branch)(function () {
	return window.innerWidth < 768;
}, (0, _recompose.renderComponent)(Children)), (0, _recompose.withState)('autoScrollBottomChecked', 'setAutoScrollBottomChecked', false), (0, _recompose.withState)('scrollbarsElement', 'setScrollbarsRef'), (0, _recompose.withPropsOnChange)(function (_ref2, _ref3) {
	var autoScrollBottom = _ref2.autoScrollBottom;
	var nextAutoScrollBottom = _ref3.autoScrollBottom,
	    setAutoScrollBottomChecked = _ref3.setAutoScrollBottomChecked;

	if (autoScrollBottom && autoScrollBottom !== nextAutoScrollBottom) {
		setAutoScrollBottomChecked(false);
	}
}, _noop3.default), (0, _recompose.withProps)(function () {
	return {
		trackColor: '#e4e4e4',
		thumbColor: '#afafaf'
	};
}), (0, _recompose.withHandlers)({
	handleScrollbarsUpdate: function handleScrollbarsUpdate(_ref4) {
		var scrollbarsElement = _ref4.scrollbarsElement,
		    autoScrollBottom = _ref4.autoScrollBottom,
		    autoScrollBottomChecked = _ref4.autoScrollBottomChecked,
		    setAutoScrollBottomChecked = _ref4.setAutoScrollBottomChecked,
		    _ref4$onUpdate = _ref4.onUpdate,
		    onUpdate = _ref4$onUpdate === undefined ? _noop3.default : _ref4$onUpdate;
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
	handleScrollbarsRef: function handleScrollbarsRef(_ref5) {
		var setScrollbarsRef = _ref5.setScrollbarsRef,
		    _ref5$scrollbarsRef = _ref5.scrollbarsRef,
		    scrollbarsRef = _ref5$scrollbarsRef === undefined ? _noop3.default : _ref5$scrollbarsRef;
		return function (e) {
			if (e) {
				setScrollbarsRef(e);
				scrollbarsRef(e); // ref from props
			}
		};
	}
}), _recompose.pure);

var renderScrollbars = function renderScrollbars(_ref6) {
	var _ref6$moduleName = _ref6.moduleName,
	    moduleName = _ref6$moduleName === undefined ? 'Scrollbars' : _ref6$moduleName,
	    modifiers = _ref6.modifiers,
	    _ref6$autoHeight = _ref6.autoHeight,
	    autoHeight = _ref6$autoHeight === undefined ? false : _ref6$autoHeight,
	    _ref6$autoHeightMin = _ref6.autoHeightMin,
	    autoHeightMin = _ref6$autoHeightMin === undefined ? 0 : _ref6$autoHeightMin,
	    _ref6$autoHeightMax = _ref6.autoHeightMax,
	    autoHeightMax = _ref6$autoHeightMax === undefined ? Infinity : _ref6$autoHeightMax,
	    autoScrollBottom = _ref6.autoScrollBottom,
	    autoScrollBottomChecked = _ref6.autoScrollBottomChecked,
	    setAutoScrollBottomChecked = _ref6.setAutoScrollBottomChecked,
	    scrollbarsElement = _ref6.scrollbarsElement,
	    setScrollbarsRef = _ref6.setScrollbarsRef,
	    scrollbarsRef = _ref6.scrollbarsRef,
	    trackColor = _ref6.trackColor,
	    thumbColor = _ref6.thumbColor,
	    handleScrollbarsRef = _ref6.handleScrollbarsRef,
	    handleScrollbarsUpdate = _ref6.handleScrollbarsUpdate,
	    children = _ref6.children,
	    otherProps = (0, _objectWithoutProperties3.default)(_ref6, ['moduleName', 'modifiers', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'autoScrollBottom', 'autoScrollBottomChecked', 'setAutoScrollBottomChecked', 'scrollbarsElement', 'setScrollbarsRef', 'scrollbarsRef', 'trackColor', 'thumbColor', 'handleScrollbarsRef', 'handleScrollbarsUpdate', 'children']);

	return _react2.default.createElement(
		_reactCustomScrollbars.Scrollbars,
		(0, _extends3.default)({
			className: (0, _bliss.bm)(moduleName, modifiers),

			renderTrackHorizontal: function renderTrackHorizontal(_ref7) {
				var style = _ref7.style,
				    props = (0, _objectWithoutProperties3.default)(_ref7, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: trackColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'trackHorizontal'), style: finalStyle }, props));
			},

			renderThumbHorizontal: function renderThumbHorizontal(_ref8) {
				var style = _ref8.style,
				    props = (0, _objectWithoutProperties3.default)(_ref8, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: thumbColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'thumbHorizontal'), style: finalStyle }, props));
			},

			renderTrackVertical: function renderTrackVertical(_ref9) {
				var style = _ref9.style,
				    props = (0, _objectWithoutProperties3.default)(_ref9, ['style']);

				var finalStyle = (0, _extends3.default)({}, style, {
					backgroundColor: trackColor
				});
				return _react2.default.createElement('div', (0, _extends3.default)({ className: (0, _bliss.be)(moduleName, 'trackVertical'), style: finalStyle }, props));
			},

			renderThumbVertical: function renderThumbVertical(_ref10) {
				var style = _ref10.style,
				    props = (0, _objectWithoutProperties3.default)(_ref10, ['style']);

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