import React, { PropTypes as T } from 'react';

import './index.sass';

const stopPropagation = (e) => {
	e.stopPropagation()
};

const Modal = ({ children, onClose: handleClose }) => {
	return (
		<div className="Modal">
			<div className="Modal-backdrop" onClick={handleClose}>
				<div className="Modal-contentContainer">
					<div className="Modal-content" onClick={stopPropagation}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onClose: T.func,
};

export default Modal;
