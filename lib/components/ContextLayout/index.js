'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _withState2 = require('recompose/withState');

var _withState3 = _interopRequireDefault(_withState2);

var _pure2 = require('recompose/pure');

var _pure3 = _interopRequireDefault(_pure2);

var _compose2 = require('recompose/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bliss = require('../../utils/bliss');

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
	    setScrollPosition = _ref.setScrollPosition;

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
						onScrollFrame: setScrollPosition,
						onUpdate: setScrollPosition,
						autoHeight: autoHeight || !!maxContentHeight,
						autoHeightMax: maxContentHeight,
						autoScrollBottom: autoScrollBottom
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

var ContextLayout = (0, _compose3.default)(_pure3.default, (0, _withState3.default)('scrollPosition', 'setScrollPosition', {}))(renderContextLayout);

ContextLayout.propTypes = {
	header: _react.PropTypes.node,
	children: _react.PropTypes.node,
	footer: _react.PropTypes.node
};

exports.default = ContextLayout;