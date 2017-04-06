import df from 'date-fns';

const now = () => {
	return {
		format: () => {
			return df.format(new Date());
		},
	};
};

export { now };
