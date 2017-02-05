import { isFunction, includes } from 'lodash';
import {
	compose,
	lifecycle as recomposeLifecycle,
	pure,
	setPropTypes,
	defaultProps,
	withState,
	setDisplayName,
	getDisplayName,
	withProps,
	toClass,
	branch,
	renderNothing,
	renderComponent,
	withHandlers,
} from 'recompose';

const lifecycleMethods = [
	'getInitialState',
	'componentWillMount',
	'componentDidMount',
	'componentWillReceiveProps',
	'shouldComponentUpdate',
	'componentWillUpdate',
	'componentDidUpdate',
	'componentWillUnmount',
];

/**
 * @description
 * "Enhances" the lifecycle spec object's methods with `this.props`, always as the first argument.
 * That makes the interface *purely functional*.
 *
 * @example
 * // `this.props` on the composed component has `user` and `redirectToLandingScreen` properties.
 * lifecycle({
 * componentWillMount({ user, redirectToLandingScreen }) {
 * 	 if (user && !user.anonymous) {
 * 	 	 redirectToLandingScreen();
 * 	 }
 * });
 *
 * // In the end, this is transformed for React as this, when composed:
 * class MyComponent extends React.Component {
 *   componentWillMount() {
 *     const { user, redirectToLandingScreen } = this.props;
 * 	   if (user && !user.anonymous) {
 * 	   	 redirectToLandingScreen();
 * 	   }
 *   }
 *
 *   render() {
 *     // ...
 *   }
 * }
 *
 * @param {Object} spec - React lifecycle methods, stored as properties on the object. See `lifecycleMethods` above.
 */
function lifecycle(spec) {
	const functionalSpec = lifecycleMethods
		.reduce((oldSpec, methodName) => {
			const newSpec = { ...oldSpec }; // Clone
			const method = newSpec[methodName];

			if (isFunction(method)) {
				newSpec[methodName] = function (...args) { // eslint-disable-line
					return method.apply(this, [this.props, ...args]);
				};
			}

			return newSpec;
		}, spec);

	return recomposeLifecycle(functionalSpec);
}

import loggingConfig from 'specs/render-logging-config';

const countRender = new Map();
const diffRender = new Map();
function updateCountRender(componentId) {
	let count = countRender.get(componentId) || 0;
	count++;
	countRender.set(componentId, count);

	return count;
}
function setCurrentProps(componentId, props) {
	const oldProps = diffRender.get(componentId);
	diffRender.set(componentId, props);
	return oldProps;
}
function logRender() {
	if (process.env.NODE_ENV === 'development' && process.env.LOG_COMPONENT_RENDER) {
		return function wrap(component) {
			return withProps(
				(props) => {
					const displayName = getDisplayName(component);

					let enableLog = true;
					if (loggingConfig) {
						enableLog = loggingConfig.include ? enableLog && includes(loggingConfig.include, displayName) : enableLog;
						enableLog = loggingConfig.exclude ? enableLog && !includes(loggingConfig.exclude, displayName) : enableLog;
					}

					if (enableLog) {
						const count = updateCountRender(displayName);
						const diff = require('shallow-diff')(setCurrentProps(displayName, props) || {}, props);
						console.groupCollapsed(`render: ${displayName} (${count})`);
						console.log('props', props);
						console.log('updated', [...diff.added, ...diff.updated, ...diff.deleted]);
						console.log('propsDiff', diff);
						console.groupEnd();
					}

					return props;
				}
			)(component);
		};
	}
	return c => c;
}

export {
	compose,
	lifecycle,
	pure,
	setPropTypes,
	defaultProps,
	withState,
	setDisplayName,
	getDisplayName,
	withProps,
	toClass,
	branch,
	renderNothing,
	renderComponent,
	withHandlers,
	logRender,
};
