import Phaser from 'phaser'

import Start from './scenes/start'
// @ts-ignore
import Welcome from './scenes/welcome'
// @ts-ignore
import Home from './scenes/home'
import Setting from './scenes/setting'
import Covid from './scenes/covid'
import Text from './scenes/text'

import soundClick from '../public/assets/sounds/click.mp3'
import { amplifyScenes } from './utils/amplify'

import { isMobile, throttle } from './utils'
import End from './scenes/end'

// 适配 TODO
// 1920 * 1080 fontSize = 100px
const resizeScreen = () => {
  console.log(isMobile() && window.innerHeight > window.innerWidth)
  document.body.classList.add(`${isMobile() ? 'mobile' : 'pc'}`)
  document.body.classList.add(`${(window.innerHeight < window.innerWidth) ? 'wide' : 'normal'}`)

  const widthScale = Math.round(window.innerWidth / 1920 * 100) / 100
  const heightScale = Math.round(window.innerHeight / 1080 * 100) / 100
  const scale = Math.min(widthScale, heightScale)
  document.documentElement.style.fontSize = `${100 * scale}px`
}
resizeScreen()
window.addEventListener('resize' ,throttle(resizeScreen, 100))

const scene = [Start, Welcome, Setting, Home, Covid, Text, End]

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
amplifyScenes({scale: 11, duration: 2})
export default game
