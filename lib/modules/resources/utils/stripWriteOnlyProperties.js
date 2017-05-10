'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

exports.default = stripWriteOnlyProperties;

var _getWriteOnlyProperties = require('./getWriteOnlyProperties');

var _getWriteOnlyProperties2 = _interopRequireDefault(_getWriteOnlyProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stripWriteOnlyProperties(entity, schema) {
	return (0, _omit3.default)(entity, (0, _getWriteOnlyProperties2.default)(schema));
}