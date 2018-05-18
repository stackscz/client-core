'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isDirty = require('redux-form/lib/selectors/isDirty');

var _isDirty2 = _interopRequireDefault(_isDirty);

var _plainStructure = require('./plainStructure');

var _plainStructure2 = _interopRequireDefault(_plainStructure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _isDirty2.default)(_plainStructure2.default);