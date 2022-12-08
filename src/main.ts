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

let game

if (blackText) {
  document.body.classList.add('explaination')
  const textArray = [
    // ['2022年3月28日5时，上海以黄浦江为界分区分批实施核酸筛查，开始实施封控管理。<br />'],
    // ['面对突如其来的居家办公 / 线上上课，'],
    // ['人们从最初的伴随着些许担忧的“新鲜感”，'],
    // ['到意识到买不到菜将会挨饿的“恐惧感”，'],
    // ['到眼睁睁看着疫情肆虐却无能为力，解封遥遥无期“绝望感”......'],
    ['World 未能正常启动。原因可能是最近您遇到了一些心理或生理问题。请您核查近期是否有以下问题：<br />'],
    ['&nbsp;&nbsp;1. 遇到了百年一遇天灾 / 人祸。如：疫病等。'],
    ['&nbsp;&nbsp;2. 过于忧虑自己以及家人朋友的健康和安全。'],
    ['&nbsp;&nbsp;3. 工作或学习受到影响，被裁员、求职困难，或考试由于某种不可抗力取消，原本的生活轨迹被打乱。'],
    ['&nbsp;&nbsp;4. 近半年有一段时间处于饥饿状态。可能由于买不到菜，或其他因素。'],
    ['&nbsp;&nbsp;5. 担心未来。<br />'],
    ['如果无法确认是否存在以上情形，请根据下列关键词回忆，或与您的朋友联系，已获得帮助。<br>'],
    // ['&nbsp;&nbsp;&nbsp;&nbsp;时间：2022 年<br>'],
    // ['&nbsp;&nbsp;&nbsp;&nbsp;地点：上半年：上海；下半年：甘肃、广州、北京、河南等其他城市<br>'],
    ['&nbsp;&nbsp;&nbsp;&nbsp;<div style="font-size:35px">正在启动 World</div> ']
  ]
  let timer = 0
  const contentBox = document.createElement('div')
  contentBox.className = 'content-box'
  setTimeout(() => {
    const text = document.createElement('div')
    for (let i = 0; i < textArray.length; i++) {
      setTimeout(() => {
        text.innerHTML = text.innerHTML + '<br />' + textArray[i][0]
      }, timer * (i + 1))
    }
    contentBox.appendChild(text)
  }, 2000)
  document.body.appendChild(contentBox)


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
