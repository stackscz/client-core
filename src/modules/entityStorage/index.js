import createModule from 'client-core/src/utils/createModule';
import reducer from './reducer';
import * as actions from './actions';

export default createModule('entityStorage', reducer);
export {
	reducer,
	actions,
};
