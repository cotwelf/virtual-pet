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
import { amplifyScale } from './utils/game-controller'

// 适配 TODO
const DEFAULT_SIZE = {
  width: 1920,
  height: 1080
}
const DEFAULT_FONT_SIZE = 100 // px
const GAME_VIEW_SIZE = 800

const gameView = document.getElementById('game-view')
const resizeScreen = () => {
  console.log(isMobile() && window.innerHeight > window.innerWidth)
  document.body.classList.add(`${isMobile() ? 'mobile' : 'pc'}`)
  document.body.classList.add(`${(window.innerHeight < window.innerWidth) ? 'wide' : 'normal'}`)

  const widthScale = window.innerWidth / DEFAULT_SIZE.width
  const heightScale = window.innerHeight / DEFAULT_SIZE.height
  const scale = Math.ceil(Math.min(widthScale, heightScale) * 100) / 100
  document.documentElement.style.fontSize = `${DEFAULT_FONT_SIZE * scale}px`

  // game view 保证在视图内
  const viewScale = Math.min(window.innerWidth, window.innerHeight) / GAME_VIEW_SIZE
  if (gameView) {
    gameView.style.transform = `scale(${viewScale})`
  }
}
resizeScreen()
// window.addEventListener('resize' ,throttle(resizeScreen, 100))

const scene = [Start, Welcome, Setting, Home, Covid, Text, End]

const config: Phaser.Types.Core.GameConfig = {
  fps: {
    min: 10,
    deltaHistory: 1,
  },
  type: Phaser.AUTO,
  width: GAME_VIEW_SIZE,
  height: GAME_VIEW_SIZE,
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
amplifyScenes({scale: amplifyScale.space, duration: 2}) // 开启空格缩放
export default game
