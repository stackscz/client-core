'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.openModal = openModal;
exports.closeModal = closeModal;
var OPEN_MODAL = exports.OPEN_MODAL = 'client-core/modals/OPEN_MODAL';
function openModal(modalId, contentElement, persistent) {
	return { type: OPEN_MODAL, payload: { modalId: modalId, contentElement: contentElement, persistent: persistent } };
}

var CLOSE_MODAL = exports.CLOSE_MODAL = 'client-core/modals/CLOSE_MODAL';
function closeModal(modalId) {
	return { type: CLOSE_MODAL, payload: { modalId: modalId } };
}