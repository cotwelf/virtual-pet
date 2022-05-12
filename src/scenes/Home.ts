import Phaser from "phaser";
import TextureKeys from '../consts/TextureKeys'

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  private Character
  private CharacterKey
  private healthLabel!: Phaser.GameObjects.Text
  private health = 10
  init () {
    console.log('init')
    console.log(window.localStorage)
  }
  preload () {
    // this.load.image('background', 'images/bg.png')
    this.load.spritesheet(
      TextureKeys.Girl,
      'images/characters/girl.png',
      { frameWidth: 320, frameHeight: 320 }
    )
  }
  create () {
    const width = this.scale.width
    const height = this.scale.height
    // 设置背景（repeat）。这里如果不 setOrigin(0, 0)，则是以图片的中心为原点，而我们希望是图片的左上角为原点
    // this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0)
    this.anims.create({
      key: 'girl-alive',
      frames: this.anims.generateFrameNames(TextureKeys.Girl, { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1
    });
    this.Character = this.add.sprite(
      width * 0.5,
      height * 0.5,
      TextureKeys.Girl
    ).play('girl-alive')
    this.Character.setInteractive()
    this.Character.on('pointerdown', (pointer) => {
      console.log(233333, this.Character)
    }, this)
    this.healthLabel = this.add.text(100, 100, `健康: ${this.health}`, {
      fontSize: '60px',
      color: '#263238',
      fontFamily: 'VonwaonBitmap12',
      shadow: {fill: true, blur: 0, offsetY: 0},
      padding: {left: 15, right: 15, top: 10, bottom: 10}
    })
    .setScrollFactor(0)
  }
  update(){

  }
}
