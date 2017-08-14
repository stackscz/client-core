'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _upperFirst2 = require('lodash/upperFirst');

var _upperFirst3 = _interopRequireDefault(_upperFirst2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _reactRedux = require('react-redux');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

var _lifecycle = require('../../../utils/lifecycle');

var _lifecycle2 = _interopRequireDefault(_lifecycle);

var _actions = require('../actions');

var _selectors = require('../selectors');

var _hash = require('../../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyResource = {};
var linkSelector = function linkSelector(props, linkPropName) {
	return (0, _get3.default)(props, linkPropName);
};

exports.default = function (_ref) {
	var _withHandlers;

	var link = _ref.link,
	    _ref$linkPropName = _ref.linkPropName,
	    linkPropName = _ref$linkPropName === undefined ? 'resourceLink' : _ref$linkPropName,
	    _ref$outputPropsPrefi = _ref.outputPropsPrefix,
	    outputPropsPrefix = _ref$outputPropsPrefi === undefined ? '' : _ref$outputPropsPrefi,
	    _ref$autoload = _ref.autoload,
	    autoload = _ref$autoload === undefined ? false : _ref$autoload;

	var resourceLinkKey = outputPropsPrefix ? outputPropsPrefix + 'ResourceLink' : 'resourceLink';
	var resourceKey = outputPropsPrefix ? outputPropsPrefix + 'Resource' : 'resource';
	var resourceContentKey = outputPropsPrefix ? outputPropsPrefix + 'ResourceContent' : 'resourceContent';
	var handleEnsureResourceKey = 'handleEnsure' + (0, _upperFirst3.default)(outputPropsPrefix) + 'Resource';
	var handleFetchResourceKey = 'handleFetch' + (0, _upperFirst3.default)(outputPropsPrefix) + 'Resource';

	var linkFactory = !!link ? link : function (props) {
		return (0, _get3.default)(props, linkPropName);
	};
	// const memoizedLinkFactory = memoize(linkFactory);

	return (0, _recompose.compose)(_recompose.pure, (0, _recompose.withProps)(function (props) {
		return { link: linkFactory(props) };
	}), (0, _reactRedux.connect)(function (state, ownerProps) {
		var _ref2;

		var resourceLink = ownerProps.link;
		// TODO dynamic denormalization schema instead of 5 levels deep

		var denormalizedResource = (0, _selectors.denormalizedResourceSelectorFactory)(resourceLink, 5)(state);
		return _ref2 = {}, (0, _defineProperty3.default)(_ref2, resourceLinkKey, resourceLink), (0, _defineProperty3.default)(_ref2, resourceKey, (0, _selectors.resourceSelectorFactory)(resourceLink)(state) || emptyResource), (0, _defineProperty3.default)(_ref2, resourceContentKey, (0, _get3.default)(denormalizedResource, 'content')), _ref2;
	}), (0, _recompose.withHandlers)((_withHandlers = {}, (0, _defineProperty3.default)(_withHandlers, handleEnsureResourceKey, function (_ref3) {
		var dispatch = _ref3.dispatch,
		    resourceLink = _ref3[resourceLinkKey];
		return function () {
			dispatch((0, _actions.ensureResource)({
				link: resourceLink
			}));
		};
	}), (0, _defineProperty3.default)(_withHandlers, handleFetchResourceKey, function (_ref4) {
		var dispatch = _ref4.dispatch,
		    resourceLink = _ref4[resourceLinkKey];
		return function () {
			dispatch((0, _actions.fetchResource)({
				link: resourceLink
			}));
		};
	}), (0, _defineProperty3.default)(_withHandlers, 'handleDelete' + (0, _upperFirst3.default)(outputPropsPrefix) + 'Resource', function undefined(_ref5) {
		var dispatch = _ref5.dispatch,
		    resourceLink = _ref5[resourceLinkKey];
		return function () {
			var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    collectionsLinks = _ref6.collectionsLinks,
			    customLink = _ref6.link;

			dispatch((0, _actions.deleteResource)({
				link: customLink || resourceLink,
				collectionsLinks: collectionsLinks
			}));
		};
	}), (0, _defineProperty3.default)(_withHandlers, 'handleMerge' + (0, _upperFirst3.default)(outputPropsPrefix) + 'Resource', function undefined() {
		var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    dispatch = _ref7.dispatch,
		    resourceLink = _ref7[resourceLinkKey];

		return function () {
			var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    link = _ref8.link,
			    data = _ref8.data,
			    parentLink = _ref8.parentLink;

			dispatch((0, _actions.mergeResource)({ link: link || resourceLink, data: data, parentLink: parentLink }));
		};
	}), (0, _defineProperty3.default)(_withHandlers, 'handleForget' + (0, _upperFirst3.default)(outputPropsPrefix) + 'Resource', function undefined(_ref9) {
		var dispatch = _ref9.dispatch,
		    resourceLink = _ref9[resourceLinkKey];
		return function () {
			var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    link = _ref10.link,
			    collectionsLinks = _ref10.collectionsLinks;

			dispatch((0, _actions.forgetResource)({ link: link || resourceLink, collectionsLinks: collectionsLinks }));
		};
	}), _withHandlers)), (0, _lifecycle2.default)(autoload ? {
		componentWillMount: function componentWillMount(_ref11) {
			var handleEnsureResource = _ref11[handleEnsureResourceKey];

			handleEnsureResource();
		},
		componentWillReceiveProps: function componentWillReceiveProps(_ref12, _ref13) {
			var oldResourceLink = _ref12[resourceLinkKey];
			var resourceLink = _ref13[resourceLinkKey],
			    handleEnsureResource = _ref13[handleEnsureResourceKey];

			if ((0, _hash2.default)(resourceLink) !== (0, _hash2.default)(oldResourceLink)) {
				console.log('LINK CHANGED', oldResourceLink, resourceLink);
				handleEnsureResource();
			}
		}
	} : {}), (0, _recompose.mapProps)(function (props) {
		return (0, _omit3.default)(props, ['link']);
	}));
};