import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import Home from './scenes/Home'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 800,
	transparent: true,
	parent: 'game-view',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [Home, HelloWorldScene]
}

export default new Phaser.Game(config)
