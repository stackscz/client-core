'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createField = require('redux-form/lib/createField');

var _createField2 = _interopRequireDefault(_createField);

var _plainStructure = require('./plainStructure');

var _plainStructure2 = _interopRequireDefault(_plainStructure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createField2.default)(_plainStructure2.default);