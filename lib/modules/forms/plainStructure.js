'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _isEqualWith2 = require('lodash/isEqualWith');

var _isEqualWith3 = _interopRequireDefault(_isEqualWith2);

var _plain = require('redux-form/lib/structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var structure = (0, _extends3.default)({}, _plain2.default, {
	deepEqual: function deepEqual(object, objectOther) {
		return (0, _isEqualWith3.default)(object, objectOther, function (obj, other) {
			if (obj === other) return true;

			if (_immutable2.default.Iterable.isIterable(obj) || _immutable2.default.Iterable.isIterable(other)) {
				return obj === other;
			}

			if (!obj && !other) {
				var objIsEmpty = obj === null || obj === undefined || obj === '';
				var otherIsEmpty = other === null || other === undefined || other === '';
				return objIsEmpty === otherIsEmpty;
			}

			if (obj && other && obj._error !== other._error) return false;
			if (obj && other && obj._warning !== other._warning) return false;
			if (_react2.default.isValidElement(obj) || _react2.default.isValidElement(other)) return false;
		});
	}
});

exports.default = structure;