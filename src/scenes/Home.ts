import Phaser from "phaser";
import TextureKeys from '../consts/TextureKeys'

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  private Character
  private CharacterKey
  preload () {
    // this.load.image('background', 'images/bg.png')
    this.load.spritesheet(
      TextureKeys.Girl,
      'images/characters/girl.png',
      { frameWidth: 320, frameHeight: 320 }
    )
    console.log(window.localStorage)
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
  }
  update(){

  }
}
