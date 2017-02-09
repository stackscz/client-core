import { put, select, call } from 'redux-saga/effects';
import invariant from 'invariant';
import apiServiceResultTypeInvariant from 'client-core/src/utils/apiServiceResultTypeInvariant';
import rethrowError from 'client-core/src/utils/rethrowError';
import {
	receiveEntityDescriptors,
	receiveEntityDescriptorsFailure,
} from './actions';

import type { DefinitionsDictionary } from 'client-core/src/utils/types/DefinitionsDictionary';
import type { FieldsetsDictionary } from 'client-core/src/utils/types/FieldsetsDictionary';
import type { Error } from 'client-core/src/utils/types/Error';
import t from 'tcomb';

import { apiContextSelector, apiServiceSelector } from 'client-core/src/modules/api/selectors';
import { authContextSelector } from 'client-core/src/modules/auth/selectors';
import { initializedSelector } from 'client-core/src/modules/entityDescriptors/selectors';

import isOfType from 'client-core/src/utils/isOfType';

export function *loadEntityDescriptorsTask() {
	const apiContext = yield select(apiContextSelector);
	const ApiService = yield select(apiServiceSelector);
	invariant(
		ApiService,
		'api module with ApiService must be configured ' +
		'when entityDescriptors are not set in initial state.'
	);
	const authContext = yield select(authContextSelector);
	let entityDescriptors;
	try {
		entityDescriptors = yield call(ApiService.getEntityDescriptors, apiContext, authContext);
	} catch (e) {
		rethrowError(e);
		apiServiceResultTypeInvariant(e, Error);
		yield put(receiveEntityDescriptorsFailure(e));
		return;
	}

	if (
		!isOfType(entityDescriptors, t.struct({
			definitions: DefinitionsDictionary,
			fieldsets: FieldsetsDictionary,
		}))
	) {
		yield put(receiveEntityDescriptorsFailure({
			message: 'Invalid response',
		}));
		return;
	}

	yield put(
		receiveEntityDescriptors(
			entityDescriptors
		)
	);
}

export function *entityDescriptorsFlow() {
	const definitionsInitialized = yield select(initializedSelector);
	if (!definitionsInitialized) {
		yield call(loadEntityDescriptorsTask);
	}
}

export default [entityDescriptorsFlow];
