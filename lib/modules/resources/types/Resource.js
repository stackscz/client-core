'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Resource = undefined;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _ResourceLink = require('./ResourceLink');

var _modulesResourcesTypesResourceLink = _interopRequireWildcard(_ResourceLink);

var _AppError = require('../../../types/AppError');

var _typesAppError = _interopRequireWildcard(_AppError);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResourceLink = _modulesResourcesTypesResourceLink.ResourceLink || _tcomb2.default.Any;
var AppError = _typesAppError.AppError || _tcomb2.default.Any;

var Resource = exports.Resource = _tcomb2.default.interface({
	link: ResourceLink,
	fetched: _tcomb2.default.Boolean,
	error: _tcomb2.default.maybe(AppError),
	transient: _tcomb2.default.Boolean,
	fetching: _tcomb2.default.Boolean,
	persisting: _tcomb2.default.Boolean
}, 'Resource');