export const OPEN_MODAL = 'client-core/modals/OPEN_MODAL';
export function openModal(modalId, contentElement, persistent) {
	return { type: OPEN_MODAL, payload: { modalId, contentElement, persistent } };
}

export const CLOSE_MODAL = 'client-core/modals/CLOSE_MODAL';
export function closeModal(modalId) {
	return { type: CLOSE_MODAL, payload: { modalId } };
}
