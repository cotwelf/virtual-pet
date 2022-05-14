import Phaser from "phaser";

export default class Welcome extends Phaser.Scene {
  constructor () {
    super('welcome'); // given the key to uniquely identify it from other Scenes
  }
  private gameStart
  private start!: Phaser.GameObjects.Text
  // 对话框
  private gameWidth
  private gameHeight

  init () {
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
  }
  preload () {
    // this.load.image('background', 'images/bg.png')

    this.load.spritesheet(
      'click',
      '/images/welcome/click.png',
      { frameWidth: 477, frameHeight: 288 }
    )
  }
  create () {

    this.add.dom(this.gameWidth * 0.5, this.gameHeight * 0.4, <div className="title">生存挑战</div>)

    this.anims.create({
      key: 'click',
      frames: this.anims.generateFrameNames('click', { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    });
    this.gameStart = this.add.sprite(
      this.gameWidth * 0.7,
      this.gameHeight * 0.8,
      'gameStart'
    ).play('click')
    this.gameStart.setInteractive()
    this.gameStart.on('pointerdown', (pointer) => {
      this.scene.stop('welcome')
      this.scene.start('home')
    }, this)
  }

  update(){

  }
}
