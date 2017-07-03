'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _recompose = require('recompose');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');

var _ReactComponentTreeHook2 = _interopRequireDefault(_ReactComponentTreeHook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentNameRegex = /^[a-zA-Z0-9\(\)]+$/;

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
 */

exports.default = function (ReactDebugTool) {
	var debugProps = {};
	var debugNextProps = {};

	var _onBeforeMountComponent = ReactDebugTool.onBeforeMountComponent;
	ReactDebugTool.onBeforeMountComponent = function (debugID, element) {
		var componentName = _ReactComponentTreeHook2.default.getDisplayName(debugID);
		if (componentNameRegex.test(componentName)) {
			debugNextProps[debugID] = (0, _get2.default)(element, 'props');
		}

		for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			args[_key - 2] = arguments[_key];
		}

		_onBeforeMountComponent.apply(undefined, [debugID, element].concat(args));
	}.bind(ReactDebugTool);

	var _onBeforeUpdateComponent = ReactDebugTool.onBeforeUpdateComponent;
	ReactDebugTool.onBeforeUpdateComponent = function (debugID, element) {
		var componentName = _ReactComponentTreeHook2.default.getDisplayName(debugID);
		if (componentNameRegex.test(componentName)) {
			debugProps[debugID] = debugNextProps[debugID];
			debugNextProps[debugID] = (0, _get2.default)(element, 'props');
		}

		for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
			args[_key2 - 2] = arguments[_key2];
		}

		_onBeforeUpdateComponent.apply(undefined, [debugID, element].concat(args));
	}.bind(ReactDebugTool);

	var _onBeginLifeCycleTimer = ReactDebugTool.onBeginLifeCycleTimer;
	ReactDebugTool.onBeginLifeCycleTimer = function (debugID, timerType) {
		if (timerType === 'render') {
			var componentName = _ReactComponentTreeHook2.default.getDisplayName(debugID);
			// console.warn('render', componentName);
			if (componentNameRegex.test(componentName)) {
				var prevProps = debugProps[debugID];
				var props = debugNextProps[debugID];

				var diff = require('shallow-diff')(prevProps || {}, props);
				var updated = [].concat((0, _toConsumableArray3.default)(diff.added), (0, _toConsumableArray3.default)(diff.updated), (0, _toConsumableArray3.default)(diff.deleted));
				console.groupCollapsed('render: ' + debugID + ' ' + componentName);
				console.log('updated', updated);
				console.log('equalsDeep', compare(prevProps || {}, props));
				console.groupEnd();
			}
		}

		_onBeginLifeCycleTimer(debugID, timerType);
	}.bind(ReactDebugTool);
};

var compare = function compare(a, b) {

	var result = {
		different: [],
		missing_from_first: [],
		missing_from_second: []
	};

	(0, _reduce3.default)(a, function (result, value, key) {
		if (b.hasOwnProperty(key)) {
			if ((0, _isEqual3.default)(value, b[key])) {
				return result;
			} else {
				if ((0, _typeof3.default)(a[key]) != (0, _typeof3.default)({}) || (0, _typeof3.default)(b[key]) != (0, _typeof3.default)({})) {
					//dead end.
					result.different.push(key);
					return result;
				} else {
					var deeper = compare(a[key], b[key]);
					result.different = result.different.concat((0, _map3.default)(deeper.different, function (sub_path) {
						return key + "." + sub_path;
					}));

					result.missing_from_second = result.missing_from_second.concat((0, _map3.default)(deeper.missing_from_second, function (sub_path) {
						return key + "." + sub_path;
					}));

					result.missing_from_first = result.missing_from_first.concat((0, _map3.default)(deeper.missing_from_first, function (sub_path) {
						return key + "." + sub_path;
					}));
					return result;
				}
			}
		} else {
			result.missing_from_second.push(key);
			return result;
		}
	}, result);

	(0, _reduce3.default)(b, function (result, value, key) {
		if (a.hasOwnProperty(key)) {
			return result;
		} else {
			result.missing_from_first.push(key);
			return result;
		}
	}, result);

	return result;
};