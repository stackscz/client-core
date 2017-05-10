'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ensureResourceFlow = require('./ensureResourceFlow');

var _ensureResourceFlow2 = _interopRequireDefault(_ensureResourceFlow);

var _fetchResourceFlow = require('./fetchResourceFlow');

var _fetchResourceFlow2 = _interopRequireDefault(_fetchResourceFlow);

var _mergeResourceFlow = require('./mergeResourceFlow');

var _mergeResourceFlow2 = _interopRequireDefault(_mergeResourceFlow);

var _deleteResourceFlow = require('./deleteResourceFlow');

var _deleteResourceFlow2 = _interopRequireDefault(_deleteResourceFlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_ensureResourceFlow2.default, _fetchResourceFlow2.default, _mergeResourceFlow2.default, _deleteResourceFlow2.default];