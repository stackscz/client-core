'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.deleteResourceTask = deleteResourceTask;
exports.default = deleteResourceFlow;

var _effects = require('redux-saga/effects');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _rethrowError = require('../../../utils/rethrowError');

var _rethrowError2 = _interopRequireDefault(_rethrowError);

var _getIdPropertyName = require('../utils/getIdPropertyName');

var _getIdPropertyName2 = _interopRequireDefault(_getIdPropertyName);

var _selectors = require('../selectors');

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [deleteResourceTask, deleteResourceFlow].map(_regenerator2.default.mark);

function deleteResourceTask(_ref) {
	var _ref$payload = _ref.payload,
	    link = _ref$payload.link,
	    collectionsLinks = _ref$payload.collectionsLinks;
	var apiDescription, resourceSchema, idPropertyName, entityId, resource, resourceContent, ResourcesService;
	return _regenerator2.default.wrap(function deleteResourceTask$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _effects.select)(_selectors.resourcesModuleStateSelector);

				case 2:
					apiDescription = _context.sent;
					_context.next = 5;
					return (0, _effects.select)((0, _selectors.resourceSchemaSelectorFactory)(link));

				case 5:
					resourceSchema = _context.sent;


					// determine id property of model by name
					idPropertyName = (0, _getIdPropertyName2.default)(resourceSchema);
					entityId = (0, _get3.default)(link, ['params', idPropertyName]);
					// invariant(entityId, 'Couldn\'t determine entityId to delete');

					_context.next = 10;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(link));

				case 10:
					resource = _context.sent;
					resourceContent = (0, _get3.default)(resource, 'content');

					if (resourceContent) {
						_context.next = 15;
						break;
					}

					_context.next = 15;
					return (0, _effects.put)((0, _actions.defineResource)({
						link: link
					}));

				case 15:
					_context.next = 17;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(link));

				case 17:
					resource = _context.sent;

					resourceContent = (0, _get3.default)(resource, 'content');
					_context.next = 21;
					return (0, _effects.select)(_selectors.resourcesServiceSelector);

				case 21:
					ResourcesService = _context.sent;
					_context.prev = 22;
					_context.next = 25;
					return (0, _effects.call)(ResourcesService.deleteResource, {
						apiDescription: apiDescription,
						link: link
					});

				case 25:
					_context.next = 33;
					break;

				case 27:
					_context.prev = 27;
					_context.t0 = _context['catch'](22);

					(0, _rethrowError2.default)(_context.t0);
					_context.next = 32;
					return (0, _effects.put)((0, _actions.receiveDeleteResourceFailure)({ link: link, error: _context.t0 }));

				case 32:
					return _context.abrupt('return');

				case 33:
					_context.next = 35;
					return (0, _effects.put)((0, _actions.receiveDeleteResourceSuccess)({ link: link, collectionsLinks: collectionsLinks }));

				case 35:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this, [[22, 27]]);
}

function deleteResourceFlow() {
	return _regenerator2.default.wrap(function deleteResourceFlow$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.takeEvery)(_actions.DELETE_RESOURCE, deleteResourceTask);

				case 2:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}