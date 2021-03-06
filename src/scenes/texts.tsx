import Phaser from "phaser";
import { createDialogueDom, printText } from "~/utils";

let textDiv = <div></div>

export default class Texts extends Phaser.Scene {
  constructor () {
    super('texts')
  }
  private notifyModal
  // temp
  private count = 1
  private textString
  private printing
  private text
  private print
  private space = 800 // 翻页间隔
  private endInterval
  private endDuration = 2800
  private name
  create () {
    document.getElementById("game-view")?.classList.add('text')
    this.text = this.add.dom(0, 0, textDiv, "text-align: center; width: 100vw").setOrigin(0)
    // the end
    this.print = printText(this, textDiv, `第 ${this.count++} 天`)


    // this.textString = `第 ${this.count} 天`
    // this.text.setText(this.textString)

    // n 天后
    // this.text.setText(`${this.count} 天后`)
    // this.pageTurn()
  }
  update () {
    // if (this.count < 300 && !this.printing) {
    //   this.printing = true
    //   this.space = this.space - 50 < 10 ? 10 : this.space - 50
    //   setTimeout(() => {
    //     this.textString += `\n第 ${++this.count} 天`
    //     this.text.setText(this.textString)
    //     console.log(this.text.height)
    //     this.printing = false
    //   }, this.space)
    // }
    // if (this.count > 100) {
    //   this.text.alpha-=0.03
    // }
    this.theEnd()

    // n 天后
    // if (!this.printing && this.count < 35) {
    //   this.pageTurn()
    // }
  }
  private pageTurn = () => {
    if (this.printing) {
      return
    }
    this.printing = true
    setTimeout(() => {
      // let counter = 30
      // this.text.setText(`第 ${++this.count} 天`)

      // 阳性 x 天后
      let counter = 30
      this.text.setText(`${++this.count}  天后`)
      this.printing = false
      if (this.count < counter) {
        this.space = this.space - counter*10 < 0 ? 0 : this.space - counter*10
      } else {
        this.space = this.space + counter*10 > 1000 ? 1000 : this.space + counter*10
      }
    }, this.space)
  }
  private notify = () => {
    const dialogueText = "居委会通知：好消息！好消息！今天小区会发放物资，请注意领取。"
    const btnList = [
      {
        text: "晓得啦~",
        onClickFn: () => {
          setTimeout(() => {
            this.notifyModal.destroy()
          }, 1000)
        },
      }
    ]
    this.notifyModal = this.add.dom(0, 0, createDialogueDom('big', { btnList: btnList, dialogueText })).setOrigin(0)
  }

  private theEnd = () => {
    if (this.endInterval) {
      return
    }
    this.endInterval = setInterval(() => {
      console.log(this.print.isPrinting())
      if (this.print.isPrinting()) {
        return
      }
      const textString = `..第 ${this.count++} 天`
      this.print = printText(this, textDiv, textString, 'noSpace')
      if (this.endDuration > 1500) {
        this.endDuration -= 30
      } else {
        this.text.alpha = this.text.alpha > 0.3 ? this.text.alpha - 0.1 : 0.3
        if (this.name) {
          return
        }
        let nameDiv = <div class='name'></div>
        this.name = this.add.dom(0, 0, nameDiv, "text-align: left; width: 100vw; ").setOrigin(0)
        printText(this, nameDiv, 'film by Peng Xiuwen')
      }
    })
  }
}
