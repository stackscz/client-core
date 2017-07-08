import { get as g } from 'lodash';
import { compose, withPropsOnChange, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { addSeconds } from 'date-fns';
import {
	reconnectProbeResourceSelector,
	reconnectProbeResourceRetriesCountSelector,
	reconnectProbeResourceLastFailureTimeSelector,
} from '../selectors';
import getBackoffSeconds from '../utils/getBackoffSeconds';
import { checkConnection } from '../actions';

export default compose(
	connect(
		(state) => {
			const reconnectProbeResource = reconnectProbeResourceSelector(state);
			const retriesCount = reconnectProbeResourceRetriesCountSelector(state);
			const lastFailureTime = reconnectProbeResourceLastFailureTimeSelector(state);
			return {
				hasError: !!g(reconnectProbeResource, 'error'),
				retriesCount,
				lastFailureTime,
			};
		},
	),
	withPropsOnChange(
		['retriesCount', 'lastFailureTime'],
		({ retriesCount, lastFailureTime }) => {
			const reconnectionRetryAfter = getBackoffSeconds(retriesCount + 1);
			if (lastFailureTime) {
				return {
					reconnectionRetryAt: addSeconds(new Date(lastFailureTime), reconnectionRetryAfter),
				};
			}
			return {};
		}
	),
	withHandlers(
		{
			handlerTryReconnect: ({ dispatch }) => () => {
				dispatch(checkConnection());
			},
		}
	),
);
