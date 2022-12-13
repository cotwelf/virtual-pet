import { getData, isMobile, throttle } from "../utils";
import Phaser from "phaser";
import { soundsAssets } from "~/../public";

export const theEndText = [
  {
    id: 0,
    title: '',
    value: <ul>
    <li>作品：彭修文</li>
    <li>指导老师：陈海璐</li>
  </ul>,
  },
  {
    id: 1,
    title: <div>背景音来源：</div>,
    value: (<ul>
      <li>燃新闻 - B站 BV1634y1e7mo</li>
      <li>芍药与丁香 - B站 BV1s5411D73c</li>
      <li>国本剛章 - 城外BGM [迷宮組曲 ミロンの大冒険]</li>
      <li>山下絹代 - Poison Mind (ボスBGM) [悪魔城ドラキュラ]</li>
    </ul>)
  },
  {
    id: 2,
    title: '',
    value: <ul>
      <li>华东师范大学设计学院</li>
      <li>动漫与影像设计方向 2020 级毕业设计</li>
    </ul>
  }
]

export default class End extends Phaser.Scene {
  constructor () {
    super('end')
  }
  private isMobile = isMobile()
  private containerDom
  create () {
    soundsAssets.handler.stop(this, soundsAssets.keys.BGM_LIGHT.KEY)
    soundsAssets.handler.stop(this, soundsAssets.keys.BGM_DARK.KEY)
    const castDom = <div className='cast'></div>
    const showText = () => {
      theEndText.forEach((textObj, index) => {
        setTimeout(() => {
          castDom.innerHTML = ''
          castDom.appendChild(<div>{textObj.title}{textObj.value}</div>)
          if (index === theEndText.length - 1) {
            // 最后一个 15s 无响应，重新开始
            setTimeout(() => {
              location.reload()
            }, 5000 * index + 25000)
          }
        }, 5000 * index)
      })
    }

    this.containerDom = (<div className="tips">
      <div className='pic' />
      <div className='big-text'>
        你的世界遇到问题，需要重新启动。
        <br />
        但我们无法为你重新启动。
      </div>
      <div className="detail">
        <div className="questionnaire"></div>
        {castDom}
      </div>
      <div className='retry'>
        成功存活 {getData().dayCounter} 天
        <div className="btn" onClick={() => {
          soundsAssets.handler.play(this, soundsAssets.keys.CLICK.KEY)
          location.reload()
        }}>重新挑战</div>
      </div>
    </div>)
    this.setDom(true)
    showText()
  }
  private setDom (status: boolean) {
    // 删除游戏 container
    const gameContainer = document.getElementById('container')
    if (!!gameContainer) {
      gameContainer.style.display = status ? 'none' : 'block'
    }
    if (status) {
      document.body.classList.add('end')
      document.body.appendChild(this.containerDom)
    } else {
      document.body.classList.remove('end')
      document.body.removeChild(this.containerDom)
    }
  }
}
