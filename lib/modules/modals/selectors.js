'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.modalOpenedSelector = undefined;

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modalOpenedSelector = exports.modalOpenedSelector = function modalOpenedSelector(state) {
	return (0, _has3.default)(state, ['modals', 'preview']);
};