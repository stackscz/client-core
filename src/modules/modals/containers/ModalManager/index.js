import React, { PropTypes as T } from 'react';
// import ReactTransitionGroup from 'react-addons-transition-group';
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
		{/*<ReactTransitionGroup component="div" className={be(moduleName, 'content')}>*/}
		{
			!isEmpty(modals)
				? map(modals, (modalElement, modalId) => React.cloneElement(modalElement, {
				modalId,
				key: modalId,
			}))
				: null
		}
		{/*</ReactTransitionGroup>*/}
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
