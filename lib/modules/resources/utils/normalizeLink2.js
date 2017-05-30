'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _size2 = require('lodash/size');

var _size3 = _interopRequireDefault(_size2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (link, resources) {
	var linkName = link.name,
	    linkParams = link.params;

	var parameters = (0, _get3.default)(resources, [linkName, 'parameters'], []);

	var finalParams = {};
	(0, _each3.default)(parameters, function (parameter) {
		var linkParamPath = (0, _get3.default)(parameter, 'x-linkParam');
		var paramValue = (0, _get3.default)(linkParams, linkParamPath);
		if (paramValue) {
			(0, _set3.default)(finalParams, linkParamPath, '' + paramValue);
		}
	});

	var result = {
		name: linkName
	};
	if ((0, _size3.default)(finalParams)) {
		result.params = finalParams;
	}
	return result;
};