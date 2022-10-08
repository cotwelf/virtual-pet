import Phaser from 'phaser'

// @ts-ignore
import Welcome from './scenes/welcome'
// @ts-ignore
import Home from './scenes/home'
import Setting from './scenes/setting'
import Covid from './scenes/covid'
import Texts from './scenes/texts'

import soundClick from '../public/assets/sounds/click.mp3'

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

let amplified = false
let mousePosition = {
  x: 0,
  y: 0
}
const container = document.getElementById('container')
console.log(container?.style.transformOrigin, 'origin')
document.body.onkeydown = (e) => {
  if (e.code === 'Space' && container && !amplified) {
    const center = {
      x: document.body.clientWidth / 2,
      y: document.body.clientHeight / 2,
    }
    const fixX = Math.round(mousePosition.x - center.x)
    const fixY = Math.round(mousePosition.y - center.y)
    console.log(fixX, fixY)
    amplified = true
    console.log(center, mousePosition,'mousePosition')
    container.setAttribute('class', `amplified x${fixX} y${fixY}`)
  } else if (e.code === 'Space' && container && amplified) {
    amplified = false
    container.setAttribute('class', '')
  }
}

document.body.onmousemove = (e) => {
  mousePosition.x = e.clientX
  mousePosition.y = e.clientY
}

export default game
