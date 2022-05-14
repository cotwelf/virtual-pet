import classNames from 'classnames'
import { CEILING, DATA_TYPES } from './consts'
import { IBasicDataType, IValueChangeType } from './types'

export * from './consts'
export * from './localstorage'

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
    <div className={classNames([ type ], { mobile: isMobile() })}>
      { typeof config === 'string' ? config : (
        <>
          <div id={`${type}-text`}>{config.dialogueText}</div>
          <div className={classNames('btn', {'btn-box': config.btnList.length > 1})}>
            {config.btnList.map((dom, index) => (
              <div
                key={`${index}${dom.text}`}
                className={classNames(`btn btn-${index}`, [dom.className])}
                onClick={dom.onClickFn}
              >
                {dom.text}
              </div>
            ))}
          </div>
        </>)}
    </div>
  )
}

export const printText = function(dom: HTMLElement | null, text: string){
  if (!!dom) {
    let interval
    let currentText = text
    setTimeout(() => {
      interval = setInterval(() => {
        if (currentText.length > 0) {
          dom.innerText = dom.innerText + currentText[0]
          currentText = currentText.substring(1, currentText.length)
        } else {
          clearInterval(interval)
        }
      }, 200)
    },150)
  } else {
    printText(dom, text)
  }
}

export const showCurrentData = function(type: IBasicDataType, value: number, onChange: (jump: 1 | -1) => void) {
  return (
    <div id='current-data' className={classNames([ type ], { mobile: isMobile() })}>
      <div className={classNames('previous', { disabled: type === DATA_TYPES[0] })} onClick={() => onChange(-1)}></div>
      <div className='percent'>
        <div style={{ width: `${value / CEILING * 100}%` }}></div>
      </div>
      <div
        className={classNames('next', { disabled: type === DATA_TYPES[DATA_TYPES.length - 1] })}
        onClick={() => onChange(1)}
      ></div>
    </div>
  )
}

