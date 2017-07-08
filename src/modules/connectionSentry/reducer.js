import Immutable from 'seamless-immutable';
import t from 'tcomb';
import { get as g, reduce, isUndefined } from 'lodash';

import createReducer from 'utils/createReducer';
import hash from 'utils/hash';
import {
	RECEIVE_FETCH_RESOURCE_FAILURE,
	FETCH_RESOURCE,
	RECEIVE_RESOURCE,
} from 'modules/resources/actions';

import { CHECK_CONNECTION } from './actions';
import isInternalServerError from './utils/isInternalServerError';
import isNetworkError from './utils/isNetworkError';

export default createReducer(
	t.struct(
		{
			isOnline: t.Boolean,
			reconnectProbeResourceLink: t.maybe(t.Object),
			reconnectProbeResourceRetriesCount: t.Integer,
			reconnectProbeResourceLastFailureTime: t.maybe(t.String),
		}
	),
	Immutable.from(
		{
			isOnline: true,
			reconnectProbeResourceLink: null,
			reconnectProbeResourceRetriesCount: 0,
			reconnectProbeResourceLastFailureTime: null,
		}
	),
	{
		[RECEIVE_FETCH_RESOURCE_FAILURE]: (state, { payload: { link, error, timestamp } }) => {
			const current = g(state, 'reconnectProbeResourceLink');
			if (!current && (isNetworkError(error) || isInternalServerError(error))) {
				return state
					.set('reconnectProbeResourceLink', link)
					.set('reconnectProbeResourceLastFailureTime', timestamp);
			}
			return state;
		},
		[FETCH_RESOURCE]: (state, { payload: { link, timestamp } }) => {
			const current = g(state, 'reconnectProbeResourceLink');
			const reconnectProbeResourceRetriesCount = g(state, 'reconnectProbeResourceRetriesCount');
			if (current && hash(current) === hash(link)) {
				return state
					.set('reconnectProbeResourceRetriesCount', reconnectProbeResourceRetriesCount + 1)
					.set('reconnectProbeResourceLastFailureTime', timestamp);
			}
			return state;
		},
		[RECEIVE_RESOURCE]: (state, { payload: { link } }) => {
			const current = g(state, 'reconnectProbeResourceLink');
			if (current && hash(current) === hash(link)) {
				return state
					.set('reconnectProbeResourceLink', null)
					.set('reconnectProbeResourceRetriesCount', 0)
					.set('reconnectProbeResourceLastFailureTime', null);
			}
			return state;
		},
		[CHECK_CONNECTION]: (state) => {
			const reconnectProbeResourceRetriesCount = g(state, 'reconnectProbeResourceRetriesCount');
			if (reconnectProbeResourceRetriesCount) {
				return state
					.set('reconnectProbeResourceRetriesCount', reconnectProbeResourceRetriesCount - 1);
			}
			return state;
		},
	},
	'connectionSentry',
);
