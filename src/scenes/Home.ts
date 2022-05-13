import Phaser from "phaser";
import { IBasicDataType, IConmunicateConfig } from "~/utils/types";
import { TextureKeys, createDialogueDom, showCurrentData, printText, setBasicData, getBasicData } from '../utils'

let testString = '你好呀~'

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  private Character
  private CharacterKey
  // private healthLabel!: Phaser.GameObjects.Text

  // 四项基本数值
  private basicData = {
    health: 0,
    feeling: 0,
    knowledge: 0,
    relationship: 0,
  }
  private currentShow = 'health'
  private basicDataShower

  // 对话框
  private dialogModal
  private gameWidth
  private gameHeight

  init () {
    console.log('init')
    console.log(window.localStorage)
    this.CharacterKey = TextureKeys.Girl
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
    this.basicData = getBasicData()
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
      const config: IConmunicateConfig = {
        dialogue: '你好呀呀呀~ 今天下雨了呢，出门别忘记带伞鸭',
        btns: [
          {
            text: '你好 ^-^',
            type: 'health',
            value: 2,
          },
          {
            text: '不理你╭(╯^╰)╮',
            type: 'feeling',
            value: -1,
          }
        ]
      }
      this.communicate(config)
    }, this)

    // 展示当前数据
    this.basicDataShower = this.add.dom(0, 0, showCurrentData('health', this.basicData[this.currentShow])).setOrigin(0)
  }

  update(){

  }
  private updateBasicData (type: IBasicDataType, value: number) {
    // 更新数值
    let count = this.basicData[type]
    count += value
    this.basicData[type] = count < 0 ? 0 : (count > 10 ? 10 : count)
    // 更新 localStorage
    setBasicData(this.basicData)
  }
  // 关闭正在开启的对话框
  private onCloseDialogueFn (type: IBasicDataType, value: number) {
    this.Character.setInteractive()
    this.dialogModal.destroy()
    this.updateBasicData(type, value)
    this.basicDataShower.destroy()
    this.basicDataShower = this.add.dom(0, 0, showCurrentData(type, this.basicData[type])).setOrigin(0)
  }

  // 点击角色交流
  private communicate (config: IConmunicateConfig) {
    this.Character.disableInteractive()
    if (config.dialogue.length === 0) {
      return
    }
    const btnList: {
      text: string
      onClickFn: () => void
    }[] = []
    config.btns.forEach(btn => {
      let temp = {
        onClickFn: () => this.onCloseDialogueFn(btn.type, btn.value),
        text: btn.text
      }
      btnList.push(temp)
    })
    this.dialogModal = this.add.dom(0, 0, createDialogueDom('dialogue', { btnList: btnList })).setOrigin(0)
    printText( document.getElementById('dialogue-text'), config.dialogue)
  }
}
