'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

exports.default = closeModalOnNavigate;

var _effects = require('redux-saga/effects');

var _actions = require('../../routing/actions');

var _actions2 = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [closeModalOnNavigate].map(_regenerator2.default.mark);

function closeModalOnNavigate() {
	var modals, modalIds, i;
	return _regenerator2.default.wrap(function closeModalOnNavigate$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					if (!true) {
						_context.next = 16;
						break;
					}

					_context.next = 3;
					return (0, _effects.take)(_actions.NAVIGATE);

				case 3:
					_context.next = 5;
					return (0, _effects.select)(function (state) {
						return state.modals;
					});

				case 5:
					modals = _context.sent;
					modalIds = (0, _reduce3.default)(modals, function (acc, modal, id) {
						if (!modal.persistent) {
							acc.push(id);
						}

						return acc;
					}, []);
					i = 0;

				case 8:
					if (!(i < modalIds.length)) {
						_context.next = 14;
						break;
					}

					_context.next = 11;
					return (0, _effects.put)((0, _actions2.closeModal)(modalIds[i]));

				case 11:
					i++;
					_context.next = 8;
					break;

				case 14:
					_context.next = 0;
					break;

				case 16:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}