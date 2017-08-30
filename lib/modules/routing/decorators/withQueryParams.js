'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _withProps2 = require('recompose/withProps');

var _withProps3 = _interopRequireDefault(_withProps2);

var _compose2 = require('recompose/compose');

var _compose3 = _interopRequireDefault(_compose2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extractParams = function extractParams(string) {
	return (0, _reduce3.default)(string ? string.split('&') : [], function (buffer, value) {
		var parts = value.split('=');
		try {
			return (0, _extends4.default)({}, buffer, (0, _defineProperty3.default)({}, parts[0], parts[1] === undefined || decodeURIComponent(parts[1])));
		} catch (e) {
			console.warn('Malformed query param encoding for key ' + parts[0]);
			return buffer;
		}
	}, {});
};

exports.default = (0, _compose3.default)(_reactRouter.withRouter, (0, _withProps3.default)(function (_ref) {
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