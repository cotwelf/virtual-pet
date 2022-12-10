import { isMobile, throttle } from "../utils";
import Phaser from "phaser";

const PAGE_SPACE = 5000
const textArray = {
  page1: ['正在启动 World'],
  page2: [
    ['World 未能正常启动。原因可能是最近您遇到了一些心理或生理问题。请您核查近期是否有以下问题：<br />'],
    ['&nbsp;&nbsp;1. 遇到了百年一遇天灾 / 人祸。如：疫病等。'],
    ['&nbsp;&nbsp;2. 过于忧虑自己以及家人朋友的健康和安全。'],
    ['&nbsp;&nbsp;3. 工作或学习受到影响，被裁员、求职困难，或考试由于某种不可抗力取消，原本的生活轨迹被打乱。'],
    ['&nbsp;&nbsp;4. 近半年有一段时间处于饥饿状态。可能由于买不到菜，或其他因素。'],
    ['&nbsp;&nbsp;5. 担心未来。<br />'],
    ['如果无法确认是否存在以上情形，请根据下列关键词回忆，或与您的朋友联系，已获得帮助。<br>'],
    ['&nbsp;&nbsp;&nbsp;&nbsp;时间：2022 年<br>'],
    ['&nbsp;&nbsp;&nbsp;&nbsp;地点：上半年：上海；下半年：甘肃、广州、北京、河南等其他城市<br>'],
  ]
}
export default class Start extends Phaser.Scene {
  constructor () {
    super('start')
  }
  private enter
  private gameView
  private continue
  private isMobile = isMobile()
  private timerArr: number[] = []
  create () {
    this.enter = this.input.keyboard.addKey(13)
    this.gameView = document.getElementById('container')
    if (this.gameView) {
      this.gameView.style.display = 'none'
    }
    document.body.classList.add('explaination')
    let contentBox = document.createElement('div')
    contentBox.className = 'content-box'
    // 按顺序展示 page
    const text = document.createElement('div')
    text.className = 'text'
    contentBox.appendChild(text)
    const allPages = Object.keys(textArray)
    let isLastPage = false
    allPages.forEach((page, index) => {
      this.timerArr.push(setTimeout(() => {
        contentBox.classList.add(page)
        if (index === allPages.length - 1) {
          // 最后一页，不清空，enter 跳转
          text.innerHTML = ''
          isLastPage = true
        } else {
          this.timerArr.push(setTimeout(() => {
            contentBox.classList.remove(page)
          }, PAGE_SPACE * (index + 1)))
        }
        textArray[page].forEach((i) => {
          text.innerHTML = `${text.innerHTML === '' ? '' : `${text.innerHTML}<br />`}${i}`
        })
      }, PAGE_SPACE * index))
    })
    document.body.appendChild(contentBox)
    // PC
    this.continue = throttle(() => {
      if (!!contentBox && isLastPage) {
        document.body.removeChild(contentBox)
        contentBox = <></>
        this.timerArr.forEach((i) => clearTimeout(i))
        document.documentElement.classList.add('playing')
        this.scene.stop('start')
        this.scene.start('welcome')
        setTimeout(() => {
          document.body.classList.remove('explaination')

        this.gameView.style.display = 'block'
        }, 1000)
      }
    }, 500)
    // mobile
    if (this.isMobile) {
      document.body.addEventListener('click', this.continue)
    }
  }
  update() {
    if (!this.isMobile && this.enter.isDown) {
      this.continue()
    }
  }
}
