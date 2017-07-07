'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _some2 = require('lodash/some');

var _some3 = _interopRequireDefault(_some2);

var _every2 = require('lodash/every');

var _every3 = _interopRequireDefault(_every2);

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');

var _ReactComponentTreeHook2 = _interopRequireDefault(_ReactComponentTreeHook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultInclude = /^[a-zA-Z0-9\(\)]+$/;

var shouldInclude = function shouldInclude(componentName) {
	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$include = _ref.include,
	    include = _ref$include === undefined ? [defaultInclude] : _ref$include,
	    _ref$exclude = _ref.exclude,
	    exclude = _ref$exclude === undefined ? [] : _ref$exclude;

	var normalizedInclude = (0, _isArray3.default)(include) ? include : [include];
	var normalizedExclude = (0, _isArray3.default)(exclude) ? exclude : [exclude];

	var isIncluded = (0, _some3.default)(normalizedInclude, function (r) {
		return r.test(componentName);
	});
	var isExcluded = (0, _some3.default)(normalizedExclude, function (r) {
		return r.test(componentName);
	});

	return isIncluded && !isExcluded;
};

var findStateInTree = function findStateInTree(_renderedComponent, debugID) {
	var renderedComponentDebugId = (0, _get2.default)(_renderedComponent, '_debugID');
	if (renderedComponentDebugId === debugID) {
		return (0, _get2.default)(_renderedComponent, '_instance.state');
	}
	var rc = (0, _get2.default)(_renderedComponent, '_renderedComponent');
	if (!rc) {
		return rc;
	}
	return findStateInTree(rc, debugID);
};

/**
 *
 * @example
 *
 * import ReactDebugTool from 'react-dom/lib/ReactDebugTool';
 * import Perf from 'react-addons-perf';
 *
 * whyDidYouUpdate(ReactDebugTool);
 * Perf.start();
 *
 * @param ReactDebugTool
 * @param config
 */

exports.default = function (ReactDebugTool, config) {
	var debugProps = {};
	var debugNextProps = {};

	var debugState = {};
	var debugNextState = {};

	var hook = {
		onBeginLifeCycleTimer: function onBeginLifeCycleTimer(debugID, timerType) {
			if (timerType === 'render') {

				var element = _ReactComponentTreeHook2.default.getElement(debugID);
				var componentName = _ReactComponentTreeHook2.default.getDisplayName(debugID);
				// console.warn('render', componentName);
				if (shouldInclude(componentName, config)) {

					debugProps[debugID] = debugNextProps[debugID];
					debugNextProps[debugID] = (0, _get2.default)(element, 'props');

					debugState[debugID] = debugNextState[debugID];
					debugNextState[debugID] = findStateInTree((0, _get2.default)(element, '_owner._renderedComponent'), debugID) || {};

					// console.warn('onRender', componentName);
					var prevProps = debugProps[debugID];
					var props = debugNextProps[debugID];
					// debugger;
					var prevState = debugState[debugID];
					var state = debugNextState[debugID];

					var propComparisons = (0, _mapValues3.default)(props, function (value, key) {
						return (0, _isEqual2.default)(value, prevProps && prevProps[key]);
					});

					var stateComparisons = (0, _mapValues3.default)(state, function (value, key) {
						return (0, _isEqual2.default)(value, prevState && prevState[key]);
					});

					var propsEqual = prevProps && (0, _every3.default)(propComparisons);
					var stateEqual = prevState && (0, _every3.default)(stateComparisons);
					var allEqual = propsEqual && stateEqual;
					if (allEqual && prevProps) {
						var propsDiff = require('shallow-diff')(prevProps || {}, props || {});
						var stateDiff = require('shallow-diff')(prevState || {}, state || {});
						var updatedProps = [].concat((0, _toConsumableArray3.default)(propsDiff.added), (0, _toConsumableArray3.default)(propsDiff.updated), (0, _toConsumableArray3.default)(propsDiff.deleted));
						var updatedState = [].concat((0, _toConsumableArray3.default)(stateDiff.added), (0, _toConsumableArray3.default)(stateDiff.updated), (0, _toConsumableArray3.default)(stateDiff.deleted));
						console.groupCollapsed('avoidable render: id: ' + debugID + ', ' + componentName);
						console.log('updatedProps', updatedProps);
						console.log('updatedState', updatedState);
						console.log('propsBefore', prevProps);
						console.log('propsAfter', props);
						console.log('stateBefore', prevState);
						console.log('stateAfter', state);
						// console.log('equalsDeep', compare(prevProps || {}, props));
						console.groupEnd();
					}
				}
			}
		}
	};

	ReactDebugTool.addHook(hook);
};