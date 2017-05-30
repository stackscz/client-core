'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _identity2 = require('lodash/identity');

var _identity3 = _interopRequireDefault(_identity2);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.mergeResourceTask = mergeResourceTask;
exports.default = mergeResourceFlow;

var _effects = require('redux-saga/effects');

var _resolveSubschema = require('../utils/resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _normalizeResource = require('../utils/normalizeResource2');

var _normalizeResource2 = _interopRequireDefault(_normalizeResource);

var _stripReadOnlyProperties = require('../utils/stripReadOnlyProperties');

var _stripReadOnlyProperties2 = _interopRequireDefault(_stripReadOnlyProperties);

var _stripWriteOnlyProperties = require('../utils/stripWriteOnlyProperties');

var _stripWriteOnlyProperties2 = _interopRequireDefault(_stripWriteOnlyProperties);

var _rethrowError = require('../../../utils/rethrowError');

var _rethrowError2 = _interopRequireDefault(_rethrowError);

var _actions = require('../../entityStorage/actions');

var _sideEffects = require('../../../utils/sideEffects');

var _selectors = require('../selectors');

var _actions2 = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [mergeResourceTask, mergeResourceFlow].map(_regenerator2.default.mark);

var mergeDataMutatorSelector = function mergeDataMutatorSelector(state) {
	return (0, _get3.default)(state, 'resources.mergeDataMutator', _identity3.default);
};

function mergeResourceTask(_ref) {
	var _ref$payload = _ref.payload,
	    link = _ref$payload.link,
	    inputData = _ref$payload.data,
	    parentLink = _ref$payload.parentLink;
	var apiDescription, resource, resourceSchema, parentResourceSchema, finalResourceSchema, dataToReceive, entities, validAtTime, ApiService, mergeDataMutator, dataToTransfer, callResult, receivedEntities;
	return _regenerator2.default.wrap(function mergeResourceTask$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_context.next = 2;
					return (0, _effects.select)(_selectors.resourcesModuleStateSelector);

				case 2:
					apiDescription = _context.sent;
					_context.next = 5;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(link));

				case 5:
					resource = _context.sent;

					if (!(resource && (resource.fetching || resource.persisting || resource.deleting))) {
						_context.next = 9;
						break;
					}

					// resource busy
					console.log('resource busy');
					return _context.abrupt('return');

				case 9:
					if (!link) {
						_context.next = 15;
						break;
					}

					_context.next = 12;
					return (0, _effects.select)((0, _selectors.resourceSchemaSelectorFactory)(link));

				case 12:
					_context.t0 = _context.sent;
					_context.next = 16;
					break;

				case 15:
					_context.t0 = undefined;

				case 16:
					resourceSchema = _context.t0;
					parentResourceSchema = void 0;

					if (!parentLink) {
						_context.next = 22;
						break;
					}

					_context.next = 21;
					return (0, _effects.select)((0, _selectors.resourceSchemaSelectorFactory)(parentLink));

				case 21:
					parentResourceSchema = _context.sent;

				case 22:
					finalResourceSchema = resourceSchema || (0, _resolveSubschema2.default)(parentResourceSchema, 'items');
					dataToReceive = (0, _stripWriteOnlyProperties2.default)(inputData, finalResourceSchema);
					entities = (0, _normalizeResource2.default)(finalResourceSchema, apiDescription.paths, link, dataToReceive);
					_context.next = 27;
					return (0, _effects.call)(_sideEffects.now);

				case 27:
					validAtTime = _context.sent;
					_context.next = 30;
					return (0, _effects.put)((0, _actions.receiveEntities)({
						normalizedEntities: entities,
						validAtTime: validAtTime.format()
					}));

				case 30:
					_context.next = 32;
					return (0, _effects.put)((0, _actions2.persistResource)({
						link: link,
						transient: (0, _isUndefined3.default)(link) || (0, _get3.default)(resource, 'transient', false),
						parentLink: parentLink
					}));

				case 32:
					_context.next = 34;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(link));

				case 34:
					resource = _context.sent;
					_context.next = 37;
					return (0, _effects.select)(_selectors.resourcesServiceSelector);

				case 37:
					ApiService = _context.sent;
					_context.next = 40;
					return (0, _effects.select)(mergeDataMutatorSelector);

				case 40:
					mergeDataMutator = _context.sent;
					dataToTransfer = mergeDataMutator(parentLink || link, (0, _stripReadOnlyProperties2.default)(inputData, finalResourceSchema));
					callResult = void 0;

					if (!(resource && !resource.transient)) {
						_context.next = 58;
						break;
					}

					_context.prev = 44;
					_context.next = 47;
					return (0, _effects.call)(ApiService.putResource, {
						apiDescription: apiDescription,
						link: link,
						data: dataToTransfer
					});

				case 47:
					callResult = _context.sent;
					_context.next = 56;
					break;

				case 50:
					_context.prev = 50;
					_context.t1 = _context['catch'](44);

					(0, _rethrowError2.default)(_context.t1);
					_context.next = 55;
					return (0, _effects.put)((0, _actions2.receivePersistResourceFailure)({
						link: link,
						error: _context.t1
					}));

				case 55:
					return _context.abrupt('return');

				case 56:
					_context.next = 74;
					break;

				case 58:
					if (!parentLink) {
						_context.next = 73;
						break;
					}

					_context.prev = 59;
					_context.next = 62;
					return (0, _effects.call)(ApiService.postResource, {
						apiDescription: apiDescription,
						link: parentLink,
						data: dataToTransfer
					});

				case 62:
					callResult = _context.sent;
					_context.next = 71;
					break;

				case 65:
					_context.prev = 65;
					_context.t2 = _context['catch'](59);

					(0, _rethrowError2.default)(_context.t2);
					_context.next = 70;
					return (0, _effects.put)((0, _actions2.receivePersistResourceFailure)({
						link: link,
						error: _context.t2
					}));

				case 70:
					return _context.abrupt('return');

				case 71:
					_context.next = 74;
					break;

				case 73:
					throw new Error('Could not determine how to merge entity');

				case 74:
					receivedEntities = (0, _normalizeResource2.default)(finalResourceSchema, apiDescription.paths, link, callResult);
					_context.next = 77;
					return (0, _effects.put)((0, _actions.receiveEntities)({
						normalizedEntities: receivedEntities,
						validAtTime: validAtTime.format()
					}));

				case 77:
					_context.next = 79;
					return (0, _effects.put)((0, _actions2.receivePersistResourceSuccess)({
						link: link,
						parentLink: parentLink
					}));

				case 79:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this, [[44, 50], [59, 65]]);
}

function mergeResourceFlow() {
	return _regenerator2.default.wrap(function mergeResourceFlow$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.takeEvery)(_actions2.MERGE_RESOURCE, mergeResourceTask);

				case 2:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}