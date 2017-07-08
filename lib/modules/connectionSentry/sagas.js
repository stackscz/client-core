'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _reduxSaga = require('redux-saga');

var _effects = require('redux-saga/effects');

var _selectors = require('../resources/selectors');

var _hash = require('../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _actions = require('../resources/actions');

var _selectors2 = require('./selectors');

var _actions2 = require('./actions');

var _getBackoffSeconds = require('./utils/getBackoffSeconds');

var _getBackoffSeconds2 = _interopRequireDefault(_getBackoffSeconds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [watchOnlineStatus, handleReconnectTask, watchServerOrNetworkFetchError].map(_regenerator2.default.mark);
// import { setOnlineStatus } from 'modules/connectionSentry/actions';


var ONLINE_STATUS_ONLINE = 'ONLINE';
var ONLINE_STATUS_OFFLINE = 'OFFLINE';

var takeResourceActionTestFactory = function takeResourceActionTestFactory(actionType, actionLink) {
	return function (_ref) {
		var type = _ref.type,
		    _ref$payload = _ref.payload;
		_ref$payload = _ref$payload === undefined ? {} : _ref$payload;
		var link = _ref$payload.link;

		return type === actionType && (0, _hash2.default)(link) === (0, _hash2.default)(actionLink);
	};
};

var createOnlineStatusChannel = function createOnlineStatusChannel() {
	return (0, _reduxSaga.eventChannel)(function (emitter) {
		var unsubOnline = window.addEventListener('offline', function (e) {
			console.log(e);
			emitter({ payload: ONLINE_STATUS_OFFLINE });
		});

		var unsubOffline = window.addEventListener('online', function (e) {
			console.log(e);
			emitter({ payload: ONLINE_STATUS_ONLINE });
		});

		return function () {
			unsubOnline();
			unsubOffline();
		};
	});
};

function watchOnlineStatus() {
	var ch, _ref2, payload;

	return _regenerator2.default.wrap(function watchOnlineStatus$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					ch = createOnlineStatusChannel();

				case 1:
					if (!true) {
						_context.next = 11;
						break;
					}

					_context.next = 4;
					return (0, _effects.take)(ch);

				case 4:
					_ref2 = _context.sent;
					payload = _ref2.payload;

					if (!(payload === ONLINE_STATUS_ONLINE)) {
						_context.next = 9;
						break;
					}

					_context.next = 9;
					return (0, _effects.put)((0, _actions2.checkConnection)());

				case 9:
					_context.next = 1;
					break;

				case 11:
				case 'end':
					return _context.stop();
			}
		}
	}, _marked[0], this);
}

function handleReconnectTask() {
	var reconnectProbeResourceRetriesCount, reconnectProbeResourceLink, _ref3, success, s, n, failedResources, r;

	return _regenerator2.default.wrap(function handleReconnectTask$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return (0, _effects.select)(_selectors2.reconnectProbeResourceRetriesCountSelector);

				case 2:
					reconnectProbeResourceRetriesCount = _context2.sent;
					_context2.next = 5;
					return (0, _effects.race)({
						delay: (0, _effects.call)(_reduxSaga.delay, (0, _getBackoffSeconds2.default)(reconnectProbeResourceRetriesCount + 1) * 1000),
						manualRetry: (0, _effects.take)(_actions2.CHECK_CONNECTION)
					});

				case 5:
					_context2.next = 7;
					return (0, _effects.select)(function (state) {
						return state.connectionSentry.reconnectProbeResourceLink;
					});

				case 7:
					reconnectProbeResourceLink = _context2.sent;

					if (!reconnectProbeResourceLink) {
						_context2.next = 11;
						break;
					}

					_context2.next = 11;
					return (0, _effects.put)((0, _actions.fetchResource)({ link: reconnectProbeResourceLink }));

				case 11:
					_context2.next = 13;
					return (0, _effects.race)({
						success: (0, _effects.take)(takeResourceActionTestFactory(_actions.RECEIVE_RESOURCE, reconnectProbeResourceLink)),
						failure: (0, _effects.take)(takeResourceActionTestFactory(_actions.RECEIVE_FETCH_RESOURCE_FAILURE, reconnectProbeResourceLink))
					});

				case 13:
					_ref3 = _context2.sent;
					success = _ref3.success;

					if (!success) {
						_context2.next = 26;
						break;
					}

					_context2.next = 18;
					return (0, _effects.select)(_selectors2.resourcesFailedOnServerErrorSelector);

				case 18:
					s = _context2.sent;
					_context2.next = 21;
					return (0, _effects.select)(_selectors2.resourcesFailedOnNetworkErrorSelector);

				case 21:
					n = _context2.sent;
					failedResources = (0, _extends3.default)({}, s, n);
					r = (0, _map3.default)(failedResources, function (failedResource) {
						return (0, _effects.put)((0, _actions.fetchResource)({ link: failedResource.link }));
					});
					_context2.next = 26;
					return r;

				case 26:
				case 'end':
					return _context2.stop();
			}
		}
	}, _marked[1], this);
}

function watchServerOrNetworkFetchError() {
	return _regenerator2.default.wrap(function watchServerOrNetworkFetchError$(_context4) {
		while (1) {
			switch (_context4.prev = _context4.next) {
				case 0:
					_context4.next = 2;
					return (0, _effects.takeEvery)(function (_ref4) {
						var type = _ref4.type,
						    payload = _ref4.payload;

						if (type === _actions.RECEIVE_FETCH_RESOURCE_FAILURE) {
							var errorCode = (0, _get3.default)(payload, 'error.code', 5000);
							return errorCode === 500 || errorCode === 5000;
						}
						return false;
					}, _regenerator2.default.mark(function handleReconnectForProbeResourceTask(action) {
						var link, probeResourceLink, isProbeResource;
						return _regenerator2.default.wrap(function handleReconnectForProbeResourceTask$(_context3) {
							while (1) {
								switch (_context3.prev = _context3.next) {
									case 0:
										link = action.payload.link;
										_context3.next = 3;
										return (0, _effects.select)(_selectors2.reconnectProbeResourceLinkSelector);

									case 3:
										probeResourceLink = _context3.sent;
										isProbeResource = (0, _hash2.default)(probeResourceLink) === (0, _hash2.default)(link);

										if (!isProbeResource) {
											_context3.next = 8;
											break;
										}

										_context3.next = 8;
										return (0, _effects.fork)(handleReconnectTask, action);

									case 8:
									case 'end':
										return _context3.stop();
								}
							}
						}, handleReconnectForProbeResourceTask, this);
					}));

				case 2:
				case 'end':
					return _context4.stop();
			}
		}
	}, _marked[2], this);
}

exports.default = [watchServerOrNetworkFetchError,
// watchFetchResourceSuccess,
watchOnlineStatus];