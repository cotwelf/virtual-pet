import Phaser from "phaser";
import { theEndText } from "~/../public";
import { createDialogueDom, getData, printText } from "~/utils";
import { fastPrintDays, fastPrintDaysMulti, filmVersion, printLoop } from "~/utils/game-controller";
type IPageTurnConfig = {
  transition: 'linear' | 'ease-in'
  from: number
  to: number
  text: string // 一定要有 X，为即将被替换的翻页数字
}
const pageTurnConfig: IPageTurnConfig = {
  from: 1,
  to: 200,
  transition: 'linear',
  text: '第 X 天'
}

let dayCount = 1
export default class Text extends Phaser.Scene {
  constructor () {
    super('text')
  }
  private textDiv = <div></div>
  private notifyModal
  private dataStorage
  // temp
  private count = dayCount
  private textString
  private printing
  private text
  private print
  private space = 800 // 翻页间隔
  private endInterval
  private endDuration = 2800

  private theEndTextDom
  private theEndText
  init () {
    this.dataStorage = getData()
  }
  create () {
    document.getElementById("game-view")?.classList.add('text')
    this.text = this.add.dom(0, 0, this.textDiv, "text-align: center; width: 100vw").setOrigin(0)
    // film: 一行转场(1/2)
    if (fastPrintDays) {
      this.text.setText(pageTurnConfig.text.replace('X', `${this.count}`))
      this.pageTurn(pageTurnConfig)
      return
    }
    // 多行转场（1/2)
    if (fastPrintDaysMulti) {
      this.textString = `第 ${this.count} 天`
      this.text.setText(this.textString)
      return
    }
    // step: 游戏结束(1/3) 健康值为 0 时游戏结束
    if (!this.dataStorage.basicData.health) {
      this.print = printText(this, this.textDiv, `第 ${this.count++} 天`)
    } else {
      // 正常游戏跳转
      this.print = printText(this, this.textDiv, `第 ${this.dataStorage.dayCounter} 天`)
      if (printLoop) {
        setTimeout(() => {
          this.scene.stop('text')
          this.scene.start('text')
          this.textDiv = <div></div>
          document.getElementById("game-view")?.classList.remove('text')
          this.dataStorage.dayCounter += 1
        }, 3000)
        return
      } else {
        setTimeout(() => {
          this.scene.stop('text')
          this.scene.start('covid')
          this.textDiv = <div></div>
          document.getElementById("game-view")?.classList.remove('text')
          return
        }, 3000)
      }
    }
  }
  update () {
    // 多行转场(2/2)
    if (fastPrintDaysMulti) {
      if (this.count < 300 && !this.printing) {
        this.printing = true
        this.space = this.space - 80 < 10 ? 10 : this.space - 80
        setTimeout(() => {
          this.textString += `\n第 ${++this.count} 天`
          this.text.setText(this.textString)
          this.printing = false
        }, this.space)
      }
      if (this.count > 200) {
        this.text.alpha-=0.03
      }
    }

    // step: 游戏结束(2/3)
    if (!this.dataStorage.basicData.health) {
      this.theEnd()
    }

    // film: 一行转场(2/2)
    if (fastPrintDays && !this.printing && this.count < pageTurnConfig.to) {
      this.pageTurn(pageTurnConfig)
    }
  }
  private pageTurn = ({ transition, from, to, text}: IPageTurnConfig) => {
    if (this.printing) {
      return
    }
    this.printing = true
    setTimeout(() => {
      // let counter = 30
      // this.text.setText(`第 ${++this.count} 天`)

      // 阳性 x 天后
      let counter = to - from
      this.text.setText(text.replace('X', `${++this.count}`))
      this.printing = false
      if (transition === 'ease-in') {
        if (this.count < counter) {
          this.space = this.space - counter * 10 < 0 ? 0 : this.space - counter * 10
        } else {
          this.space = this.space + counter * 10 > 1000 ? 1000 : this.space + counter * 10
        }
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
  // step: 游戏结束(3/3)
  private theEnd = () => {
    const PAGE_SPACE = 2000
    if (this.endInterval) {
      return
    }
    // bg
    this.endInterval = setInterval(() => {
      if (this.print.isPrinting()) {
        return
      }
      const textString = `...第 ${this.count++} 天`
      this.print = printText(this, this.textDiv, textString, 'noSpace')
      if (this.endDuration > 2100) {
        this.endDuration -= 30
      } else {
        this.text.alpha = this.text.alpha > 0.3 ? this.text.alpha - 0.1 : 0.3
      }
    })
    let nameDiv = <div class='end-text'></div>
    setTimeout(() => {
      this.theEndTextDom = this.add.dom(0, 0, nameDiv).setOrigin(0)
      let allTheEndText = theEndText
      // for(let i = 0; i<allTheEndText.length; i++) {
      //   printPageText(allTheEndText[i])
      // }
      const printPage = (textArray) => {
        textArray.forEach((i) => {
          nameDiv.appendChild(<div>{i}</div>)
        })
        setTimeout(() => {
          nameDiv.innerHTML = ''
        }, PAGE_SPACE)
      }
      for(let i = 0; i < allTheEndText.length; i++) {
        setTimeout(() => {
          console.log(allTheEndText[i],'allTheEndText[i]')
          printPage(allTheEndText[i])
        }, PAGE_SPACE * 2 * i)
      }
    }, 3000)

    const printPageText = (textArray: string[]) => {
      return new Promise((resolve) => {
        if (this.theEndText && this.theEndText.isPrinting()) {
          setTimeout(() => {
            printPageText(textArray)
          }, 1200)
          return
        } else if (textArray.length > 0) {
          const div = <div ></div>
          nameDiv.appendChild(div)
          this.theEndText = printText(this, div, textArray.shift() || '')
          console.log(textArray)
          printPageText(textArray)
          return
        } else if (textArray.length === 0) {
          nameDiv.innerHTML = ''
          setTimeout(() => {
            return resolve(true)
          }, 2000)
        }
        return resolve(false)
      })
    }
  }
}
