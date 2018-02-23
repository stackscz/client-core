'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _omitBy2 = require('lodash/omitBy');

var _omitBy3 = _interopRequireDefault(_omitBy2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.default = function (dataToValidate) {
	var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var errorMessages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	var requiredPaths = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
	var notRequiredPaths = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

	_assert(schema, JsonSchema, 'schema');

	_assert(errorMessages, FormErrorMessages, 'errorMessages');

	var validationResult = validator.validate(dataToValidate, schema);
	if (validationResult.valid) {
		return {};
	}

	// console.log('VALIDATING', dataToValidate);

	var dotNotationErrors = validationResult.errors.reduce(function (acc, err) {
		var errorPath = void 0;

		if (err.name === 'allOf' || err.name === 'anyOf') {
			return acc;
		}

		if (err.name === 'required') {
			errorPath = err.property + '.' + err.argument;

			if (err.schema.type === 'object') {
				var errTypePath = 'schema.properties.' + err.argument + '.type';
				var errType = _dotObject2.default.pick(errTypePath, err);

				// Redux `FieldArray` needs a special treatment.
				if (errType === 'array') {
					errorPath += '._error';
				}
			}
		} else {
			errorPath = err.property;

			if (err.schema.type === 'array') {
				errorPath += '._error';
			}
		}

		errorPath = errorPath.replace('instance.', '');

		// errorMessages don't care about which element exactly has the error.
		var errorMessagePath = (errorPath + '.' + err.name).replace(/\[\d+\]/, '');

		var errorMessage = _dotObject2.default.pick(errorMessagePath, errorMessages) || '' + err.name;

		return (0, _mergeWithArrays3.default)(acc, (0, _defineProperty3.default)({}, errorPath, [errorPath].errorMessage ? [errorPath].errorMessage + ' ' + errorMessage : errorMessage));
	}, {});

	dotNotationErrors = notRequiredPaths.reduce(function (acc, errorKey) {
		if (acc[errorKey] === 'required') {
			delete acc[errorKey];
		}
		return acc;
	}, dotNotationErrors);

	dotNotationErrors = requiredPaths.reduce(function (acc, errorKey) {
		if (acc[errorKey] !== 'required' && !(0, _get3.default)(dataToValidate, errorKey)) {
			acc[errorKey] = 'required';
		}
		return acc;
	}, dotNotationErrors);

	dotNotationErrors = (0, _omitBy3.default)(dotNotationErrors, function (error, key) {
		return key.endsWith('typeName');
	});

	var errors = _dotObject2.default.object(dotNotationErrors);

	// console.log('NEW ERRORS', errors);

	return errors;
};

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _jsonschema = require('jsonschema');

var _dotObject = require('dot-object');

var _dotObject2 = _interopRequireDefault(_dotObject);

var _mergeWithArrays2 = require('./mergeWithArrays');

var _mergeWithArrays3 = _interopRequireDefault(_mergeWithArrays2);

var _JsonSchema = require('./types/JsonSchema');

var _modulesFormsTypesJsonSchema = _interopRequireWildcard(_JsonSchema);

var _FormErrorMessages = require('./types/FormErrorMessages');

var _modulesFormsTypesFormErrorMessages = _interopRequireWildcard(_FormErrorMessages);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JsonSchema = _modulesFormsTypesJsonSchema.JsonSchema || _tcomb2.default.Any;
var FormErrorMessages = _modulesFormsTypesFormErrorMessages.FormErrorMessages || _tcomb2.default.Any;


var validator = new _jsonschema.Validator();
var originalAnyOf = validator.attributes.anyOf;
validator.attributes.anyOf = function (data, schema) {
	for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		args[_key - 2] = arguments[_key];
	}

	// @FIXME use only option in typeName enum as match for typeName instead of schema title, make typeName property name configurable
	if (!(0, _isPlainObject3.default)(data) || !data.__typename) {
		return originalAnyOf.apply(this, [data, schema].concat(args));
	}
	var typeName = data.__typename;
	var concreteSchema = schema.anyOf.reduce(function (acc, subSchema) {
		return subSchema.title === typeName ? subSchema : acc;
	}, null);
	if (!concreteSchema) {
		return originalAnyOf.apply(this, [data, schema].concat(args));
	}
	return this.validate.apply(this, [data, concreteSchema].concat(args));
};

var originalRequired = validator.attributes.required;
validator.attributes.required = function (data, schema, options, ctx) {
	var readOnly = (0, _get3.default)(schema, 'x-readOnly');
	var finalSchema = schema;
	if (Array.isArray(readOnly)) {
		var required = _without3.default.apply(undefined, [(0, _get3.default)(schema, 'required', [])].concat((0, _toConsumableArray3.default)((0, _get3.default)(schema, 'x-readOnly', []))));
		finalSchema = (0, _extends3.default)({}, schema, { required: required });
	}
	var finalData = data && (0, _omitBy3.default)(data, function (v) {
		return v === null;
	});
	return originalRequired.apply(this, [finalData, finalSchema, options, ctx]);
};

var originalType = validator.attributes.type;
validator.attributes.type = function (data, schema, options, ctx) {
	if (data === null) {
		return [];
	}
	return originalType.apply(this, [data, schema, options, ctx]);
};

function _assert(x, type, name) {
	if (false) {
		_tcomb2.default.fail = function (message) {
			console.warn(message);
		};
	}

	if (_tcomb2.default.isType(type) && type.meta.kind !== 'struct') {
		if (!type.is(x)) {
			type(x, [name + ': ' + _tcomb2.default.getTypeName(type)]);
		}
	} else if (!(x instanceof type)) {
		_tcomb2.default.fail('Invalid value ' + _tcomb2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcomb2.default.getTypeName(type) + ')');
	}

	return x;
}