import React from 'react';

export default lifecycle => Component => class TransitionLifecycle extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isAppearing: false,
			isAppearingActive: false,
			isEntering: false,
			isEnteringActive: false,
			isLeaving: false,
			isLeavingActive: false,
			isOpened: false,
		};
	}

	componentWillAppear(callback) {
		this.setState({ isAppearing: true });
		setTimeout(() => this.setState({ isAppearingActive: true }), 0);
		lifecycle.componentWillAppear(callback);
	}
	componentDidAppear() {
		this.setState({ isAppearing: false, isAppearingActive: false });
		lifecycle.componentDidAppear();
	}
	componentWillEnter(callback) {
		this.setState({ isEntering: true });
		setTimeout(() => this.setState({ isEnteringActive: true }), 0);
		lifecycle.componentWillEnter(callback);
	}
	componentDidEnter() {
		this.setState({ isEntering: false, isEnteringActive: false, isOpened: true });
		lifecycle.componentDidEnter();
	}
	componentWillLeave(callback) {
		this.setState({ isLeaving: true });
		setTimeout(() => this.setState({ isLeavingActive: true }), 0);
		lifecycle.componentWillLeave(callback);
	}
	componentDidLeave() {
		this.setState({ isLeaving: false, isLeavingActive: false, isOpened: false });
		lifecycle.componentDidLeave();
	}

	render() {
		return (
			<Component {...this.props} transitionLifecycle={this.state} />
		);
	}
};
