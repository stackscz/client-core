'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

exports.default = stripReadOnlyProperties;

var _getReadOnlyProperties = require('./getReadOnlyProperties');

var _getReadOnlyProperties2 = _interopRequireDefault(_getReadOnlyProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stripReadOnlyProperties(entity, schema) {
	return (0, _omit3.default)(entity, (0, _getReadOnlyProperties2.default)(schema));
}