/*
	Returns string of modifiers based on react-transition-group child transition lifecycle
	'isEntering'
	'isEntering isEnteringActive'
	'isOpened'
	'isLeaving'
	'isLeaving isEnteringActive'
*/
import React from 'react';
import { reduce } from 'lodash';

import withTransitionLifecycle from 'client-core/src/utils/transitionLifecycle';

const transitionLifecycleToModifiers = (transitionLifecycle, transitionModifier = '') =>
	reduce(
		transitionLifecycle,
		(result, val, key) => (val ? `${result} ${key}` : result),
		transitionModifier
	);

const transitionModifiers = ({
	appear = 0,
	enter = 0,
	leave = 0,
	transitionModifier = '',
}) => Component => {
	const decoratedComponent = ({
		transitionLifecycle,
		...props,
	} = {}) => (
		<Component
			{...props}
			transitionModifiers={transitionLifecycleToModifiers(transitionLifecycle, transitionModifier)}
		/>
	);

	return withTransitionLifecycle({
		componentWillAppear: (callback) => {
			setTimeout(callback, appear);
		},
		componentDidAppear: () => {
		},
		componentWillEnter: (callback) => {
			setTimeout(callback, enter);
		},
		componentDidEnter: () => {
		},
		componentWillLeave: (callback) => {
			setTimeout(callback, leave);
		},
		componentDidLeave: () => {
		},
	})(decoratedComponent);
};

export default transitionModifiers;
