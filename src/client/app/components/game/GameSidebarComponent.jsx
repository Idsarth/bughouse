import React from 'react';
import GameInfoPanelContainer from '../../containers/game/GameInfoPanelContainer';
import GameMovesPanelContainer from '../../containers/game/GameMovesPanelContainer';

export default class GameSidebarComponent extends React.Component {
	constructor(props) {
		super(props);
		this.getInfoFormat = this.getInfoFormat.bind(this);
		this.getRating = this.getRating.bind(this);
	}

	getInfoFormat() {
		let speed;
		if (this.props.game.minutes < 3) speed = 'Bullet';
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) speed = 'Blitz';
		else speed = 'Classical';
		return `${this.props.game.minutes}+${this.props.game.increment}, ${speed}, ${this.props.game.mode}`;
	}

	getRating(player) {
		if (this.props.game.minutes < 3) return this.props.game[player].ratingBullet;
		else if (this.props.game.minutes >= 3 && this.props.game.minutes <= 8) return this.props.game[player].ratingBlitz;
		return this.props.game[player].ratingClassical;
	}

	render() {
		const sidebarPanelStyle = {
			position: 'relative',
			textAlign: 'center',
			paddingTop: '4em'
		};
		return (
			<div style={sidebarPanelStyle} className="col-md-4">
				<GameInfoPanelContainer />
				<br />
				<GameMovesPanelContainer />
				<br />
			</div>
		);
	}
}
