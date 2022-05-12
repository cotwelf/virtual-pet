import Phaser from "phaser";
import { IBasicDataType } from "~/utils/types";
import { TextureKeys, createDialogueDom, showCurrentData, createBtnSet } from '../utils'

let testString = '你好呀~'

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  private Character
  private CharacterKey
  private healthLabel!: Phaser.GameObjects.Text
  private health = 8
  private dialogModal
  private dialogBtn // WIRKROUND: 这里之后会删除，优化一下 dialogueModal
  private dialogText = ''
  private gameWidth
  private gameHeight
  private basicData
  private textInterval
  private interval
  init () {
    console.log('init')
    console.log(window.localStorage)
    this.CharacterKey = TextureKeys.Girl
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
  }
  preload () {
    // this.load.image('background', 'images/bg.png')
    this.load.spritesheet(
      this.CharacterKey,
      'images/characters/girl.png',
      { frameWidth: 320, frameHeight: 320 }
    )
  }
  create () {

    // 设置背景（repeat）。这里如果不 setOrigin(0, 0)，则是以图片的中心为原点，而我们希望是图片的左上角为原点
    // this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0)
    this.anims.create({
      key: 'girl-alive',
      frames: this.anims.generateFrameNames(this.CharacterKey, { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1
    });
    this.Character = this.add.sprite(
      this.gameWidth * 0.5,
      this.gameHeight * 0.5,
      this.CharacterKey
    ).play('girl-alive')
    this.Character.setInteractive()
    this.Character.on('pointerdown', (pointer) => {
      console.log(233333, this.Character, pointer)
      this.communicate(testString)
    }, this)

    // 展示当前数据
    console.log(this.health, 'this.health')
    this.basicData = this.add.dom(0, 0, showCurrentData('health', this.health)).setOrigin(0)
    // this.basicData.node.classList.add('text')
  }
  update(){

  }
  private onCloseFn (type: IBasicDataType, value: number) {
    console.log(type, value)
    this.dialogModal.destroy()
    this.dialogBtn.destroy()
    clearInterval(this.textInterval)
    clearInterval(this.interval)
    let count = this.health
    if (value) {
      count += 2
    } else {
      count -= 2
    }
    this.health = count < 0 ? 0:(count > 10 ? 10 : count)
    this.dialogText = ''
    this.basicData.destroy()
    this.basicData = this.add.dom(0, 0, showCurrentData('health', this.health)).setOrigin(0)
  }
  private communicate (text: string) {
    if (text.length === 0) {
      return
    }
    let currentText = text
    const config = [
      {
        text: '你好 ^-^',
        onClickFn: () => {this.onCloseFn('health', 10)}
      },
      {
        text: '不理你╭(╯^╰)╮',
        onClickFn: () => {this.onCloseFn('feeling', 0)}
      }
    ]
    this.dialogModal = this.add.dom(0, 0, createDialogueDom('small', this.dialogText)).setOrigin(0)
    // this.dialogModal = this.add.dom(0, 0, createDialogueDom('small', {btnList: config, dialogueText: this.dialogText})).setOrigin(0)

    this.interval = setInterval(() => {
      try {
        if (currentText.length === 0) {
          clearInterval(this.interval)
          setTimeout(() => {
            this.dialogBtn = this.add.dom(0, 0, createBtnSet(config)).setOrigin(0)
            this.textInterval = setInterval(() => {
              if (this.dialogText.indexOf('_') !== -1) {
                this.dialogText = this.dialogText.substring(0, this.dialogText.length - 1)
              } else {
                this.dialogText = this.dialogText + '_'
              }
              this.dialogModal.setText(this.dialogText)
            }, 600)
          }, 300)
        } else {
          this.dialogText = this.dialogText + currentText[0]
          currentText = currentText.substring(1, currentText.length)
          this.dialogModal.setText(this.dialogText)
        }
      } catch {
        clearInterval(this.interval)
      }
    } ,150)
    // this.health += 1
    // this.healthLabel.text = `健康: ${this.health}`
  }
}
