import { isMobile, throttle } from "../utils";
import Phaser from "phaser";
import { testScenes } from "~/utils/game-controller";

const PAGE_SPACE = 5000
const textArray = {
  page1: <div>正在启动 World</div>,
  page2: <div>
    <div>World 未能正常启动。原因可能是最近您遇到了一些心理或生理问题。请您核查近期是否有以下问题：</div>
    <br />
    <div>&nbsp;&nbsp;1. 遇到了百年一遇天灾 / 人祸。如：疫病等。</div>
    <div>&nbsp;&nbsp;2. 过于忧虑自己以及家人朋友的健康和安全。</div>
    <div>&nbsp;&nbsp;3. 工作或学习受到影响，被裁员、求职困难，或考试由于某种不可抗力取消，原本的生活轨迹被打乱。</div>
    <div>&nbsp;&nbsp;4. 近半年有一段时间处于饥饿状态。可能由于买不到菜，或其他因素。</div>
    <div>&nbsp;&nbsp;5. 担心未来。</div>
    <br />
    <div>如果无法确认是否存在以上情形，请根据下列关键词回忆，或与您的朋友联系，已获得帮助。</div>
    <br />
    <div>&nbsp;&nbsp;时间：2022 年</div>
    <br />
    <div>&nbsp;&nbsp;地点：上半年：上海；下半年：甘肃、广州、北京、河南等其他城市</div>
  </div>
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
  private containerDom
  init () {
    if (testScenes && testScenes !== 'start') {
      this.scene.stop('start')
      this.scene.start(testScenes)
    }
  }
  create () {
    if (testScenes && testScenes !== 'start') {
      return
    }
    this.enter = this.input.keyboard.addKey(13)
    this.gameView = document.getElementById('container')
    if (this.gameView) {
      this.gameView.style.display = 'none'
    }
    document.body.classList.add('explaination')
    this.containerDom = document.createElement('div')
    this.containerDom.className = 'content-box'
    // 按顺序展示 page
    const text = document.createElement('div')
    text.className = 'text'
    this.containerDom.appendChild(text)

    const allPages = Object.keys(textArray)
    let isLastPage = false
    allPages.forEach((page, index) => {
      console.log(page,'page')
      this.timerArr.push(setTimeout(() => {
        this.containerDom.classList.add(page)
        if (index === allPages.length - 1) {
          // 最后一页，不清空，enter 跳转
          text.innerHTML = ''
          isLastPage = true
        } else {
          this.timerArr.push(setTimeout(() => {
            this.containerDom.classList.remove(page)
          }, PAGE_SPACE * (index + 1)))
        }
        text.appendChild(textArray[page])
      }, PAGE_SPACE * index))
    })
    document.body.appendChild(this.containerDom)
    // PC
    this.continue = throttle(() => {
      if (!!this.containerDom && isLastPage) {
        document.body.removeChild(this.containerDom)
        this.containerDom = <></>
        this.timerArr.forEach((i) => clearTimeout(i))
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
