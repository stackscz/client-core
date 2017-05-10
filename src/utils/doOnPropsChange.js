import { lifecycle, shallowEqual } from 'recompose';
import { pick } from 'lodash';

export default (shouldDoOrKeys, callback) => (BaseComponent) => {
	const shouldDo = typeof shouldDoOrKeys === 'function'
		? shouldDoOrKeys
		: (props, nextProps) => !shallowEqual(
			pick(props, shouldDoOrKeys),
			pick(nextProps, shouldDoOrKeys),
		);

	return lifecycle(
		{
			componentWillMount() {
				if (shouldDo({}, this.props)) {
					callback(this.props, {});
				}
			},
			componentWillReceiveProps(nextProps) {
				if (shouldDo(this.props, nextProps)) {
					callback(nextProps, this.props);
				}
			},
		}
	)(BaseComponent);
};
