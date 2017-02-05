import createService from 'client-core/src/utils/createModule';
import reducer from './reducer';
import * as actions from './actions';

export default createService('api', reducer, []);
export {
	actions,
	reducer,
};
