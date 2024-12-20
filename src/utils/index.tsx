import classNames from 'classnames'
import { CEILING, DATA_TYPES } from './consts'
import { soundsAssets, dialoguesAssets } from '../../public'
import { IBasicData, IValueChangeType } from './types'
import { amplifyDom, ITransformElement } from './amplify'

export * from './consts'
export * from './data-storage'
// export * from './api'
const scaleType = ['scale-fast', 'scale-slow']

type IText = {
  text: string,
  scale?: {
    speed?: string,
    index: number,
    type?: string
  }
}
export const isMobile = () => /Android|webOS|iPhone|iPod|BlackBerry|Mobile|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const throttle = function (fn: () => void, delay: number) {
  let timer = 0
  return function () {
    if ( timer ) {
      return
    }
    fn()
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = 0
    }, delay || 500)
  }
}
export const createDialogueDom = function (type: 'dialogue' | 'small' | 'big', config: string | {
  btnList: {
    text: string,
    className?: string,
    id?: string,
    onClickFn: () => void
  }[],
  dialogueText?: string,
}) {
  return (
    <div className={classNames('modal', [ type ], { mobile: isMobile() })}>
      { typeof config === 'string' ? config : (
        <>
          <div id='modal-text'>{config.dialogueText}</div>
          <div className='btn-box'>
            { config.btnList.map((dom, index) => (
              <div
                key={`${index}${dom.text.replace(' ', '')}`}
                className={classNames(`btn btn-${index}`, [dom.className])}
                onClick={dom.onClickFn}
              >
                {dom.text}
              </div>
            )) }
          </div>
        </>)}
    </div>
  )
}

export const printText = function(that, dom: HTMLElement | null, text: string | IText[], type = 'normal'){
  let printSpeed = {
    normal: 200,
    fast: 100,
    slow: 200,
    noSpace: 0,
  }
  let interval
  let timeout
  let printing
  let finalShowHTML = ''
  let originalText = ''
  let transformElement: ITransformElement = {
    scaleDom: {
      id: '',
      transType: '',
      speed: '',
    },
    moveOrderId: []
  }
  if (typeof text !== 'string') {
    originalText = ''
    text.forEach((i) => {
      originalText = `${originalText}${i.text}`
      if (i.scale) {
        finalShowHTML = `${finalShowHTML}<span class="scaled-text ${i.scale.index === 0 ? `${i.scale.speed} ${i.scale.type}` : ''}" id="scale-${i.scale.index}">${i.text}</span>`
        transformElement.moveOrderId.push(`scale-${i.scale.index}`)
        if (i.scale.index === 0) {
          transformElement.scaleDom = {
            id: `scale-${i.scale.index}`,
            transType: i.scale.type || '',
            speed: i.scale.speed || ''
          }
        }
      } else {
        finalShowHTML = `${finalShowHTML}<span>${i.text}</span>`
      }
    })
  } else {
    originalText = text
    finalShowHTML = text
  }
  if (!!dom) {
    soundsAssets.handler.play(that, soundsAssets.keys.PRINTING.KEY)
    printing = true
    dom.classList.add('printing')
    let currentText = originalText
      timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (currentText.length > 0) {
          dom.innerHTML = `${dom.innerText}${currentText[0] === ' ' ? '\xa0' : currentText[0]}`
          currentText = currentText.substring(1, currentText.length)
        } else {
          transformElement.moveOrderId.sort()
          dom.innerHTML = `<span ${transformElement.moveOrderId.length > 0? 'class="light-dark"' : ''}>${finalShowHTML}</span>`
          amplifyDom(transformElement)
          // 顺序缩放
          // const position = document.getElementById('scale-fast1')?.getBoundingClientRect()
          // const left = position?.left
          // document.body.classList.add('amplified', `x${left}`, `y${position?.top}`)
          // console.log(left, 'left')
          printing = false
          dom.classList.remove('printing')
          soundsAssets.handler.stop(that, soundsAssets.keys.PRINTING.KEY)
          clearInterval(interval)
        }
      }, printSpeed[type])
    }, type == 'noSpace' ? 0 : 150)
  } else {
    setTimeout(() => {
      printText(that, dom, text)
    }, 100)
  }
  function stop(that) {
    return new Promise((resolve) => {
      if (printing) {
        toggleTips(that, '不听完我说完吗 qwq')
      } else {
        clearTimeout(timeout)
        clearInterval(interval)
        resolve(true)
      }
    })
  }
  return {
    stop,
    isPrinting: () => {
      return printing
    },
    clear: () => {
      if (!!dom) {
        dom.innerHTML = ''
      }
    }
  }
}

export const showCurrentData = function(type: IBasicData, value: number, onChange: (jump: 1 | -1) => void) {
  const width = document.body.clientWidth
  return (
    <div id='current-data' className={classNames([ type ], { mobile: isMobile() })}>
      <div className={classNames('previous', { disabled: type === DATA_TYPES[0] })} onClick={() => onChange(-1)}></div>
      <div className='percent'>
        <div style={{ width: `calc(${value / CEILING * 100}% + ${width < 900 ? '6px' : '8px'})` }}></div>
      </div>
      <div
        className={classNames('next', { disabled: type === DATA_TYPES[DATA_TYPES.length - 1] })}
        onClick={() => onChange(1)}
      ></div>
    </div>
  )
}

export const toggleTips = (that, text: string, close = true) => {
  if (that.tips) {
    that.tips.destroy()
  }
  that.tips = that.add.dom(0, 0, <div className='tips'>{text}</div>).setOrigin(0)
  if (!close) {
    return
  }
  setTimeout(() => {
    that.tips.destroy()
  }, 3000)
}

// 以 hidden 属性来作为判断浏览器前缀的依据
function getBrowserPrefix() {
  // check hidden
  if ('hidden' in document) {
    return null
  }
  // All the possible prefixes
  const browserPrefixes = ['moz', 'ms', 'o', 'webkit']
  for (let i = 0; i < browserPrefixes.length; i += 1) {
    const prefix = `${browserPrefixes[i]}Hidden`
    if (prefix in document) {
      return browserPrefixes[i]
    }
  }
  // The API is not supported in browser
  return null
}

export const getVisibilityEvent = () => {
  const prefix = getBrowserPrefix()
  if (prefix) {
    return `${prefix}visibilitychange`
  }
  return 'visibilitychange'
}
