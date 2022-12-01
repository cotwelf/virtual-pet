import Phaser from 'phaser'

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

let game

if (blackText) {
  document.body.classList.add('explaination')
  const textArray = [
    ['2022年3月28日5时，上海以黄浦江为界分区分批实施核酸筛查，开始实施封控管理。<br />'],
    ['面对突如其来的居家办公 / 线上上课，'],
    ['人们从最初的伴随着些许担忧的“新鲜感”，'],
    ['到意识到买不到菜将会挨饿的“恐惧感”，'],
    ['到眼睁睁看着疫情肆虐却无能为力，解封遥遥无期“绝望感”......'],
    // ['每天做的是...</br>'],
    // ['关注疫情动向'],
    // ['核酸'],
    // ['抗原'],
    // ['工作'],
    // ['学习'],
    // ['刷剧'],
    // ['葛优躺'],
    // ['抢菜'],
    // ['担心'],
    // ['盼望解封'],
  ]
  let timer = 500
  setTimeout(() => {
    const text = document.createElement('div')
    for (let i = 0; i < textArray.length; i++) {
      setTimeout(() => {
        text.innerHTML = text.innerHTML + '<br />' + textArray[i][0]
      }, timer * (i + 1))
    }
    document.body.appendChild(text)
  }, 2000)

} else if (theEnd) {
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
  const scene = [Welcome, Setting, Home, Covid, Text]

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
