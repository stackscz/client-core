import createModule from 'utils/createModule';
import reducer from './reducer';
import * as actions from './actions';
import sagas from './sagas';

export default createModule('connectionSentry', reducer, sagas);
export {
	reducer,
	actions,
};
