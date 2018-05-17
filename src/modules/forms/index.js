import createReducer from 'redux-form/lib/createReducer';
import plain from './plainStructure';
import formFieldsSchemas from './reducer';

export default {
	reducers: {
		form: createReducer(plain),
		formFieldsSchemas,
	}
};
