import React from 'react';
import container from 'client-core/src/utils/decorators/container';
import { closeModal } from 'client-core/src/modules/modals/actions';

const mapDispatchToProps = (dispatch, { modalId }) => ({
	handleCloseModal: () => dispatch(closeModal(modalId)),
});

export default container(
	null,
	mapDispatchToProps
);
