import React, { PropTypes as T } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import { isEmpty, map } from 'lodash';

import container from 'client-core/src/utils/decorators/container';

import { compose, setPropTypes } from 'client-core/src/utils/react-fp';
import { bm, be } from 'client-core/src/utils/bem';

const renderModalManager = ({
	moduleName = 'ModalManager',
	modifiers = '',
	modals,
} = {}) => (
	<div className={bm(moduleName, modifiers)}>
		<ReactTransitionGroup component="div" className={be(moduleName, 'content')}>
			{
				!isEmpty(modals)
					? map(modals, (modalElement, modalId) => React.cloneElement(modalElement, {
						modalId,
						key: modalId,
					}))
					: null
			}
		</ReactTransitionGroup>
	</div>
);

const modalManagerPropTypes = {
	modals: T.object,
};

const mapStateToProps = state => ({
	modals: state.modals,
});

const ModalManager = compose(
	container(mapStateToProps),
	setPropTypes(modalManagerPropTypes),
)(renderModalManager);

export default ModalManager;
