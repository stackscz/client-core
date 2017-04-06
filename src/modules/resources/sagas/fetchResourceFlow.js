import { get as g } from 'lodash';
import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import hash from 'client-core/src/utils/hash';
import normalizeResource from 'client-core/src/modules/resources/utils/normalizeResource';

import { receiveEntities } from 'client-core/src/modules/entityStorage/actions';
import { now } from 'client-core/src/utils/sideEffects';

import { resourcesServiceSelector, resourcesModuleStateSelector } from 'client-core/src/modules/resources/selectors';
import findResourceLinksNames from 'client-core/src/modules/resources/utils/findResourceLinksNames';
import findRelationLinkName from 'client-core/src/modules/resources/utils/findRelationLinkName';
import rethrowError from 'client-core/src/utils/rethrowError';

import {
	FETCH_RESOURCE,
	ensureResource,
	receiveFetchResourceFailure,
	receiveResource,
} from '../actions';
import {
	resolvedLinkSelectorFactory,
	resourceSchemaSelectorFactory,
} from '../selectors';

export function *fetchResourceTask(action) {
	const { link, relations } = action.payload;

	const apiDescription = yield select(resourcesModuleStateSelector);
	const ResourcesService = yield select(resourcesServiceSelector);

	const resourceSchema = yield select(resourceSchemaSelectorFactory(link));

	const requestedLinks = {};
	if (relations) {
		for (let relationIndex = 0; relationIndex < relations.length; relationIndex++) {
			const relationSpec = relations[relationIndex].split('.');
			const rel = relationSpec.shift();
			const relationLinkName = findRelationLinkName(resourceSchema, rel);
			requestedLinks[rel] = true;
			yield put(
				ensureResource(
					{
						link: {
							name: relationLinkName,
							params: g(link, 'params', {}),
						},
						relations: relationSpec.length ?
							[
								relationSpec.join('.'),
							] :
							undefined,
					}
				)
			);
		}
	}

	let resource;
	try {
		resource = yield call(
			ResourcesService.getResource,
			{
				apiDescription,
				link,
			}
		);
	} catch (error) {
		rethrowError(error);
		yield put(
			receiveFetchResourceFailure(
				{
					link,
					error,
				}
			)
		);
		return;
	}


	const linksRels = findResourceLinksNames(resourceSchema);
	const links = {};
	const linksRelsEntries = Object.entries(linksRels);
	for (let linkIndex = 0; linkIndex < linksRelsEntries.length; linkIndex++) {
		const [relName, linkName] = linksRelsEntries[linkIndex];
		if (!requestedLinks[relName]) {
			continue;
		}
		const { name, params } = yield select(
			resolvedLinkSelectorFactory(
				{
					name: linkName,
					params: resource,
				}
			)
		);
		links[relName] = hash({ name, params });
	}

	const {
		result,
		entities,
	} = normalizeResource(
		resource,
		resourceSchema,
	);

	const time = yield call(now);
	const validAtTime = time.format();

	yield put(
		receiveEntities(
			{
				refs: {},
				normalizedEntities: entities,
				validAtTime,
			}
		)
	);
	yield put(
		receiveResource(
			{
				link,
				links,
				content: result,
			}
		)
	);
}

export default function *fetchResourceFlow() {
	yield call(takeEvery, FETCH_RESOURCE, fetchResourceTask);
}
