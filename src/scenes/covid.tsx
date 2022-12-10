import Phaser from 'phaser'
import { createDialogueDom, DATA_TYPES, getData, printText, setData, toggleTips, TYPES_CNAME } from '~/utils'
import { covidBgmOn, filmVersion, leisureDuration, printLoop, testScenes } from '~/utils/game-controller'
import { soundsAssets } from '../../public'
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

  private dataStorage
  private resultModal

  private did = false

  // filmVersion
  private dialogueIndex = 0
  init() {
    this.dataStorage = getData()
  }
  preload(){
    this.load.image('cov', 'images/covid/cov.png')
    this.load.image('tip', 'images/covid/tip.png')
  }
  create(){
    if (covidBgmOn) {
      soundsAssets.handler.play(this, soundsAssets.keys.COVIDBGMSHORT.KEY, { volume: 0.2 })
    }
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
      this.did = true
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
    // 10s 内没有核酸完成，视为错过核酸
    setTimeout(() => {
      if (this.did) {
        return
      }
      this.gameStart.disableInteractive()
      soundsAssets.handler.stop(this, soundsAssets.keys.COVIDING.KEY)
      this.resultModal = this.addResultModal('miss')
    }, leisureDuration)
  }
  update() {
    // 开始抗原
    if (this.testing && !this.interval) {
      if (covidBgmOn) {
        soundsAssets.handler.play(this, soundsAssets.keys.COVIDING.KEY, { volume: 0.7 })
      }
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
      soundsAssets.handler.stop(this, soundsAssets.keys.COVIDING.KEY)
      this.interval = null
      if (this.cGraphics.alpha === 0 && this.tGraphics.alpha === 0) {
        // 抗原失效
        this.tGraphics.alpha = 1
        this.resultModal = this.addResultModal('again')
      } else if (this.tGraphics.alpha > 0) {
        // 阳性
        if (covidBgmOn) {
          soundsAssets.handler.play(this, soundsAssets.keys.YANG.KEY, { volume: 0.2 })
        }
        this.resultModal = this.addResultModal('yang')
      } else if (this.cGraphics.alpha > 0) {
        // 阴性
        this.resultModal = this.addResultModal('yin')
      }
    }

  }
  private addResultModal(type: 'yang' | 'yin' | 'again' | 'miss') {
    const toHome = () => {
      setData({...this.dataStorage, dayCounter: this.dataStorage.dayCounter + 1})
      this.scene.stop('covid')
      this.scene.start('home')
      return
    }
    // 页面 2min 无反应，自动跳到下一个页面
    const nextPageTimer = setTimeout(toHome, 120000)
    let dialogueObj: IEventResItem
    if(filmVersion) {
      dialogueObj = eventDaily.covid[type][this.dialogueIndex++] || eventDaily.covid[type][Phaser.Math.RND.integerInRange(0, eventDaily.covid[type].length - 1)]
    } else {
      dialogueObj = eventDaily.covid[type][Phaser.Math.RND.integerInRange(0, eventDaily.covid[type].length - 1)]
    }
    let dialogue = dialogueObj.text
    let print
    const btnList = [
      {
        text: '我知道了',
        onClickFn: async () => {
          clearTimeout(nextPageTimer)
          soundsAssets.handler.play(this, soundsAssets.keys.CLICK.KEY)
          soundsAssets.handler.stop(this, soundsAssets.keys.YANG.KEY)
          let result = await print.stop(this)
          if (!result) {
            return
          }
          switch(type) {
            case 'again':
              this.resultModal.destroy()
              this.cGraphics.alpha = 0
              this.tGraphics.alpha = 0
              this.gameStart.setInteractive()
            case 'yin':
            case 'yang':
            case 'miss':
              this.gameStart.destroy()
              let tips = ''
              if (dialogueObj?.dataChange) {
                tips = tips + dialogueObj.dataChange.map(i => {
                  let changeText
                  let currentType: string
                  let currentValue
                  if (i.data !== undefined) {
                    changeText = Object.keys(i.data).map(type => {
                      if (this.dataStorage.basicData) {
                        if (!i.data) {
                          return
                        }
                        currentType = Object.keys(i.data)[0]
                        currentValue = i.data[currentType]
                        // TODO: 这是一个已经减到 0 的溢出值
                        let overCount = 0
                        if (this.dataStorage.basicData[type] === 0) {
                          currentType = DATA_TYPES.filter(key => this.dataStorage.basicData[key] !== 0).pop() || ''
                          if (!currentType) {
                            console.log(currentType, 'currentType')
                            // 都是 0 了orz
                            this.scene.stop('covid')
                            this.scene.start('end')
                            return
                          }
                        }
                        console.log(currentType, currentValue, this.dataStorage.basicData[type], 'i.data')
                        this.dataStorage.basicData[currentType] += currentValue
                        if (this.dataStorage.basicData[currentType] < 0) {
                          this.dataStorage.basicData[currentType] = 0
                        }
                      }
                      return `${TYPES_CNAME[currentType]} ${currentValue}`
                    }).join(', ')
                  }
                  return `${i.naze} ${changeText}`
                }).join('\n')
                setData(this.dataStorage)
              }
              toggleTips(this, tips)
              this.resultModal.destroy()
              setTimeout(() => {
                soundsAssets.handler.stop(this, soundsAssets.keys.COVIDBGMSHORT.KEY)
                toHome()
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
