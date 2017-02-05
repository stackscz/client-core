import React, { PropTypes as T } from 'react';
import { isFunction } from 'lodash';

/**
 * @callback mapPropsToTitle
 * @desc Function that maps component's props to title
 * @param {object} props - component props
 * @return {string} title - title string to display
 */
/**
 * @callback screenEntered
 * @desc  Callback to call when screen is entered
 * @param {object} props - component props
 */
/**
 * @callback screenLeft
 * @desc  Callback to call when screen is left
 * @param {object} props - component props
 */
/**
 * @function screen
 * @desc Higher order component that allows to manage document head
 * @param {(string|mapPropsToTitle)} title - HTML <title> attribute to set
 * @param {screenEntered} screenEntered
 * @param {screenLeft} screenLeft
 */
const screen = ({
	screenEntered = () => {},
	screenLeft = () => {},
} = {}) => Component => {
	class Screen extends React.Component {
		static displayName = `Screen(${Component.displayName || Component.name})`;

		componentWillMount() {
			screenEntered(this.props);
		}

		componentWillReceiveProps(nextProps) {
			const { location: currentLocation = {} } = this.props;
			const { location: nextLocation = {} } = nextProps;
			if (`${currentLocation.pathname}${currentLocation.search}` !== `${nextLocation.pathname}${nextLocation.search}`) {
				screenLeft(this.props);
				screenEntered(nextProps);
			}
		}

		componentWillUnmount() {
			screenLeft(this.props);
		}

		render() {
			return <Component {...this.props} />;
		}
	}

	return Screen;
};

export default screen;
