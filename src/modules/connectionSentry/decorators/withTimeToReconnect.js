import { compose, withPropsOnChange, withState, lifecycle } from 'recompose';
import differenceInSeconds from 'date-fns/difference_in_seconds';
import omitProps from 'utils/omitProps';
import withReconnectionTimer from './withReconnectionTimer';

// TODO rename to withReconnectionTimer
export default compose(
	withState('refreshInterval', 'setRefreshInterval', null),
	withReconnectionTimer,
	withState('now', 'setNow', () => new Date()),
	lifecycle(
		{
			componentDidMount() {
				const { setNow, setRefreshInterval } = this.props;
				const ri = setInterval(
					() => setNow(new Date()),
					500,
				);
				setRefreshInterval(ri);
			},
			componentWillUnmount() {
				const { refreshInterval } = this.props;
				clearInterval(refreshInterval);
			},
		},
	),
	withPropsOnChange(
		['now', 'reconnectionRetryAt'],
		({ now, reconnectionRetryAt }) => {
			return {
				reconnectionRetryInSeconds: reconnectionRetryAt ? Math.max(0, differenceInSeconds(reconnectionRetryAt, now)) : undefined,
			};
		},
	),
	omitProps(['now', 'setNow', 'refreshInterval', 'setRefreshInterval', 'reconnectionRetryAt']),
);
