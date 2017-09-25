'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pipe2 = require('lodash/fp/pipe');

var _pipe3 = _interopRequireDefault(_pipe2);

var _omit2 = require('lodash/fp/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _recompose = require('recompose');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var omitProps = (0, _pipe3.default)(_omit3.default, _recompose.mapProps);

exports.default = omitProps;