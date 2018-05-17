'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPristine = require('redux-form/lib/selectors/isPristine');

var _isPristine2 = _interopRequireDefault(_isPristine);

var _plainStructure = require('./plainStructure');

var _plainStructure2 = _interopRequireDefault(_plainStructure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _isPristine2.default)(_plainStructure2.default);