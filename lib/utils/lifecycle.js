'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _lifecycle2 = require('recompose/lifecycle');

var _lifecycle3 = _interopRequireDefault(_lifecycle2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { isFunction, includes } from 'lodash';
var lifecycleMethods = ['getInitialState', 'componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount'];

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
  var functionalSpec = lifecycleMethods.reduce(function (oldSpec, methodName) {
    var newSpec = (0, _extends3.default)({}, oldSpec); // Clone
    var method = newSpec[methodName];

    if ((0, _isFunction3.default)(method)) {
      newSpec[methodName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // eslint-disable-line
        return method.apply(this, [this.props].concat(args));
      };
    }

    return newSpec;
  }, spec);

  return (0, _lifecycle3.default)(functionalSpec);
}

// import loggingConfig from 'one-definitions/render-logging-config';
//
// const countRender = new Map();
// const diffRender = new Map();
// function updateCountRender(componentId) {
// 	let count = countRender.get(componentId) || 0;
// 	count++;
// 	countRender.set(componentId, count);
//
// 	return count;
// }
// function setCurrentProps(componentId, props) {
// 	const oldProps = diffRender.get(componentId);
// 	diffRender.set(componentId, props);
// 	return oldProps;
// }
// function logRender() {
// 	if (process.env.NODE_ENV === 'development' && process.env.LOG_COMPONENT_RENDER) {
// 		return function wrap(component) {
// 			return withProps(
// 				(props) => {
// 					const displayName = getDisplayName(component);
//
// 					let enableLog = true;
// 					if (loggingConfig) {
// 						enableLog = loggingConfig.include ? enableLog && includes(loggingConfig.include, displayName) : enableLog;
// 						enableLog = loggingConfig.exclude ? enableLog && !includes(loggingConfig.exclude, displayName) : enableLog;
// 					}
//
// 					if (enableLog) {
// 						const count = updateCountRender(displayName);
// 						const diff = require('shallow-diff')(setCurrentProps(displayName, props) || {}, props);
// 						console.groupCollapsed(`render: ${displayName} (${count})`);
// 						console.log('props', props);
// 						console.log('updated', [...diff.added, ...diff.updated, ...diff.deleted]);
// 						console.log('propsDiff', diff);
// 						console.groupEnd();
// 					}
//
// 					return props;
// 				}
// 			)(component);
// 		};
// 	}
// 	return c => c;
// }

exports.default = lifecycle;