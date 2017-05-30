'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.ensureResourceTask = ensureResourceTask;
exports.default = ensureResourceFlow;

var _effects = require('redux-saga/effects');

var _actions = require('../actions');

var _selectors = require('../selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [ensureResourceTask, ensureResourceFlow].map(_regenerator2.default.mark);

function ensureResourceTask(action) {
	var _action$payload, link, relations, resource, resourceData;

	return _regenerator2.default.wrap(function ensureResourceTask$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_action$payload = action.payload, link = _action$payload.link, relations = _action$payload.relations;

					// TODO implement invalidation ;)

					console.log('ENSURING RESOURCE', link);
					_context.next = 4;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(link));

				case 4:
					resource = _context.sent;
					_context.next = 7;
					return (0, _effects.select)((0, _selectors.resourceDataSelectorFactory)(link));

				case 7:
					resourceData = _context.sent;

					if (!(!resource.fetched || !resourceData && !resource.error && !resource.fetching)) {
						_context.next = 12;
						break;
					}

					console.log('FETCHING RESOURCE', link, resource);
					_context.next = 12;
					return (0, _effects.put)((0, _actions.fetchResource)({ link: link, relations: relations }));

				case 12:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

function ensureResourceFlow() {
	return _regenerator2.default.wrap(function ensureResourceFlow$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.takeEvery)(_actions.ENSURE_RESOURCE, ensureResourceTask);

				case 2:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}