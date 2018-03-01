import { reducer as formReducer } from 'redux-form';
import formFieldsSchemas from './reducer';

export default {
	reducers: {
		form: formReducer,
		formFieldsSchemas,
	}
};
