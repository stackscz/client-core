import createService from 'client-core/src/utils/createModule';
import reducer from './reducer';
import * as actions from './actions';
import sagas from './sagas';

export default createService('resources', reducer, sagas);
export {
	reducer,
	actions,
	sagas,
};
