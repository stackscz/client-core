'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _recompose = require('recompose');

var _bliss = require('../../../../utils/bliss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderModalManager = function renderModalManager() {
	var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	    _ref$moduleName = _ref.moduleName,
	    moduleName = _ref$moduleName === undefined ? 'ModalManager' : _ref$moduleName,
	    _ref$modifiers = _ref.modifiers,
	    modifiers = _ref$modifiers === undefined ? '' : _ref$modifiers,
	    modals = _ref.modals;

	return _react2.default.createElement(
		'div',
		{ className: (0, _bliss.bm)(moduleName, modifiers) },
		!(0, _isEmpty3.default)(modals) && _react2.default.createElement(
			'div',
			{ className: (0, _bliss.be)(moduleName, 'modals') },
			(0, _map3.default)(modals, function (modalElement, modalId) {
				return _react2.default.cloneElement(modalElement.contentElement, {
					modalId: modalId,
					key: modalId
				});
			})
		)
	);
};

var modalManagerPropTypes = {
	modals: _propTypes2.default.object
};

var mapStateToProps = function mapStateToProps(state) {
	return {
		modals: state.modals
	};
};

var ModalManager = (0, _recompose.compose)((0, _reactRedux.connect)(mapStateToProps), (0, _recompose.setPropTypes)(modalManagerPropTypes))(renderModalManager);

exports.default = ModalManager;