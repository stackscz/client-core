import { has } from 'lodash';

export const modalOpenedSelector =
	(state) =>
		has(state, ['modals', 'preview']);
