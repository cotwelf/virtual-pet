import Phaser from "phaser";

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  preload () {
    this.load.image('background', 'images/bg')

  }
  create () {

  }
}
