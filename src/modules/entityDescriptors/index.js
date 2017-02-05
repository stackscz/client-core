import createService from 'client-core/src/utils/createModule';
import reducer from './reducer';
import * as actions from './actions';
import mainSagas, * as sagas from './sagas';

export default createService('entityDescriptors', reducer, mainSagas);
export {
	reducer,
	actions,
	sagas,
};
