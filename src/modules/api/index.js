import createModule from 'client-core/src/utils/createModule';
import reducer from './reducer';
import * as actions from './actions';

export default createModule('api', reducer, []);
export {
	actions,
	reducer,
};
