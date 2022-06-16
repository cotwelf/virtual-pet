import Phaser from "phaser";
import { createDialogueDom, printText } from "~/utils";

export default class GetFoods extends Phaser.Scene {
  constructor () {
    super('getFoods')
  }
  private notifyModal
  // temp
  private count = 1
  private textString
  private printing
  private text
  private print
  private space = 800 // 翻页间隔
  create () {
    // this.print = printText(this, document.getElementById("game-view"), `第 ${this.count++} 天`)
    let dom = <div></div>
    this.text = this.add.dom(this.scale.width * 0.5, this.scale.height * 0.5, dom, "text-align: center;")
    this.textString = `第 ${this.count} 天`
    this.text.setText(this.textString)
    // this.text.setText(`${this.count} 天后`)
    // this.pageTurn()
  }
  update () {
    if (this.count < 300 && !this.printing) {
      this.printing = true
      this.space = this.space - 50 < 10 ? 10 : this.space - 50
      setTimeout(() => {
        this.textString += `\n第 ${++this.count} 天`
        this.text.setText(this.textString)
        console.log(this.text.height)
        this.printing = false
      }, this.space)
    }
    if (this.count > 100) {
      this.text.alpha-=0.03
    }
    // n 天后
    // if (!this.printing && this.count < 35) {
    //   this.pageTurn()
    // }
  }
  private printAll = () => {
    if(this.print.isPrinting()) {
      return
    }
  }
  private pageTurn = () => {
    if (this.printing) {
      return
    }
    this.printing = true
    setTimeout(() => {
      // let counter = 30
      this.text.setText(`第 ${++this.count} 天`)
      // 阳性 x 天后
      let counter = 30
      // this.text.setText(`${++this.count}  天后`)
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
}
