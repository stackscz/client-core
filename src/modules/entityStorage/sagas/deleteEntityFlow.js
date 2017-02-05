import { uniq, concat } from 'lodash';
import rethrowError from 'client-core/src/utils/rethrowError';
import apiServiceResultTypeInvariant from 'client-core/src/utils/apiServiceResultTypeInvariant';
import type { Error } from 'client-core/src/types/Error';

import { call, select, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

import { apiContextSelector, apiServiceSelector } from 'client-core/src/modules/api/selectors';
import { authContextSelector } from 'client-core/src/modules/auth/selectors';
import {
	modelIdPropertyNameSelectorFactory,
	modelSchemaSelectorFactory,
} from 'client-core/src/modules/entityDescriptors/selectors';
import {
	DELETE_ENTITY,
	receiveDeleteEntitySuccess,
	receiveDeleteEntityFailure,
} from '../actions';

import getComposingModels from 'client-core/src/modules/resources/utils/getComposingModels';
import getDependentModels from 'client-core/src/modules/resources/utils/getDependentModels';

import getAssociationsProperties from 'client-core/src/modules/resources/utils/getAssociationsProperties';

export function *deleteEntityTask(action) {
	const { modelName, entityId, where } = action.payload;
	const apiContext = yield select(apiContextSelector);
	const ApiService = yield select(apiServiceSelector);
	const authContext = yield select(authContextSelector);
	const idPropertyNameSelector = yield call(modelIdPropertyNameSelectorFactory, modelName);
	const idPropertyName = yield select(idPropertyNameSelector);

	let finalWhere = where;
	if (!finalWhere) {
		finalWhere = {};
	}
	finalWhere = {
		...finalWhere,
		[idPropertyName]: entityId,
	};

	try {
		yield call(
			ApiService.deleteEntity,
			modelName,
			finalWhere,
			apiContext,
			authContext
		);
	} catch (error) {
		rethrowError(error);
		apiServiceResultTypeInvariant(error, Error);
		yield put(
			receiveDeleteEntityFailure({ modelName, entityId, error })
		);
		return;
	}

	const modelSchema = yield select(modelSchemaSelectorFactory(modelName));

	const cm = getComposingModels(modelSchema);
	const dm = getDependentModels(modelSchema);
	const affectedModelNames = uniq(concat(cm, dm));

	const relations = getAssociationsProperties(modelSchema);
	yield put(
		receiveDeleteEntitySuccess(
			{
				modelNames: affectedModelNames,
				entityId,
				relations,
			}
		)
	);
}

export default function *deleteEntityFlow() {
	yield call(takeEvery, DELETE_ENTITY, deleteEntityTask);
}
