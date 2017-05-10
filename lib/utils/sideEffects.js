'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.now = undefined;

var _dateFns = require('date-fns');

var _dateFns2 = _interopRequireDefault(_dateFns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var now = function now() {
	return {
		format: function format() {
			return _dateFns2.default.format(new Date());
		}
	};
};

exports.now = now;