import React from 'react';
import container from 'client-core/src/utils/decorators/container';
import { compose, lifecycle } from 'recompose';
import { closeModal } from 'client-core/src/modules/modals/actions';

const mapDispatchToProps = (dispatch, { modalId }) => ({
	handleCloseModal: () => dispatch(closeModal(modalId)),
});

export default compose(
	container(
		null,
		mapDispatchToProps
	),
	lifecycle(
		{
			componentWillMount() {
				// debugger;
				if (document) {
					this.removeCloseListener = document.addEventListener('keyup', (event) => {
						if (event.keyCode === 27) {
							this.props.handleCloseModal()
						}
					});
				}
			},
			componentWillUnmount() {
				if (this.removeCloseListener) {
					this.removeCloseListener();
				}
			},
		}
	),
);
