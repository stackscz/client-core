'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extractParams = function extractParams(string) {
	return (0, _reduce3.default)(string.split('&'), function (buffer, value) {
		var parts = value.split('=');
		return (0, _extends4.default)({}, buffer, (0, _defineProperty3.default)({}, parts[0], parts[1]));
	}, {});
};

exports.default = (0, _recompose.compose)((0, _recompose.withProps)(function (_ref) {
	var location = _ref.location;

	var querystring = (0, _get3.default)(location, 'search', '').replace('?', '');
	var queryParams = extractParams(querystring);

	var hashQuerystring = (0, _get3.default)(location, 'hash', '').replace('#', '');
	var hashQueryParams = extractParams(hashQuerystring);

	return {
		queryParams: queryParams,
		hashQueryParams: hashQueryParams
	};
}));