import { put, take, select } from 'redux-saga/effects';
import { reduce } from 'lodash';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
	closeModal,
} from 'modules/modals/actions';

export default function *closeModalOnNavigate() {
	while (true) { // eslint-disable-line no-constant-condition
		yield take(LOCATION_CHANGE);
		const modals = yield select(state => state.modals);

		const modalIds = reduce(modals, (acc, modal, id) => {
			if (!modal.persistent) {
				acc.push(id);
			}

			return acc;
		}, []);

		for (let i = 0; i < modalIds.length; i++) {
			yield put(closeModal(modalIds[i]));
		}
	}
}
