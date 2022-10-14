import Phaser from 'phaser'

// @ts-ignore
import Welcome from './scenes/welcome'
// @ts-ignore
import Home from './scenes/home'
import Setting from './scenes/setting'
import Covid from './scenes/covid'
import Texts from './scenes/texts'

import soundClick from '../public/assets/sounds/click.mp3'
import { amplifyScenes } from './utils/amplify'

const scene = [Welcome, Setting, Home, Covid, Texts]

const config: Phaser.Types.Core.GameConfig = {
  fps: {
    min: 10,
    deltaHistory: 1,
  },
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
	scene,
	dom: {
		createContainer: true
	},
}

const game = new Phaser.Game(config)
const soundManager = new Phaser.Sound.BaseSoundManager(game)

game.cache.audio.add('sound-click', soundClick)
amplifyScenes()
export default game
