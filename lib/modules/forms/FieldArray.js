'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createFieldArray = require('redux-form/lib/createFieldArray');

var _createFieldArray2 = _interopRequireDefault(_createFieldArray);

var _plainStructure = require('./plainStructure');

var _plainStructure2 = _interopRequireDefault(_plainStructure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createFieldArray2.default)(_plainStructure2.default);