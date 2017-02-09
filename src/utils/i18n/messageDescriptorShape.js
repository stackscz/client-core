import { PropTypes as T } from 'react';

export default T.shape({
	id: T.string.isRequired,
	defaultMessage: T.string.isRequired,
	description: T.string,
});
