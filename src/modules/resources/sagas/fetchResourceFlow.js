import { get as g } from 'lodash';
import { call, select, put, takeEvery } from 'redux-saga/effects';
import hash from 'utils/hash';
import normalizeResource2 from 'modules/resources/utils/normalizeResource2';
import denormalizeResource2 from 'modules/resources/utils/denormalizeResource2';

import { receiveEntities } from 'modules/entityStorage/actions';
import { now } from 'utils/sideEffects';

import { resourcesServiceSelector, resourcesModuleStateSelector } from 'modules/resources/selectors';
import findRelationLinkName from 'modules/resources/utils/findRelationLinkName';
import rethrowError from 'utils/rethrowError';

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

export function* fetchResourceTask(action) {
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
						relations: relationSpec.length ? [
							relationSpec.join('.'),
						] : undefined,
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

	const entities = normalizeResource2(
		resourceSchema,
		apiDescription.paths,
		link,
		resource,
	);

	// debugger;
	// const denormalizationResult = denormalizeResource2(
	// 	resourceSchema,
	// 	apiDescription.paths,
	// 	entities,
	// 	1,
	// 	link,
	// );
	// console.warn(
	// 	result,
	// 	entities,
	// 	denormalizationResult,
	// );
	// debugger;

	// const {
	// 	result,
	// 	entities,
	// } = normalizeResource(
	// 	resource,
	// 	resourceSchema,
	// );

	const time = yield call(now);
	const validAtTime = time.format();

	yield put(
		receiveEntities(
			{
				normalizedEntities: entities,
				validAtTime,
			}
		)
	);
	yield put(receiveResource({ link }));
}

export default function* fetchResourceFlow() {
	yield takeEvery(FETCH_RESOURCE, fetchResourceTask);
}
