'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _noop2 = require('lodash/noop');

var _noop3 = _interopRequireDefault(_noop2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bliss = require('../../utils/bliss');

var _recompose = require('recompose');

var _Scrollbars = require('../Scrollbars');

var _Scrollbars2 = _interopRequireDefault(_Scrollbars);

require('./index.sass');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderContextLayout = function renderContextLayout() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    _ref$moduleName = _ref.moduleName,
	    moduleName = _ref$moduleName === undefined ? 'ContextLayout' : _ref$moduleName,
	    header = _ref.header,
	    children = _ref.children,
	    footer = _ref.footer,
	    _ref$autoHeight = _ref.autoHeight,
	    autoHeight = _ref$autoHeight === undefined ? false : _ref$autoHeight,
	    maxContentHeight = _ref.maxContentHeight,
	    autoScrollBottom = _ref.autoScrollBottom,
	    _ref$scrollPosition = _ref.scrollPosition;

	_ref$scrollPosition = _ref$scrollPosition === undefined ? {} : _ref$scrollPosition;
	var _ref$scrollPosition$t = _ref$scrollPosition.top,
	    scrollTopRatio = _ref$scrollPosition$t === undefined ? 0 : _ref$scrollPosition$t,
	    clientHeight = _ref$scrollPosition.clientHeight,
	    scrollHeight = _ref$scrollPosition.scrollHeight,
	    setScrollPosition = _ref.setScrollPosition,
	    handleScrollFrame = _ref.handleScrollFrame,
	    handleScrollbarsUpdate = _ref.handleScrollbarsUpdate,
	    handleScrollbarsRef = _ref.handleScrollbarsRef;

	var scrolls = clientHeight < scrollHeight;
	return _react2.default.createElement(
		'div',
		{ className: (0, _bliss.bm)(moduleName, { autoHeight: autoHeight, hasMaxContentHeight: !!maxContentHeight }) },
		!!header && _react2.default.createElement(
			'div',
			{ className: 'ContextLayout-header' },
			header
		),
		_react2.default.createElement(
			'div',
			{ className: 'ContextLayout-contentWrapper' },
			_react2.default.createElement(
				'div',
				{ className: 'ContextLayout-content' },
				scrolls && scrollTopRatio !== 0 && _react2.default.createElement('span', { className: 'ContextLayout-scrollIndicator ContextLayout-scrollIndicator--top' }),
				scrolls && scrollTopRatio !== 1 && _react2.default.createElement('span', { className: 'ContextLayout-scrollIndicator ContextLayout-scrollIndicator--bottom' }),
				!!children && _react2.default.createElement(
					_Scrollbars2.default,
					{
						onScrollFrame: handleScrollFrame,
						onUpdate: handleScrollbarsUpdate,
						autoHeight: autoHeight || !!maxContentHeight,
						autoHeightMax: maxContentHeight,
						autoScrollBottom: autoScrollBottom,
						scrollbarsRef: handleScrollbarsRef
					},
					children
				)
			)
		),
		!!footer && _react2.default.createElement(
			'div',
			{ className: 'ContextLayout-footer' },
			footer
		)
	);
};

var ContextLayout = (0, _recompose.compose)(_recompose.pure, (0, _recompose.withState)('scrollPosition', 'setScrollPosition', {}), (0, _recompose.withHandlers)({
	handleScrollFrame: function handleScrollFrame(_ref2) {
		var setScrollPosition = _ref2.setScrollPosition,
		    _ref2$onScroll = _ref2.onScroll,
		    onScroll = _ref2$onScroll === undefined ? _noop3.default : _ref2$onScroll;
		return function (e) {
			onScroll(e);
			setScrollPosition(e);
		};
	},
	handleScrollbarsUpdate: function handleScrollbarsUpdate(_ref3) {
		var setScrollPosition = _ref3.setScrollPosition,
		    _ref3$onScrollbarsUpd = _ref3.onScrollbarsUpdate,
		    onScrollbarsUpdate = _ref3$onScrollbarsUpd === undefined ? _noop3.default : _ref3$onScrollbarsUpd;
		return function (e) {
			onScrollbarsUpdate(e);
			setScrollPosition(e);
		};
	},
	handleScrollbarsRef: function handleScrollbarsRef(_ref4) {
		var _ref4$scrollbarsRef = _ref4.scrollbarsRef,
		    scrollbarsRef = _ref4$scrollbarsRef === undefined ? _noop3.default : _ref4$scrollbarsRef;
		return function (e) {
			if (e) {
				scrollbarsRef(e);
			}
		};
	}
}))(renderContextLayout);

ContextLayout.propTypes = {
	header: _react.PropTypes.node,
	children: _react.PropTypes.node,
	footer: _react.PropTypes.node,
	onScroll: _react.PropTypes.func,
	onScrollbarsUpdate: _react.PropTypes.func,
	scrollbarsRef: _react.PropTypes.func
};

exports.default = ContextLayout;