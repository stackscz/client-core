'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.now = undefined;

var _dateFns = require('date-fns');

var now = function now() {
	return {
		format: function format() {
			return (0, _dateFns.format)(new Date());
		}
	};
};

exports.now = now;