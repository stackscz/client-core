'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapDispatchToProps = function mapDispatchToProps(dispatch, _ref) {
	var modalId = _ref.modalId;
	return {
		handleCloseModal: function handleCloseModal() {
			return dispatch((0, _actions.closeModal)(modalId));
		}
	};
};

exports.default = (0, _reactRedux.connect)(null, mapDispatchToProps);