import Phaser from 'phaser'
import clickSound from '../../public/assets/sounds/click.mp3'

const cache = new Phaser.Cache.BaseCache()
cache.add('sound-click', clickSound)

export default cache
