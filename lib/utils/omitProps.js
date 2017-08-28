'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pipe2 = require('lodash/fp/pipe');

var _pipe3 = _interopRequireDefault(_pipe2);

var _omit2 = require('lodash/fp/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _mapProps2 = require('recompose/mapProps');

var _mapProps3 = _interopRequireDefault(_mapProps2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var omitProps = (0, _pipe3.default)(_omit3.default, _mapProps3.default);

exports.default = omitProps;