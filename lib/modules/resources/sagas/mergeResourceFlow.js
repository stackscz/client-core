'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends5 = require('babel-runtime/helpers/extends');

var _extends6 = _interopRequireDefault(_extends5);

var _isUndefined2 = require('lodash/isUndefined');

var _isUndefined3 = _interopRequireDefault(_isUndefined2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

exports.mergeResourceTask = mergeResourceTask;
exports.default = mergeResourceFlow;

var _effects = require('redux-saga/effects');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _hash = require('../../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _resolveSubschema = require('../utils/resolveSubschema');

var _resolveSubschema2 = _interopRequireDefault(_resolveSubschema);

var _normalizeResource3 = require('../utils/normalizeResource');

var _normalizeResource4 = _interopRequireDefault(_normalizeResource3);

var _getIdPropertyName = require('../utils/getIdPropertyName');

var _getIdPropertyName2 = _interopRequireDefault(_getIdPropertyName);

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

var _findRelationLinkName = require('../utils/findRelationLinkName');

var _findRelationLinkName2 = _interopRequireDefault(_findRelationLinkName);

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [mergeResourceTask, mergeResourceFlow].map(_regenerator2.default.mark);

// TODO rename `collectionLink` to `parentLink`
function mergeResourceTask(_ref) {
	var _ref$payload = _ref.payload,
	    link = _ref$payload.link,
	    inputData = _ref$payload.data,
	    collectionLink = _ref$payload.collectionLink;

	var resourceSchema, collectionResourceSchema, finalResourceSchema, idPropertyName, idValueFormLink, idValueFormData, data, r, selfLinkName, selfLink, resource, dataToReceive, _normalizeResource, resourceNormalizationResult, normalizedEntities, validAtTime, apiDescription, ApiService, dataToTransfer, callResult, receivedSelfLink, _normalizeResource2, receivedResourceNormalizationResult, receivedNormalizedEntities;

	return _regenerator2.default.wrap(function mergeResourceTask$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					if (!link) {
						_context.next = 6;
						break;
					}

					_context.next = 3;
					return (0, _effects.select)((0, _selectors.resourceSchemaSelectorFactory)(link));

				case 3:
					_context.t0 = _context.sent;
					_context.next = 7;
					break;

				case 6:
					_context.t0 = undefined;

				case 7:
					resourceSchema = _context.t0;
					collectionResourceSchema = void 0;

					if (!collectionLink) {
						_context.next = 13;
						break;
					}

					_context.next = 12;
					return (0, _effects.select)((0, _selectors.resourceSchemaSelectorFactory)(collectionLink));

				case 12:
					collectionResourceSchema = _context.sent;

				case 13:
					finalResourceSchema = resourceSchema || (0, _resolveSubschema2.default)(collectionResourceSchema, 'items');

					// determine id property of model by name

					idPropertyName = (0, _getIdPropertyName2.default)(finalResourceSchema);
					// let resourceHasOwnIdProperty = true;

					if (!idPropertyName) {
						idPropertyName = _constants.INTERNAL_ID_PROPERTY_NAME;
						finalResourceSchema = (0, _extends6.default)({}, finalResourceSchema, {
							properties: (0, _extends6.default)({}, (0, _get3.default)(finalResourceSchema, 'properties', {}), (0, _defineProperty3.default)({}, _constants.INTERNAL_ID_PROPERTY_NAME, {
								type: 'string'
							})),
							'x-idPropertyName': _constants.INTERNAL_ID_PROPERTY_NAME
						});
						// resourceHasOwnIdProperty = false;
					}

					// patch data
					idValueFormLink = (0, _get3.default)(link, ['params', idPropertyName]);
					idValueFormData = (0, _get3.default)(inputData, idPropertyName);

					(0, _invariant2.default)(!(idValueFormLink && idValueFormData), 'mergeEntityFlow: do not set both `link` and entity id in merged data');
					data = inputData;

					if (idValueFormLink) {
						data = (0, _extends6.default)({}, data, (0, _defineProperty3.default)({}, idPropertyName, idValueFormLink));
					}

					if ((0, _get3.default)(data, idPropertyName)) {
						_context.next = 26;
						break;
					}

					_context.next = 24;
					return (0, _effects.call)(Math.random);

				case 24:
					r = _context.sent;

					data = (0, _extends6.default)({}, data, (0, _defineProperty3.default)({}, idPropertyName, (0, _hash2.default)({ data: data, r: r })));

				case 26:

					// determine resource self link
					selfLinkName = (0, _findRelationLinkName2.default)(finalResourceSchema, 'self');
					selfLink = link;

					if (selfLink) {
						_context.next = 32;
						break;
					}

					_context.next = 31;
					return (0, _effects.select)((0, _selectors.normalizedLinkSelectorFactory)({
						name: selfLinkName,
						params: data
					}));

				case 31:
					selfLink = _context.sent;

				case 32:

					(0, _invariant2.default)(selfLink, 'Could not compute self link for name `%s`', selfLinkName);

					_context.next = 35;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(selfLink));

				case 35:
					resource = _context.sent;


					//
					// Normalize entity data.
					//
					dataToReceive = (0, _stripWriteOnlyProperties2.default)(data, finalResourceSchema);
					_normalizeResource = (0, _normalizeResource4.default)(dataToReceive, finalResourceSchema), resourceNormalizationResult = _normalizeResource.result, normalizedEntities = _normalizeResource.entities;
					_context.next = 40;
					return (0, _effects.call)(_sideEffects.now);

				case 40:
					validAtTime = _context.sent;
					_context.next = 43;
					return (0, _effects.put)((0, _actions.receiveEntities)({
						normalizedEntities: normalizedEntities,
						validAtTime: validAtTime.format()
					}));

				case 43:
					_context.next = 45;
					return (0, _effects.put)((0, _actions2.persistResource)({
						link: selfLink,
						transient: (0, _isUndefined3.default)(link) || (0, _get3.default)(resource, 'transient', false),
						links: {},
						content: resourceNormalizationResult,
						collectionLink: collectionLink
					}));

				case 45:
					_context.next = 47;
					return (0, _effects.select)((0, _selectors.resourceSelectorFactory)(selfLink));

				case 47:
					resource = _context.sent;
					_context.next = 50;
					return (0, _effects.select)(_selectors.resourcesModuleStateSelector);

				case 50:
					apiDescription = _context.sent;
					_context.next = 53;
					return (0, _effects.select)(_selectors.resourcesServiceSelector);

				case 53:
					ApiService = _context.sent;
					dataToTransfer = (0, _stripReadOnlyProperties2.default)(data, finalResourceSchema);
					callResult = void 0;

					if (!(resource && !resource.transient)) {
						_context.next = 71;
						break;
					}

					_context.prev = 57;
					_context.next = 60;
					return (0, _effects.call)(ApiService.putResource, {
						apiDescription: apiDescription,
						link: selfLink,
						data: dataToTransfer
					});

				case 60:
					callResult = _context.sent;
					_context.next = 69;
					break;

				case 63:
					_context.prev = 63;
					_context.t1 = _context['catch'](57);

					(0, _rethrowError2.default)(_context.t1);
					_context.next = 68;
					return (0, _effects.put)((0, _actions2.receivePersistResourceFailure)({
						link: selfLink,
						error: _context.t1
					}));

				case 68:
					return _context.abrupt('return');

				case 69:
					_context.next = 87;
					break;

				case 71:
					if (!collectionLink) {
						_context.next = 86;
						break;
					}

					_context.prev = 72;
					_context.next = 75;
					return (0, _effects.call)(ApiService.postResource, {
						apiDescription: apiDescription,
						link: collectionLink,
						data: dataToTransfer
					});

				case 75:
					callResult = _context.sent;
					_context.next = 84;
					break;

				case 78:
					_context.prev = 78;
					_context.t2 = _context['catch'](72);

					(0, _rethrowError2.default)(_context.t2);
					_context.next = 83;
					return (0, _effects.put)((0, _actions2.receivePersistResourceFailure)({
						link: selfLink,
						error: _context.t2
					}));

				case 83:
					return _context.abrupt('return');

				case 84:
					_context.next = 87;
					break;

				case 86:
					throw 'Could not determine how to merge entity';

				case 87:

					callResult = (0, _extends6.default)({}, selfLink.params, callResult);

					_context.next = 90;
					return (0, _effects.select)((0, _selectors.normalizedLinkSelectorFactory)({
						name: selfLinkName,
						params: callResult
					}));

				case 90:
					receivedSelfLink = _context.sent;
					_normalizeResource2 = (0, _normalizeResource4.default)(callResult, finalResourceSchema), receivedResourceNormalizationResult = _normalizeResource2.result, receivedNormalizedEntities = _normalizeResource2.entities;
					_context.next = 94;
					return (0, _effects.put)((0, _actions.receiveEntities)({
						normalizedEntities: receivedNormalizedEntities,
						validAtTime: validAtTime.format()
					}));

				case 94:
					_context.next = 96;
					return (0, _effects.put)((0, _actions2.receivePersistResourceSuccess)({
						link: receivedSelfLink,
						content: receivedResourceNormalizationResult,
						collectionLink: collectionLink,
						transientLink: selfLink,
						transientContent: resourceNormalizationResult
					}));

				case 96:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this, [[57, 63], [72, 78]]);
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