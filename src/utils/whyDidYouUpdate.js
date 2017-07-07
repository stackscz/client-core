import g from 'lodash/get';
import  { mapValues, every, some, isArray } from 'lodash';
import isEqual from 'lodash/isEqual';
import React from 'react';
import ReactComponentTreeHook from 'react/lib/ReactComponentTreeHook';

const defaultInclude = /^[a-zA-Z0-9\(\)]+$/;

const shouldInclude = (componentName, { include = [defaultInclude], exclude = [] } = {}) => {
	const normalizedInclude = isArray(include) ? include : [include];
	const normalizedExclude = isArray(exclude) ? exclude : [exclude];

	let isIncluded = some(normalizedInclude, r => r.test(componentName));
	let isExcluded = some(normalizedExclude, r => r.test(componentName));

	return isIncluded && !isExcluded
};

const findStateInTree = (_renderedComponent, debugID) => {
	const renderedComponentDebugId = g(_renderedComponent, '_debugID');
	if (renderedComponentDebugId === debugID) {
		return g(_renderedComponent, '_instance.state');
	}
	const rc = g(_renderedComponent, '_renderedComponent');
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
export default (ReactDebugTool, config) => {
	const debugProps = {};
	const debugNextProps = {};

	const debugState = {};
	const debugNextState = {};

	const hook = {
		onBeginLifeCycleTimer(debugID, timerType) {
			if (timerType === 'render') {

				const element = ReactComponentTreeHook.getElement(debugID);
				const componentName = ReactComponentTreeHook.getDisplayName(debugID);
				// console.warn('render', componentName);
				if (shouldInclude(componentName, config)) {

					debugProps[debugID] = debugNextProps[debugID];
					debugNextProps[debugID] = g(element, 'props');

					debugState[debugID] = debugNextState[debugID];
					debugNextState[debugID] = findStateInTree(g(element, '_owner._renderedComponent'), debugID) || {};

					// console.warn('onRender', componentName);
					const prevProps = debugProps[debugID];
					const props = debugNextProps[debugID];
					// debugger;
					const prevState = debugState[debugID];
					const state = debugNextState[debugID];

					const propComparisons = mapValues(
						props,
						(value, key) => {
							return isEqual(value, prevProps && prevProps[key])
						}
					);

					const stateComparisons = mapValues(
						state,
						(value, key) => {
							return isEqual(value, prevState && prevState[key])
						}
					);

					const propsEqual = prevProps && every(propComparisons);
					const stateEqual = prevState && every(stateComparisons);
					const allEqual = propsEqual && stateEqual;
					if (allEqual && prevProps) {
						const propsDiff = require('shallow-diff')(prevProps || {}, props || {});
						const stateDiff = require('shallow-diff')(prevState || {}, state || {});
						const updatedProps = [...propsDiff.added, ...propsDiff.updated, ...propsDiff.deleted];
						const updatedState = [...stateDiff.added, ...stateDiff.updated, ...stateDiff.deleted];
						console.groupCollapsed(`avoidable render: id: ${debugID}, ${componentName}`);
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
		},
	};

	ReactDebugTool.addHook(hook);
}
