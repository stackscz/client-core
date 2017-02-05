import { omit } from 'lodash';
import {
	compose,
	withState,
	withHandlers,
	lifecycle,
	mapProps,
} from 'recompose';

// TODO debounce with rAFrame

const omitProps = keys => mapProps(props => omit(props, keys));

export default compose(
	withState('key', 'setSubKey', 'xxx'),
	withHandlers(
		{
			handleViewportChanged: ({ key, setSubKey }) => () => {
				const win = (0, window);
				const doc = (0, document);
				if (win && doc) {
					const w = win;
					const d = doc;
					const documentElement = d.documentElement;
					const body = d.getElementsByTagName('body')[0];
					const width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
					const height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

					const newKey = (key || '') + '' + width + '' + height;
					console.log('key', key);
					console.log('newKey', newKey);
					setSubKey(newKey);
				}
			},
		}
	),
	lifecycle(
		{
			componentDidMount() {
				const { handleViewportChanged } = this.props;
				const win = (0, window);
				if (win) {
					win.addEventListener('resize', handleViewportChanged);
				}
			},
			componentWillUnmount() {
				const { handleViewportChanged } = this.props;
				const win = (0, window);
				if (win) {
					win.removeEventListener('resize', handleViewportChanged);
				}
			},
		}
	),
	omitProps(['setSubKey', 'handleViewportChanged'])
);
