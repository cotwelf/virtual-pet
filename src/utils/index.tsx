import classNames from 'classnames'
import { CEILING, DATA_TYPES } from './consts'
import { getInteractTimes, setInteractTimes } from './localstorage'
import { IBasicDataType, IValueChangeType } from './types'

export * from './consts'
export * from './localstorage'
export * from './api'

export const isMobile = () => /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

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
          <div className={classNames('btn', {'btn-box': config.btnList.length > 1})}>
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

export const printText = function(dom: HTMLElement | null, text: string, type = 'normal'){
  let printSpeed = {
    normal: 200,
    fast: 100,
    slow: 200,
  }
  if (!!dom) {
    let interval
    let currentText = text
    setTimeout(() => {
      interval = setInterval(() => {
        if (currentText.length > 0) {
          dom.innerHTML = `${dom.innerText}${currentText[0] === ' ' ? '\xa0' : currentText[0]}`
          currentText = currentText.substring(1, currentText.length)
        } else {
          clearInterval(interval)
        }
      }, printSpeed[type])
    },150)
  } else {
    printText(dom, text)
  }
}

export const showCurrentData = function(type: IBasicDataType, value: number, onChange: (jump: 1 | -1) => void) {
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

export const toggleTips = (that, text: string) => {
  if (that.tips) {
    that.tips.destroy()
  }
  that.tips = that.add.dom(0, 0, <div className='tips'>{text}</div>).setOrigin(0)
  setTimeout(() => {
    that.tips.destroy()
  }, 5000)
}
