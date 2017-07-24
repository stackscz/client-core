'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.fetchResourceTask = fetchResourceTask;
exports.default = fetchResourceFlow;

var _effects = require('redux-saga/effects');

var _normalizeResource = require('../utils/normalizeResource2');

var _normalizeResource2 = _interopRequireDefault(_normalizeResource);

var _validateResource = require('../utils/validateResource');

var _validateResource2 = _interopRequireDefault(_validateResource);

var _actions = require('../../entityStorage/actions');

var _sideEffects = require('../../../utils/sideEffects');

var _selectors = require('../selectors');

var _findRelationLinkName = require('../utils/findRelationLinkName');

var _findRelationLinkName2 = _interopRequireDefault(_findRelationLinkName);

var _rethrowError = require('../../../utils/rethrowError');

var _rethrowError2 = _interopRequireDefault(_rethrowError);

var _actions2 = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [fetchResourceTask, fetchResourceFlow].map(_regenerator2.default.mark);

function fetchResourceTask(action) {
	var _action$payload, link, relations, apiDescription, ResourcesService, resourceSchema, requestedLinks, relationIndex, relationSpec, rel, relationLinkName, resource, entities, time, validAtTime;

	return _regenerator2.default.wrap(function fetchResourceTask$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					_action$payload = action.payload, link = _action$payload.link, relations = _action$payload.relations;
					_context.next = 3;
					return (0, _effects.select)(_selectors.resourcesModuleStateSelector);

				case 3:
					apiDescription = _context.sent;
					_context.next = 6;
					return (0, _effects.select)(_selectors.resourcesServiceSelector);

				case 6:
					ResourcesService = _context.sent;
					_context.next = 9;
					return (0, _effects.select)((0, _selectors.resourceSchemaSelectorFactory)(link));

				case 9:
					resourceSchema = _context.sent;
					requestedLinks = {};

					if (!relations) {
						_context.next = 23;
						break;
					}

					relationIndex = 0;

				case 13:
					if (!(relationIndex < relations.length)) {
						_context.next = 23;
						break;
					}

					relationSpec = relations[relationIndex].split('.');
					rel = relationSpec.shift();
					relationLinkName = (0, _findRelationLinkName2.default)(resourceSchema, rel);

					requestedLinks[rel] = true;
					_context.next = 20;
					return (0, _effects.put)((0, _actions2.ensureResource)({
						link: {
							name: relationLinkName,
							params: (0, _get3.default)(link, 'params', {})
						},
						relations: relationSpec.length ? [relationSpec.join('.')] : undefined
					}));

				case 20:
					relationIndex++;
					_context.next = 13;
					break;

				case 23:
					resource = void 0;
					_context.prev = 24;
					_context.next = 27;
					return (0, _effects.call)(ResourcesService.getResource, {
						apiDescription: apiDescription,
						link: link
					});

				case 27:
					resource = _context.sent;
					_context.next = 36;
					break;

				case 30:
					_context.prev = 30;
					_context.t0 = _context['catch'](24);

					(0, _rethrowError2.default)(_context.t0);
					_context.next = 35;
					return (0, _effects.put)((0, _actions2.receiveFetchResourceFailure)({
						link: link,
						error: _context.t0
					}));

				case 35:
					return _context.abrupt('return');

				case 36:
					_context.prev = 36;

					(0, _validateResource2.default)(resource, resourceSchema);
					_context.next = 46;
					break;

				case 40:
					_context.prev = 40;
					_context.t1 = _context['catch'](36);

					(0, _rethrowError2.default)(_context.t1);
					_context.next = 45;
					return (0, _effects.put)((0, _actions2.receiveFetchResourceFailure)({
						link: link,
						error: _context.t1
					}));

				case 45:
					return _context.abrupt('return');

				case 46:
					entities = (0, _normalizeResource2.default)(resourceSchema, apiDescription.paths, link, resource);
					_context.next = 49;
					return (0, _effects.call)(_sideEffects.now);

				case 49:
					time = _context.sent;
					validAtTime = time.format();
					_context.next = 53;
					return (0, _effects.put)((0, _actions.receiveEntities)({
						normalizedEntities: entities,
						validAtTime: validAtTime
					}));

				case 53:
					_context.next = 55;
					return (0, _effects.put)((0, _actions2.receiveResource)({ link: link }));

				case 55:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this, [[24, 30], [36, 40]]);
}

function fetchResourceFlow() {
	return _regenerator2.default.wrap(function fetchResourceFlow$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.takeEvery)(_actions2.FETCH_RESOURCE, fetchResourceTask);

				case 2:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}