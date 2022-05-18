import Phaser from "phaser";
import { createDialogueDom, getBasicData, isMobile, printText } from "~/utils";

const RULE_FRAGMENTS = [
  "由于疫情大爆发，所有人都被封印在家里无法出门。",
  "你唯一要做的，就是保持身心健康，尽可能不生病、不抑郁，等待解封。",
  "接下来请设定初始值，迎接无尽（不是）的封印吧！！"
]
const CONFIRM_TEXT = '好 8...'

const CANCEL_TEXT = '不！滚！'

export default class Welcome extends Phaser.Scene {
  constructor () {
    super('welcome'); // given the key to uniquely identify it from other Scenes
  }
  private gameStart
  // 对话框welcome.tsx
  private rules
  private rulesIndex = 0
  private rulesIndexLast = 0

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
    // if(isMobile()) {
    //   this.add.dom(this.gameWidth * 0.5, this.gameHeight * 0.4, <div className="sorry-qwq" style={{fontSize: '40px', width: '90vw', lineHeight: '15vw'}}>请用大佬电脑浏览器打开，主人还没搞好爪机的适配 _(:з」∠)_</div>)
    //   return
    // }
    if (!!getBasicData()) {
      this.scene.stop('welcome')
      this.scene.start('home')
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
      this.gameStart.disableInteractive()
      this.showRules(0)
    }, this)
  }
  update(){

  }

  private showRules(textIndex: number) {
    const btnList = [
      {
        text: CANCEL_TEXT,
        onClickFn: () => {
          if (textIndex === 0) {
            this.rules.destroy()
            this.gameStart.setInteractive()
          } else {
            this.showRules(textIndex - 1)
          }
        }
      },
      {
        text: CONFIRM_TEXT,
        onClickFn: () => {
          if (textIndex === 2) {
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
    printText( document.getElementById('modal-text'), RULE_FRAGMENTS[textIndex], 'fast')
  }
}
