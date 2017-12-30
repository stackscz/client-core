import React from 'react';
import T from 'prop-types';
import { isEmpty, map } from 'lodash';
import { connect } from 'react-redux';
import { compose, setPropTypes } from 'recompose';

import { bm, be } from 'utils/bliss';

const renderModalManager = ({
	moduleName = 'ModalManager',
	modifiers = '',
	modals,
} = {}) => (
	<div className={bm(moduleName, modifiers)}>
		{!isEmpty(modals) && (
			<div className={be(moduleName, 'modals')}>
				{map(modals, (modalElement, modalId) => {
					return React.cloneElement(modalElement.contentElement, {
						modalId,
						key: modalId,
					})
				})}
			</div>
		)}
	</div>
);

const modalManagerPropTypes = {
	modals: T.object,
};

const mapStateToProps = state => ({
	modals: state.modals,
});

const ModalManager = compose(
	connect(mapStateToProps),
	setPropTypes(modalManagerPropTypes),
)(renderModalManager);

export default ModalManager;
