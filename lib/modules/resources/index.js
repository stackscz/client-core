'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sagas = exports.actions = exports.reducer = undefined;

var _createModule = require('../../utils/createModule');

var _createModule2 = _interopRequireDefault(_createModule);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _sagas = require('./sagas');

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _createModule2.default)('resources', _reducer2.default, _sagas2.default);
exports.reducer = _reducer2.default;
exports.actions = actions;
exports.sagas = _sagas2.default;