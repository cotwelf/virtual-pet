import Phaser from "phaser";
import { confirmBtnText, cancelBtnText} from '../../public/assets/dialogues'
import { IBasicData, IConmunicateConfig } from "~/utils/types";
import {
  createDialogueDom,
  DATA_TYPES,
  showCurrentData,
  printText,
  setBasicData,
  getBasicData,
  getKotoba,
  getInteractTimes,
  setInteractTimes,
  toggleTips,
  getCharacterKey,
  getEventDailyRecord,
  getDataAndSetStatus,
  getVisibilityEvent
} from '../utils'

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  private character
  private characterKey
  // private healthLabel!: Phaser.GameObjects.Text

  // 四项基本数值
  private basicData: any = {
    health: 0,
    feeling: 0,
    knowledge: 0,
    relationship: 0,
  }
  private currentShow: IBasicData = 'health'
  private previousType
  private basicDataShower

  // 对话框
  private dialogModal
  private gameWidth
  private gameHeight

  private data

  init () {
    this.characterKey = getCharacterKey()
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
    this.basicData = getBasicData()
    this.data = getDataAndSetStatus()
    // 防止手机浏览器切换 tab 导致雪碧图鬼畜
    const fixHidden = () => {
      if (document.visibilityState === 'hidden') {
        this.character.visible = false
        this.character.anims.stopOnFrame(0)
      } else {
        this.character.anims.restart()
        this.character.visible = true
        // this.character.play(`${this.characterKey}-alive`, true)
      }
    }
    document.addEventListener(getVisibilityEvent(), fixHidden)
  }
  preload () {
    // this.load.image('background', 'images/bg.png')
    console.log(this.characterKey)
    this.load.spritesheet(
      this.characterKey,
      `images/characters/${this.characterKey}.png`,
      { frameWidth: 320, frameHeight: 320 }
    )
  }
  create () {

    this.anims.create({
      key: `${this.characterKey}-alive`,
      frames: this.anims.generateFrameNames(this.characterKey, { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1,
    });
    this.character = this.add.sprite(
      this.gameWidth * 0.5,
      this.gameHeight * 0.5,
      this.characterKey
    ).play(`${this.characterKey}-alive`, true)
    this.character.setInteractive()
    this.character.on('pointerdown', (pointer) => {
      // 设置按钮文字
      let config: IConmunicateConfig = {
        dialogue: '你好呀呀呀~ 今天下雨了呢，出门别忘记带伞鸭',
        btns: [
          {
            text: confirmBtnText[Math.floor((Math.random() * confirmBtnText.length))],
            type: 'health',
            value: 2,
          },
          {
            text: cancelBtnText[Math.floor((Math.random() * cancelBtnText.length))],
            type: 'feeling',
            value: -1,
          }
        ]
      }
      // 替换文字
      getKotoba().then(res => {
        config.dialogue = res
        // console.log(res)
        this.communicate(config)
      })
      const interactTimes = getInteractTimes()
      if (interactTimes > 3) {
        toggleTips(this, '今日互动加成已达上限_(:з」∠)_')
      }
      setInteractTimes(interactTimes + 1)
    }, this)

    // 展示当前数据
    this.basicDataShower = this.add.dom(0, 0, showCurrentData('health', this.basicData[this.currentShow], this.onDataChange.bind(this))).setOrigin(0)
  }

  update(){
    if (this.currentShow !== this.previousType) {
      this.previousType = this.currentShow
      this.updateDataShower()
    }
  }
  private updateDataShower () {
    // header 展示当前数据
    if (this.basicDataShower) {
      this.basicDataShower.destroy()
    }
    this.basicDataShower = this.add.dom(0, 0, showCurrentData(this.currentShow, this.basicData[this.currentShow], this.onDataChange.bind(this))).setOrigin(0)
  }
  private onDataChange (jump: 1 | -1 ) {
    const index = DATA_TYPES.indexOf(this.currentShow)
    this.currentShow = DATA_TYPES[index + jump]
  }
  private updateBasicData (type: IBasicData, value: number) {
    // 更新数值
    let count = this.basicData[type]
    count += value
    this.basicData[type] = count < 0 ? 0 : (count > 10 ? 10 : count)
    // 更新 localStorage
    setBasicData(this.basicData)
    // 更新 dom
    this.updateDataShower()
  }
  // 关闭正在开启的对话框
  private onCloseDialogueFn (type: IBasicData, value: number) {
    this.character.setInteractive()
    this.dialogModal.destroy()
    const interactTimes = getInteractTimes()
      if (interactTimes <= 3) {
        this.updateBasicData(type, value)
        this.currentShow = type
      }
  }

  // 点击角色交流
  private communicate (config: IConmunicateConfig) {
    this.character.disableInteractive()
    if (config.dialogue.length === 0) {
      return
    }
    const btnList: {
      text: string
      onClickFn: () => void
    }[] = []
    config.btns.forEach(btn => {
      let temp = {
        onClickFn: () => {
          this.onCloseDialogueFn(btn.type, btn.value)
          print.stop()
        },
        text: btn.text
      }
      btnList.push(temp)
    })
    this.dialogModal = this.add.dom(0, 0, createDialogueDom('dialogue', { btnList: btnList })).setOrigin(0)
    let print = printText(document.getElementById('modal-text'), config.dialogue)
  }

  private changeStatus () {
    // 30 分钟查询一次，是否有切换状态的条件
  }
}
