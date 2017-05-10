'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
// Used to check objects for own properties
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Hashes a string
var hash = function hash(string) {
	var resultHash = 0;
	string = string.toString();
	for (var i = 0; i < string.length; i++) {
		resultHash = (resultHash << 5) - resultHash + string.charCodeAt(i) & 0xFFFFFFFF;
	}
	return resultHash;
};

// Deep hashes an object
var object = function object(obj) {
	//
	if (typeof obj.getTime === 'function') {
		return obj.getTime();
	}

	var result = 0;

	for (var property in obj) {
		if (hasOwnProperty.call(obj, property)) {
			result += hash(property + value(obj[property]));
		}
	}

	return result;
};

var value = function value(_value) {

	var type = _value == undefined ? undefined : typeof _value === 'undefined' ? 'undefined' : (0, _typeof3.default)(_value);
	// Does a type check on the passed in value and calls the appropriate hash method
	return MAPPER[type] ? MAPPER[type](_value) + hash(type) : 0;
};

var MAPPER = {
	string: hash,
	number: hash,
	boolean: hash,
	object: object
	// functions are excluded because they are not representative of the state of an object
	// types 'undefined' or 'null' will have a hash of 0
};

exports.default = value;