export function isViewportScrollbarVisible() {
	return document.body.scrollHeight > document.body.clientHeight;
}

export function getViewportScrollBarsDimensions() {
	return {
		vertical: {
			width: window.innerWidth - document.body.clientWidth,
		},
		horizontal: {
			height: window.innerHeight - document.body.clientHeight,
		},
	};
}
