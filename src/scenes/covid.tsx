import Phaser from 'phaser'
import { createDialogueDom, getStorageData, printText, setStorageData, toggleTips, TYPES_CNAME } from '~/utils'
import { ASSET_KEYS, handleAssets } from '~/utils/handle-assets'
import { eventDaily, IEventResItem } from '../../public/assets/events'

export default class Covid extends Phaser.Scene {
  constructor () {
    super('covid')
  }
  private covImg
  private cGraphics!: Phaser.GameObjects.Graphics
  private tGraphics!: Phaser.GameObjects.Graphics
  private gameStart
  private tips!: Phaser.GameObjects.Group
  public gameWidth
  public gameHeight
  private testing = false
  private interval

  private allData
  private resultModal
  init() {
    this.allData = getStorageData()
  }
  preload(){
    this.load.image('cov', 'images/covid/cov.png')
    this.load.image('tip', 'images/covid/tip.png')
  }
  create(){
    handleAssets.play(this, ASSET_KEYS.AUDIO.COVIDBGMSHORT.KEY, { volume: 0.2 })
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
    // 插入核酸背景图
    this.covImg = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'cov')
    this.covImg.scale = 0.8

    //创建两个矩形：C 和 T
    this.cGraphics = this.add.graphics();
    this.cGraphics.fillStyle(0x263238)
    this.cGraphics.alpha = 0
    this.cGraphics.fillRoundedRect(this.gameWidth * 0.45, this.gameHeight * 0.44, 70, 10, 0);
    this.tGraphics = this.add.graphics();
    this.tGraphics.fillStyle(0x263238)
    this.tGraphics.alpha = 0
    this.tGraphics.fillRoundedRect(this.gameWidth * 0.45, this.gameHeight * 0.54, 70, 10, 0);
    // gameStart
    let start = this.add.graphics()
    start.fillRoundedRect(this.gameWidth * 0.44, this.gameHeight * 0.73, 100, 100, 50)
    start.generateTexture("gameStart", 100, 100)
    start.alpha = 0
    this.gameStart = this.add.sprite(this.gameWidth * 0.39, this.gameHeight * 0.73, "gameStart").setOrigin(0)
    this.gameStart.setInteractive()
    this.gameStart.on('pointerdown', (pointer) => {
      console.log(this.allData)
      this.cGraphics.alpha = 0
      this.tGraphics.alpha = 0
      this.testing = true
    }, this)
    this.gameStart.on('pointerup', (pointer) => {
      this.testing = false
      this.gameStart.disableInteractive()
    }, this)
    // 创建一个组，放 tips
    // 1. 图片
    this.tips = this.add.group()
    let tipImg = this.add.image(this.gameWidth / 2, this.gameHeight - 80, 'tip')
    tipImg.scale = 0.8
    // 2. 文字
    this.tips.add(tipImg)
  }
  update() {
    // 开始抗原
    if (this.testing && !this.interval) {
      handleAssets.play(this, ASSET_KEYS.AUDIO.COVIDING.KEY, { volume: 0.7 })
      this.interval = setInterval(() => {
        if (this.cGraphics.alpha !== 1) {
          this.cGraphics.alpha += 0.5
        } else if (this.tGraphics.alpha !== 1) {
          this.tGraphics.alpha += 0.3
        } else if (this.tGraphics.alpha === 1) {
          this.cGraphics.alpha = 0
          this.tGraphics.alpha = 0
        }
      }, 100)
    } else if (!this.testing && !!this.interval) {
      clearInterval(this.interval)
      handleAssets.stop(this, ASSET_KEYS.AUDIO.COVIDING.KEY)
      this.interval = null
      if (this.cGraphics.alpha === 0 && this.tGraphics.alpha === 0) {
        // 抗原失效
        this.tGraphics.alpha = 1
        this.resultModal = this.addResultModal('again')
      } else if (this.tGraphics.alpha > 0) {
        // 阳性
        handleAssets.play(this, ASSET_KEYS.AUDIO.YANG.KEY, { volume: 0.2 })
        this.resultModal = this.addResultModal('yang')
      } else if (this.cGraphics.alpha > 0) {
        // 阴性
        this.resultModal = this.addResultModal('yin')
      }
    }

  }
  private addResultModal(type: 'yang' | 'yin' | 'again') {
    const dialogueObj: IEventResItem = eventDaily.covid[type][Phaser.Math.RND.integerInRange(0, eventDaily.covid[type].length - 1)]
    let dialogue = dialogueObj.text
    let print
    const btnList = [
      {
        text: '我知道了',
        onClickFn: () => {
          handleAssets.play(this, ASSET_KEYS.AUDIO.CLICK.KEY)
          handleAssets.stop(this, ASSET_KEYS.AUDIO.YANG.KEY)
          print.stop(this)
          switch(type) {
            case 'again':
              this.resultModal.destroy()
              this.cGraphics.alpha = 0
              this.tGraphics.alpha = 0
              this.gameStart.setInteractive()
            case 'yin':
            case 'yang':
              this.gameStart.destroy()
              let tips = ''
              console.log(dialogueObj)
              if (dialogueObj?.dataChange) {
                tips = tips + dialogueObj.dataChange.map(i => {
                  let change
                  if (i.data !== undefined) {
                    change = Object.keys(i.data).map(j => {
                      if (this.allData.basicData) {
                        this.allData.basicData[j] += i.data ? i.data[j] : 0
                        if (this.allData.basicData[j] < 0) {
                          this.allData.basicData[j] = 0
                        }
                      }
                      return `${TYPES_CNAME[j]} ${i.data && i.data[j]}`
                    }).join(', ')
                  }
                  console.log(i.naze, change)
                  return `${i.naze} ${change}`
                }).join('\n')
                setStorageData('basicData', this.allData.basicData)
                setStorageData('eventDailyRecord', { ...this.allData.eventDailyRecord, covid: true })
              }
              toggleTips(this, tips)
              this.resultModal.destroy()
              setTimeout(() => {
                handleAssets.stop(this, ASSET_KEYS.AUDIO.COVIDBGMSHORT.KEY)
                this.scene.start('home')
              }, 3000)
          }
        }
      }
    ]
    setTimeout(() => {
      this.resultModal = this.add.dom(0, 0, createDialogueDom('big', { btnList: btnList })).setOrigin(0)
      print = printText(this, document.getElementById('modal-text'), dialogue)
    }, 1000)
  }
}
