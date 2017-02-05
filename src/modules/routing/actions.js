export const NAVIGATE = 'client-core/routing/NAVIGATE';
export function navigate({ location, action }) {
	return { type: NAVIGATE, payload: { location, action } };
}
