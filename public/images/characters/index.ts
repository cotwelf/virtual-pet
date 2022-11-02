import girl from './girl.png'
import girlEmo from './girl.png'
import girlSleep from './girl-sleep.png'
import girlGame from './girl-game.png'

const CHARACTERS = new Map([
  ['girl', {
    key: 'girl',
    path: 'images/characters/girl.png',
    frame: 3,
    width: 960,
    height: 320,
    asset: girl,
  }],
  ['girlEmo', {
    key: 'girl-emo',
    path: 'images/characters/girl-emo.png',
    frame: 3,
    width: 960,
    height: 320,
    asset: girlEmo,
  }],
  ['girlSleep', {
    key: 'girl-sleep',
    path: 'images/characters/girl-sleep.png',
    frame: 3,
    width: 960,
    height: 320,
    asset: girlSleep,
  }],
  ['girlGame', {
    key: 'girl-game',
    path: 'images/characters/girl-game.png',
    frame: 3,
    width: 960,
    height: 320,
    asset: girlGame,
  }]
])

export default CHARACTERS
