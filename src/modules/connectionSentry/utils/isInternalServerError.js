import { get as g } from 'lodash';

export default (error) => {
	return g(error, 'code') === 500;
};
