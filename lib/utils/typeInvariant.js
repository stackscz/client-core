'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = typeInvariant;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _tcombValidation = require('tcomb-validation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function typeInvariant(value, type, message) {
	(0, _invariant2.default)(type && _tcomb2.default.isType(type), '"type" passed into typeInvariant must be tcomb type');
	var validationResult = (0, _tcombValidation.validate)(value, type);
	var firstError = validationResult.firstError();
	var tcombMessage = firstError && firstError.message;

	for (var _len = arguments.length, messageParams = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
		messageParams[_key - 3] = arguments[_key];
	}

	_invariant2.default.apply(undefined, [validationResult.isValid(), 'Type validation failed:\n\n' + tcombMessage + '\n\n' + (message ? 'INFO: ' + message : '')].concat(messageParams));
}