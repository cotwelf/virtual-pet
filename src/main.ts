import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
// @ts-ignore
import Welcome from './scenes/welcome'
// @ts-ignore
import Home from './scenes/home'

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
	scene: [Welcome, Home, HelloWorldScene],
	dom: {
		createContainer: true
	}
}

export default new Phaser.Game(config)
