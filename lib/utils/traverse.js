'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var traverse = function traverse(valueVisitedKey, value, context, callback) {
	var nextContext = { key: context.key, parent: context.parent, node: value };
	callback(value, nextContext);
	if ((0, _isObject3.default)(value) && !value[valueVisitedKey]) {
		value[valueVisitedKey] = true;
		for (var i = 0, keys = (0, _keys2.default)(value), l = keys.length; i < l; ++i) {
			traverse(valueVisitedKey, value[keys[i]], {
				node: context.node,
				key: keys[i],
				parent: nextContext
			}, callback);
		}
	}
};

var traverseExport = function traverseExport(value) {
	return {
		forEach: function forEach(callback) {
			var valueVisitedKey = (0, _symbol2.default)('traverse value visited');
			return traverse(valueVisitedKey, value, {}, callback);
		}
	};
};

exports.default = traverseExport;