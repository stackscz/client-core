'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _createReducer;

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _hash = require('../../utils/hash');

var _hash2 = _interopRequireDefault(_hash);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _Resource = require('./types/Resource');

var _modulesResourcesTypesResource = _interopRequireWildcard(_Resource);

var _ResourceLink = require('./types/ResourceLink');

var _modulesResourcesTypesResourceLink = _interopRequireWildcard(_ResourceLink);

var _ResourcesService = require('./types/ResourcesService');

var _modulesResourcesTypesResourcesService = _interopRequireWildcard(_ResourcesService);

var _AppError = require('../../types/AppError');

var _typesAppError = _interopRequireWildcard(_AppError);

var _createReducer2 = require('../../utils/createReducer');

var _createReducer3 = _interopRequireDefault(_createReducer2);

var _actions = require('./actions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Resource = _modulesResourcesTypesResource.Resource || _tcomb2.default.Any;
var ResourceLink = _modulesResourcesTypesResourceLink.ResourceLink || _tcomb2.default.Any;
var ResourcesService = _modulesResourcesTypesResourcesService.ResourcesService || _tcomb2.default.Any;
var AppError = _typesAppError.AppError || _tcomb2.default.Any;


var defaultResource = _seamlessImmutable2.default.from({
	link: undefined,
	links: {},
	content: undefined,
	transient: false,
	fetching: false,
	persisting: false,
	error: undefined
});

var resourceDefaults = function resourceDefaults(state, resourceId, updateData) {
	var newResource = (0, _get3.default)(state, ['resources', resourceId], _seamlessImmutable2.default.from(defaultResource));
	return newResource.merge(updateData);
};

var removeResourceHandlerSpec = [_tcomb2.default.struct({
	link: ResourceLink,
	collectionsLinks: _tcomb2.default.maybe(_tcomb2.default.list(ResourceLink))
}), function (state, _ref) {
	var _ref$payload = _ref.payload,
	    link = _ref$payload.link,
	    collectionsLinks = _ref$payload.collectionsLinks;

	var newState = state;
	var resourceId = (0, _hash2.default)(link);
	var resource = (0, _get3.default)(newState, ['resources', resourceId]);
	if (resource) {
		var idToRemove = (0, _get3.default)(resource, 'content');
		if (!(0, _isArray3.default)(idToRemove)) {
			(0, _each3.default)(collectionsLinks, function (collectionLink) {
				var collectionResourceId = (0, _hash2.default)(collectionLink);
				var collectionResource = (0, _get3.default)(newState, ['resources', collectionResourceId]);
				if (collectionResource) {
					var collectionResourceContent = (0, _get3.default)(collectionResource, 'content');
					if ((0, _isArray3.default)(collectionResourceContent) && collectionResourceContent.includes(idToRemove)) {
						newState = newState.updateIn(['resources', collectionResourceId, 'content'], function (currentCollectionResourceContent) {
							return currentCollectionResourceContent.filter(function (containedEntityId) {
								return containedEntityId !== idToRemove;
							});
						});
					}
				}
			});
		}
	}

	return newState.updateIn(['resources'], function (currentResources) {
		return currentResources.without(resourceId);
	});
}];

exports.default = (0, _createReducer3.default)(_tcomb2.default.struct({
	service: ResourcesService,
	paths: _tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.Object),
	definitions: _tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.Object),
	resources: _tcomb2.default.dict(_tcomb2.default.String, Resource)
}), _seamlessImmutable2.default.from({
	paths: {},
	definitions: {},
	resources: {}
}), (_createReducer = {}, (0, _defineProperty3.default)(_createReducer, _actions.ENSURE_RESOURCE, [_tcomb2.default.struct({
	link: ResourceLink,
	relations: _tcomb2.default.maybe(_tcomb2.default.list(_tcomb2.default.String))
}), function (state, action) {
	var link = action.payload.link;

	var newState = state;

	var resourceId = (0, _hash2.default)(link);
	var existingResource = (0, _get3.default)(state, ['resources', resourceId]);
	if (!existingResource) {
		newState = newState.setIn(['resources', resourceId], defaultResource).setIn(['resources', resourceId, 'link'], link);
	}
	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.FETCH_RESOURCE, [_tcomb2.default.struct({
	link: ResourceLink
}), function (state, action) {
	var link = action.payload.link;

	var newState = state;

	var resourceId = (0, _hash2.default)(link);
	var existingResource = (0, _get3.default)(state, ['resources', resourceId]);
	if (!existingResource) {
		newState = newState.setIn(['resources', resourceId], defaultResource).setIn(['resources', resourceId, 'link'], link);
	}

	newState = newState.setIn(['resources', resourceId, 'fetching'], true).setIn(['resources', resourceId, 'error'], undefined);

	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_FETCH_RESOURCE_FAILURE, [_tcomb2.default.struct({
	link: ResourceLink,
	error: AppError
}), function (state, action) {
	var _action$payload = action.payload,
	    link = _action$payload.link,
	    error = _action$payload.error;

	var newState = state;
	var resourceId = (0, _hash2.default)(link);
	var existingResource = (0, _get3.default)(state, ['resources', resourceId]);
	if (existingResource) {
		newState = newState.setIn(['resources', resourceId, 'fetching'], false).setIn(['resources', resourceId, 'error'], error);
	}
	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_RESOURCE, [_tcomb2.default.struct({
	link: ResourceLink,
	transientLink: _tcomb2.default.maybe(ResourceLink),
	content: _tcomb2.default.Any
}), function (state, action) {
	var _action$payload2 = action.payload,
	    link = _action$payload2.link,
	    content = _action$payload2.content,
	    transientLink = _action$payload2.transientLink;

	var resourceId = (0, _hash2.default)(link);
	var newState = state;
	if (transientLink) {
		var transientResourceId = (0, _hash2.default)(transientLink);
		newState = newState.set('resources', newState.resources.without(transientResourceId));
	}
	newState = newState.updateIn(['resources', resourceId], function (resource) {
		var baseResource = resource;
		if (!baseResource) {
			baseResource = _seamlessImmutable2.default.from(defaultResource);
		}
		return baseResource.merge({
			link: link,
			content: content,
			error: undefined,
			fetching: false
		}, { deep: true });
	});
	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.MERGE_RESOURCE, [_tcomb2.default.struct({
	link: _tcomb2.default.maybe(ResourceLink),
	collectionLink: _tcomb2.default.maybe(ResourceLink),
	data: _tcomb2.default.Any
})]), (0, _defineProperty3.default)(_createReducer, _actions.PERSIST_RESOURCE, [_tcomb2.default.struct({
	link: ResourceLink,
	transientLink: _tcomb2.default.maybe(ResourceLink),
	links: _tcomb2.default.dict(_tcomb2.default.String, _tcomb2.default.String),
	content: _tcomb2.default.Any
}), function (state, _ref2) {
	var _ref2$payload = _ref2.payload,
	    link = _ref2$payload.link,
	    links = _ref2$payload.links,
	    content = _ref2$payload.content,
	    transient = _ref2$payload.transient,
	    collectionLink = _ref2$payload.collectionLink;

	var resourceId = (0, _hash2.default)(link);
	var newState = state;
	newState = newState.updateIn(['resources', resourceId], function (resource) {
		var baseResource = resource;
		if (!baseResource) {
			baseResource = _seamlessImmutable2.default.from(defaultResource);
		}
		return baseResource.merge({
			link: link,
			content: content,
			links: links,
			error: undefined,
			transient: transient,
			persisting: true
		});
	});

	// update parent collection
	if (collectionLink) {
		var collectionResourceId = (0, _hash2.default)(collectionLink);
		var collectionResource = (0, _get3.default)(newState, ['resources', collectionResourceId]);
		if (!collectionResource) {
			newState = newState.setIn(['resources', collectionResourceId], resourceDefaults(state, collectionResourceId, {
				link: collectionLink,
				content: []
			}));
		}

		newState = newState.updateIn(['resources', collectionResourceId], function (updatedCollectionResource) {
			var updatedContent = updatedCollectionResource.content;
			if ((0, _isArray3.default)(updatedCollectionResource.content) && !(0, _includes3.default)(updatedContent, content)) {
				updatedContent = updatedContent.concat([content]);
			}
			return updatedCollectionResource.set('content', updatedContent);
		});
	}

	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_PERSIST_RESOURCE_SUCCESS, [_tcomb2.default.struct({
	link: ResourceLink,
	content: _tcomb2.default.Any,
	collectionLink: _tcomb2.default.maybe(ResourceLink),
	transientLink: _tcomb2.default.maybe(ResourceLink),
	transientContent: _tcomb2.default.Any
}), function (state, _ref3) {
	var _ref3$payload = _ref3.payload,
	    link = _ref3$payload.link,
	    transientLink = _ref3$payload.transientLink,
	    transientContent = _ref3$payload.transientContent,
	    content = _ref3$payload.content,
	    collectionLink = _ref3$payload.collectionLink;

	var newState = state;
	var resourceId = (0, _hash2.default)(link);
	newState = newState.setIn(['resources', resourceId], resourceDefaults(state, resourceId, {
		link: link,
		content: content,
		persisting: false
	}));

	if (transientLink) {
		var transientResourceId = (0, _hash2.default)(transientLink);
		if (transientResourceId !== resourceId) {
			var transientResource = (0, _get3.default)(newState, ['resources', transientResourceId]);
			if (transientResource) {
				newState = newState.updateIn(['resources'], function (currentResources) {
					return currentResources.without(transientResourceId);
				});
			}
		}
	}

	if (collectionLink) {
		var collectionResourceId = (0, _hash2.default)(collectionLink);
		var collectionResource = (0, _get3.default)(newState, ['resources', collectionResourceId]);
		if (collectionResource) {
			newState = newState.updateIn(['resources', collectionResourceId, 'content'], function (collectionContent) {
				return collectionContent.map(function (containedEntityId) {
					return containedEntityId === transientContent ? content : containedEntityId;
				});
			});
		}
	}

	return newState;
}]), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_PERSIST_RESOURCE_FAILURE, [_tcomb2.default.struct({
	link: ResourceLink,
	content: _tcomb2.default.Any
}), function (state, _ref4) {
	var _ref4$payload = _ref4.payload,
	    link = _ref4$payload.link,
	    error = _ref4$payload.error;

	var resourceId = (0, _hash2.default)(link);
	return state.setIn(['resources', resourceId, 'error'], error).setIn(['resources', resourceId, 'persisting'], false);
}]), (0, _defineProperty3.default)(_createReducer, _actions.DEFINE_RESOURCE, [_tcomb2.default.struct({
	link: ResourceLink,
	content: _tcomb2.default.Any
}), function (state, _ref5) {
	var _ref5$payload = _ref5.payload,
	    link = _ref5$payload.link,
	    content = _ref5$payload.content;

	var resourceId = (0, _hash2.default)(link);
	var newResource = resourceDefaults(state, resourceId, {
		content: content
	});
	return state.setIn(['resources', resourceId], newResource);
}]), (0, _defineProperty3.default)(_createReducer, _actions.DELETE_RESOURCE, [_tcomb2.default.struct({
	link: ResourceLink,
	collectionsLinks: _tcomb2.default.maybe(_tcomb2.default.list(ResourceLink))
}), function (state, _ref6) {
	var link = _ref6.payload.link;

	var resourceId = (0, _hash2.default)(link);
	var newResource = resourceDefaults(state, resourceId, {
		link: link,
		deleting: true
	});
	return state.setIn(['resources', resourceId], newResource);
}]), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_DELETE_RESOURCE_SUCCESS, removeResourceHandlerSpec), (0, _defineProperty3.default)(_createReducer, _actions.RECEIVE_DELETE_RESOURCE_FAILURE, [_tcomb2.default.struct({
	link: ResourceLink,
	error: AppError
}), function (state, _ref7) {
	var _ref7$payload = _ref7.payload,
	    link = _ref7$payload.link,
	    error = _ref7$payload.error;

	var resourceId = (0, _hash2.default)(link);
	return state.setIn(['resources', resourceId, 'error'], error).setIn(['resources', resourceId, 'deleting'], false);
}]), (0, _defineProperty3.default)(_createReducer, _actions.FORGET_RESOURCE, removeResourceHandlerSpec), _createReducer), 'resources');