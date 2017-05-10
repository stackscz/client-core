import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from 'modules/modals/actions';

const mapDispatchToProps = (dispatch, { modalId }) => ({
	handleCloseModal: () => dispatch(closeModal(modalId)),
});

export default connect(
	null,
	mapDispatchToProps
);
