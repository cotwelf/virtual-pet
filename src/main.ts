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
import { blackText, theEnd } from './utils/game-controller'
import { theEndText } from '../public'
import { isMobile } from './utils'

let game

document.body.classList.add(`${isMobile() ? 'mobile' : 'pc'}`)

if (theEnd) {
  document.body.classList.add('the-end')
  const pic = document.createElement('div')
  pic.classList.add('pic')
  const bigText = document.createElement('div')
  bigText.className = 'big-text'
  bigText.innerHTML = '你的世界遇到问题，需要重新启动。<br />但我们无法为你重新启动。'
  const castText = document.createElement('div')
  castText.className = 'cast'
  theEndText.forEach((i) => {
    const items = i.join(', ').replace(',', '：')
    castText.innerHTML = `${castText.innerHTML}<br />${items}`
  })
  castText.innerHTML = castText.innerHTML.replace('<br>', '')
  const container = document.createElement('div')
  container.className = 'tips'
  container.appendChild(pic)
  container.appendChild(bigText)
  container.appendChild(castText)
  document.body.appendChild(container)
} else {
  const scene = [Start, Welcome, Setting, Home, Covid, Text]

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

  game = new Phaser.Game(config)
  const soundManager = new Phaser.Sound.BaseSoundManager(game)

  game.cache.audio.add('sound-click', soundClick)
  amplifyScenes({scale: 11, duration: 2})
}
export default game
