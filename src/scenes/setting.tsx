import classNames from "classnames";
import Phaser from "phaser";
import { createDialogueDom, printText, CharacterKeys, setCharacterKey, setBasicData } from "~/utils";
import { IBasicDataType } from "~/utils/types";

const CHARACTER_KEY_LIST = ['girl', 'boy']

export default class Setting extends Phaser.Scene {
  constructor () {
    super('setting'); // given the key to uniquely identify it from other Scenes
  }
  private characters = [CharacterKeys.Girl, CharacterKeys.Boy]
  private currentCharacter
  private currentkey

  private selectDom

  private basicData: {
    type: IBasicDataType,
    name: string,
    value: number,
    selected: boolean
  }[] = [
    {
      type: 'health',
      name: '健康',
      value: 5,
      selected: false,
    },
    {
      type: 'feeling',
      name: '心情',
      value: 5,
      selected: true,
    },
    {
      type: 'knowledge',
      name: '知识',
      value: 5,
      selected: false,
    },
    {
      type: 'relationship',
      name: '人际',
      value: 5,
      selected: false,
    },
  ]
  private sumValue = 0
  private basicDataDom

  private gameWidth
  private gameHeight
  init () {
    this.currentkey = this.characters[0]
    this.gameWidth = this.scale.width
    this.gameHeight = this.scale.height
  }
  preload () {
    this.characters.forEach(c => {
      this.load.spritesheet(
        c,
        `images/characters/${c}.png`,
        { frameWidth: 320, frameHeight: 320 }
      )
    })
  }
  create () {
    this.characters.forEach(c => {
      this.anims.create({
        key: `${c}-alive`,
        frames: this.anims.generateFrameNames(c, { start: 0, end: 2 }),
        frameRate: 3,
        repeat: -1
      });
    })

    this.currentCharacter = this.add.sprite(
      this.gameWidth * 0.5,
      this.gameHeight * 0.5,
      this.characters[0]
    ).play(`${this.characters[0]}-alive`)

    this.updateSelectDom()
  }
  update(){

  }
  private updateSelectDom() {
    if (this.selectDom) {
      this.selectDom.destroy()
    }
    this.selectDom = this.add.dom(0, 0, (
      <div className='character'>
        <div className='btn-box'>
          <div className={classNames('previous', { disabled: this.characters.indexOf(this.currentkey) === 0 })} onClick={() => this.changeCharacter(-1)} />
          <div className={classNames('next', { disabled: this.characters.indexOf(this.currentkey) === this.characters.length - 1 })} onClick={() => this.changeCharacter(1)} />
        </div>
        <div className="confirm-btn" onClick={this.setOriginData.bind(this)}>选择这个大冤种</div>
      </div>
    )).setOrigin(0)
  }
  private changeCharacter(handle: number) {
    this.currentCharacter.destroy()
    this.currentCharacter = this.add.sprite(
      this.gameWidth * 0.5,
      this.gameHeight * 0.5,
      this.characters[this.characters.indexOf(this.currentkey) + handle]
    ).play(`${this.characters[this.characters.indexOf(this.currentkey) + handle]}-alive`)
    this.currentkey = this.characters[this.characters.indexOf(this.currentkey) + handle]
    this.updateSelectDom()
  }
  private onChangeData(type: IBasicDataType, value: 1 | -1) {
    let updated = false
    // 可分配 > 0 分，可加
    if ((this.sumValue < 1 && value === 1) || (this.sumValue > 9 && value === -1)) {
      return
    }
    let newData = this.basicData.map(data => {
      if (data.type === type) {
        data.value += value
        this.sumValue -= value
        updated = true
      }
      return data
    })
    if (!updated) {
      return
    }
    this.basicData = newData
    this.updateBasicDataDom()
  }
  private onDataTypeSelected (type: IBasicDataType) {
    let updated = false
    let newData = this.basicData.map(data => {
      if (data.type === type) {
        data.selected = true
      } else {
        data.selected = false
      }
      return data
    })
    this.basicData = newData
    this.updateBasicDataDom()
  }

  private updateBasicDataDom () {
    if (this.basicDataDom) {
      this.basicDataDom.destroy()
    }
    // 确定初始数据值
    this.basicDataDom = this.add.dom(0, 0, (
      <div className='set-basic-data'>
        <div className='basic-data'>
          { this.basicData.map(data => (
            <div
              key={data.type}
              className={classNames('data-item', [data.type], {selected: data.selected})}
              onClick={() => this.onDataTypeSelected(data.type)}
            >
              { data.selected && (
                <div className='btn-box'>
                  <div
                    className={classNames('minus', { disabled: data.value === 0 })}
                    onClick={() => this.onChangeData(data.type, -1)}
                  />
                  <div
                    className={classNames('plus', { disabled: data.value === 10 })}
                    onClick={() => this.onChangeData(data.type, 1)}
                  />
                </div>
              )}
              <div className='data-name'>
                <span>{data.name}</span><span>{data.value}</span>
              </div>
              <div className='percent'>
                <div style={{ width: `${data.value / 10 * 100}%` }}></div>
              </div>
            </div>
          )) }
          <div className="score-tips">{`还可分配 ${this.sumValue} 分`}</div>
          <div className="start" onClick={this.toHome.bind(this)}>我准备好啦~</div>
        </div>
      </div>
    )).setOrigin(0)
  }
  private toHome () {
    let data
    this.basicData.forEach(i => {
      data = {
        ...data,
        [i.type]: i.value,
      }
    })
    console.log(data)
    setBasicData(data)
    this.scene.stop('setting')
    this.scene.start('home')
  }
  private setOriginData() {
    setCharacterKey(this.currentkey)
    this.selectDom.destroy()
    this.currentCharacter.destroy()
    this.updateBasicDataDom()
  }
}
