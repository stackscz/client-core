import { format } from 'date-fns';

const now = () => {
	return {
		format: () => {
			return format(new Date());
		},
	};
};

export { now };
