import Phaser from 'phaser'

// @ts-ignore
import Welcome from './scenes/welcome'
// @ts-ignore
import Home from './scenes/home'
import Setting from './scenes/setting'

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
	scene: [Welcome, Setting, Home],
	dom: {
		createContainer: true
	}
}

export default new Phaser.Game(config)
