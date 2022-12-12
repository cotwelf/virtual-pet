import Phaser from "phaser";
import { createDialogueDom, printText } from "~/utils";
import { soundsAssets } from '../../public'
import { bgmOn } from "~/utils/game-controller";

const RULE_FRAGMENTS = [
  "scale-fast由于疫情大爆发，scale-fast所有人都被封印在scale-slow家里无法出门。",
  "你唯一要做的，就是保持身心健康，尽可能不生病、不抑郁，等待解封。",
  "接下来请设定初始值，迎接无尽（不是）的封印吧！！"
]
const CONFIRM_TEXT = '好 8...'

const CANCEL_TEXT = '不！滚！'
export default class Welcome extends Phaser.Scene {
  constructor () {
    super('welcome')
  }
  private gameStart
  private rules
  private gameWidth
  private gameHeight
  init () {
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height

  }
  preload () {
    this.load.spritesheet(
      'click',
      '/images/welcome/click.png',
      { frameWidth: 477, frameHeight: 288 }
    )
  }
  create () {
    if (bgmOn) {
      soundsAssets.handler.play(this, soundsAssets.keys.BGM_LIGHT.KEY, { loop: true, volume: 0.5 })
    }
    this.add.dom(0, 0, <div className="title">生存挑战</div>).setOrigin(0)
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
      soundsAssets.handler.play(this, soundsAssets.keys.CLICK.KEY)
      this.gameStart.disableInteractive()
      this.showRules(0)
    }, this)
  }
  private showRules(textIndex: number) {
    const btnList = [
      {
        text: CANCEL_TEXT,
        onClickFn: async () => {
          soundsAssets.handler.play(this, soundsAssets.keys.CLICK.KEY)
          let result = await print.stop(this)
          if (!result) {
            return
          } else if (textIndex === 0) {
            this.rules.destroy()
            this.gameStart.setInteractive()
          } else {
            this.showRules(textIndex - 1)
          }
        }
      },
      {
        text: CONFIRM_TEXT,
        onClickFn: async () => {
          soundsAssets.handler.play(this, soundsAssets.keys.CLICK.KEY)
          let result = await print.stop(this)
          if (!result) {
            return
          } else if (textIndex === 2) {
            this.scene.stop('welcome')
            this.scene.start('setting')
          } else {
            this.showRules(textIndex + 1)
          }
        },
      }
    ]
    if (this.rules) {
      this.rules.destroy()
    }
    this.rules = this.add.dom(0, 0, createDialogueDom('big', { btnList: btnList })).setOrigin(0)
    let print = printText(this, document.getElementById('modal-text'), RULE_FRAGMENTS[textIndex], 'fast')
  }
}
