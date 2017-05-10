'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _mergeWith2 = require('lodash/mergeWith');

var _mergeWith3 = _interopRequireDefault(_mergeWith2);

exports.default = function () {
	for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
		params[_key] = arguments[_key];
	}

	return _mergeWith3.default.apply(undefined, params.concat([mergeWithArrays]));
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeWithArrays = function mergeWithArrays(objValue, srcValue) {
	var merged = (0, _isArray3.default)(objValue) ? objValue.concat(srcValue) : undefined;
	return merged;
};