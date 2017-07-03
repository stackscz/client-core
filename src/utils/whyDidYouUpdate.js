import g from 'lodash/get';
import _ from 'lodash';
import isEqual from 'lodash/isEqual';
import { getDisplayName as recomposeGetDisplayName } from 'recompose';
import React from 'react';
import ReactComponentTreeHook from 'react/lib/ReactComponentTreeHook';

const componentNameRegex = /^[a-zA-Z0-9\(\)]+$/;


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
export default (ReactDebugTool) => {
	const debugProps = {};
	const debugNextProps = {};

	const _onBeforeMountComponent = ReactDebugTool.onBeforeMountComponent;
	ReactDebugTool.onBeforeMountComponent = (
		function (debugID, element, ...args) {
			const componentName = ReactComponentTreeHook.getDisplayName(debugID);
			if (componentNameRegex.test(componentName)) {
				debugNextProps[debugID] = g(element, 'props');
			}
			_onBeforeMountComponent(debugID, element, ...args)
		}
	).bind(ReactDebugTool);

	const _onBeforeUpdateComponent = ReactDebugTool.onBeforeUpdateComponent;
	ReactDebugTool.onBeforeUpdateComponent = (
		function (debugID, element, ...args) {
			const componentName = ReactComponentTreeHook.getDisplayName(debugID);
			if (componentNameRegex.test(componentName)) {
				debugProps[debugID] = debugNextProps[debugID];
				debugNextProps[debugID] = g(element, 'props');
			}
			_onBeforeUpdateComponent(debugID, element, ...args);
		}
	).bind(ReactDebugTool);

	const _onBeginLifeCycleTimer = ReactDebugTool.onBeginLifeCycleTimer;
	ReactDebugTool.onBeginLifeCycleTimer = (
		function (debugID, timerType) {
			if (timerType === 'render') {
				const componentName = ReactComponentTreeHook.getDisplayName(debugID);
				// console.warn('render', componentName);
				if (componentNameRegex.test(componentName)) {
					const prevProps = debugProps[debugID];
					const props = debugNextProps[debugID];

					const diff = require('shallow-diff')(prevProps || {}, props);
					const updated = [...diff.added, ...diff.updated, ...diff.deleted];
					console.groupCollapsed(`render: ${debugID} ${componentName}`);
					console.log('updated', updated);
					console.log('equalsDeep', compare(prevProps || {}, props));
					console.groupEnd();
				}
			}

			_onBeginLifeCycleTimer(debugID, timerType);
		}
	).bind(ReactDebugTool);

}


var compare = function (a, b) {

	var result = {
		different: [],
		missing_from_first: [],
		missing_from_second: []
	};

	_.reduce(a, function (result, value, key) {
		if (b.hasOwnProperty(key)) {
			if (_.isEqual(value, b[key])) {
				return result;
			} else {
				if (typeof (a[key]) != typeof ({}) || typeof (b[key]) != typeof ({})) {
					//dead end.
					result.different.push(key);
					return result;
				} else {
					var deeper = compare(a[key], b[key]);
					result.different = result.different.concat(_.map(deeper.different, (sub_path) => {
						return key + "." + sub_path;
					}));

					result.missing_from_second = result.missing_from_second.concat(_.map(deeper.missing_from_second, (sub_path) => {
						return key + "." + sub_path;
					}));

					result.missing_from_first = result.missing_from_first.concat(_.map(deeper.missing_from_first, (sub_path) => {
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

	_.reduce(b, function (result, value, key) {
		if (a.hasOwnProperty(key)) {
			return result;
		} else {
			result.missing_from_first.push(key);
			return result;
		}
	}, result);

	return result;
};
