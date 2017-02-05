import { get as g } from 'lodash';

export const apiContextSelector =
	state =>
		g(state, ['api']);

export const apiServiceSelector =
	state =>
		g(state, ['api', 'service']);
