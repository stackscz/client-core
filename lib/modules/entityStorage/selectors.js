'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.entityListSelectorFactory = exports.entitySelectorFactory = exports.collectionContentSelectorFactory = exports.collectionSelectorFactory = exports.entityDictionarySelector = undefined;

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _fastMemoize = require('fast-memoize');

var _fastMemoize2 = _interopRequireDefault(_fastMemoize);

var _reselect = require('reselect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entityDictionarySelector = exports.entityDictionarySelector = function entityDictionarySelector(state) {
	return (0, _get3.default)(state, ['entityStorage', 'entities']);
};

var collectionSelectorFactory = exports.collectionSelectorFactory = function collectionSelectorFactory(modelName) {
	return function (state) {
		return (0, _get3.default)(state, ['entityStorage', 'entities', modelName]);
	};
};

var collectionContentSelectorFactory = exports.collectionContentSelectorFactory = (0, _fastMemoize2.default)(function (modelName) {
	return (0, _reselect.createSelector)(collectionSelectorFactory(modelName), function (collection) {
		return (0, _keys3.default)(collection);
	} // => an array of entityIds
	);
});

var entitySelectorFactory = exports.entitySelectorFactory = function entitySelectorFactory(modelName, entityId) {
	return function (state) {
		return (0, _get3.default)(state, ['entityStorage', 'entities', modelName, entityId]);
	};
};

var entityListSelectorFactory = exports.entityListSelectorFactory = (0, _fastMemoize2.default)(function (modelName, ids) {
	return (0, _reselect.createSelector)(collectionSelectorFactory(modelName), function (collection) {
		if (!ids || !collection) {
			return undefined;
		}

		return (0, _map3.default)(ids, function (id) {
			return (0, _get3.default)(collection, id);
		});
	});
});