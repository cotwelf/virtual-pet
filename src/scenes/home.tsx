import Phaser from "phaser";
import { soundsAssets, dialoguesAssets } from '../../public'
import { IBasicData, IConmunicateConfig } from "~/utils/types";
import
{
  createDialogueDom,
  DATA_TYPES,
  showCurrentData,
  printText,
  toggleTips,
  getVisibilityEvent,
  getData,
  setData
}
from '../utils'
import { daysDuration } from "~/utils/game-controller";
import { loadSpritesheet, playAnims } from "~/utils/loaders/image-loader";
import { getNoInteractDialogues } from "~/../public/assets/dialogues/no-interact";

const clearedData = {
  character: undefined,
  basicDataShower: undefined,
  print: undefined,
  toBeNextDay: false
}

export default class Home extends Phaser.Scene {
  constructor () {
    super('home'); // given the key to uniquely identify it from other Scenes
  }
  private characterFullKey
  private character
  private dataStorage

  private currentShow: IBasicData = 'health'
  private previousType
  private basicDataShower

  // 对话框
  private dialogModal
  private gameWidth
  private gameHeight
  private lastDialogueIndex = 0 // 跨天不删除，如果没了的话需要重新赋值
  private print

  // 跳转到下一天
  private toBeNextDay = false

  init () {
    this.dataStorage = getData()
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
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
    // 随机一个状态
    const randomStatus = this.dataStorage.characterKey === 'boy' ? '' : this.dataStorage.characterStatus[Phaser.Math.RND.integerInRange(0, this.dataStorage.characterStatus.length - 1)]
    this.characterFullKey = `${this.dataStorage.characterKey}${randomStatus ? `-${randomStatus}` : ''}`
    this.load.spritesheet(
      this.characterFullKey,
      `images/characters/${this.characterFullKey}.png`,
      { frameWidth: 320, frameHeight: 320 }
    )
  }
  create () {
    // 定时开启下一个循环~
    setTimeout(() => {
      this.toBeNextDay = true
      setData({...this.dataStorage})
      if (!this.dialogModal) {
        const setUpKeys = Object.keys(clearedData)
        setUpKeys.forEach(key => {
          this[key] = clearedData[key]
        })
        this.scene.stop('home')
        this.scene.start('text')
      }
      return
    }, daysDuration)
    this.anims.create({
      key: `${this.characterFullKey}-alive`,
      frames: this.anims.generateFrameNames(this.characterFullKey, { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1,
    })
    this.character = this.add.sprite(
      this.gameWidth * 0.5,
      this.gameHeight * 0.5,
      this.characterFullKey
    ).play(`${this.characterFullKey}-alive`, true)
    this.character.setInteractive()
    this.character.on('pointerdown', (pointer) => {
      this.character.disableInteractive()
      // WORDAROUND: 为了录像，顺序执行了 orz
      const currentDialogue = dialoguesAssets.happy.dialogue[this.lastDialogueIndex]
      // 设置按钮文字
      let config: IConmunicateConfig = {
        dialogue: currentDialogue.text,
        btns: [
          {
            text: currentDialogue.btn1.text,
            type: 'feeling',
            value: 1,
          },
          {
            text: currentDialogue.btn2.text,
            type: 'feeling',
            value: 1,
          }
        ]
      }
      this.communicate(config)

      const interactTimes = this.dataStorage.interactTimes || 0
      if (interactTimes > 3) {
        toggleTips(this, '今日互动加成已达上限\n_(:з」∠)_')
      }
      this.dataStorage.interactTimes += 1
      this.character.setInteractive()
    }, this)

    // 展示当前数据
    this.basicDataShower = this.add.dom(0, 0, showCurrentData('health', this.dataStorage.basicData[this.currentShow], this.onDataChange.bind(this))).setOrigin(0)
  }

  update(){
    if (this.currentShow !== this.previousType) {
      this.previousType = this.currentShow
      this.updateDataShower()
    }
    if (!this.print?.isPrinting()) {
    }
  }
  private updateDataShower () {
    // header 展示当前数据
    if (this.basicDataShower) {
      this.basicDataShower.destroy()
    }
    this.basicDataShower = this.add.dom(0, 0, showCurrentData(this.currentShow, this.dataStorage.basicData[this.currentShow], this.onDataChange.bind(this))).setOrigin(0)
  }
  private onDataChange (jump: 1 | -1 ) {
    const index = DATA_TYPES.indexOf(this.currentShow)
    this.currentShow = DATA_TYPES[index + jump]
  }
  private updateBasicData (type: IBasicData, value: number) {
    // 更新数值
    let count = this.dataStorage.basicData[type]
    count += value
    this.dataStorage.basicData[type] = count < 0 ? 0 : (count > 10 ? 10 : count)
    // 更新 dom
    this.updateDataShower()
  }
  // 关闭正在开启的对话框
  private onCloseDialogueFn (type: IBasicData, value: number) {
    // WORDAROUND: 为了录像，顺序执行了 orz
    if (this.lastDialogueIndex === dialoguesAssets.happy.dialogue.length - 1) {
      this.lastDialogueIndex = 0
    } else {
      this.lastDialogueIndex++
    }
    this.dialogModal.destroy()
    this.dialogModal = null
    const interactTimes = this.dataStorage.interactTimes || 0
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
        onClickFn: async () => {
          soundsAssets.handler.play(this, soundsAssets.keys.CLICK.KEY)
          await print.stop(this)
          let addType = btn.type
          // 如果 type 满了，则按顺序加给 health, feeling, knowledge, relationship
          const { basicData } = this.dataStorage
          if (basicData[addType] === 10) {
            const otherTypes = DATA_TYPES.filter((type) => {
              return basicData[type] !== 10
            })
            addType = otherTypes[0] || addType
          }
          this.onCloseDialogueFn(addType, btn.value)
          if (this.toBeNextDay) {
            this.toBeNextDay = false
            const setUpKeys = Object.keys(clearedData)
            setUpKeys.forEach(key => {
              this[key] = clearedData[key]
            })
            this.scene.stop('home')
            this.scene.start('text')
            return
          }
          this.character.setInteractive()
        },
        text: btn.text
      }
      btnList.push(temp)
    })
    this.dialogModal = this.add.dom(0, 0, createDialogueDom('dialogue', { btnList: btnList })).setOrigin(0)
    let print = printText(this, document.getElementById('modal-text'), config.dialogue)
  }

  private changeStatus () {
    // 30 分钟查询一次，是否有切换状态的条件
  }
}
