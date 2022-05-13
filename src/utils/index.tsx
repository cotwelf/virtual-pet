import classNames from 'classnames'
import { CEILING, DATA_TYPES, LOCALSTORAGE_ITEM } from './consts'
import { IBasicDataType, IValueChangeType } from './types'

export * from './consts'

export const createDialogueDom = function (type: 'dialogue' | 'small' | 'big', config: string | {
  btnList: {
    text: string,
    className?: string,
    id?: string,
    onClickFn: () => void
  }[],
  dialogueText?: string,
}) {
  let el
  let currentText = ''
  if (typeof config === 'string') {
    el = <div className={classNames('dialogue', [ type ])}>{config}</div>
  } else {
    el = (
      <div className={classNames('dialogue', [ type ])}>
        <div id='dialogue-text'>{config.dialogueText}</div>
        <div className={classNames('btn', {'btn-box': config.btnList.length > 1})}>
          { config.btnList.map((dom, index) => (
            <div
              key={`${index}${dom.text}`}
              className={classNames(`btn btn-${index}`, [dom.className])}
              onClick={dom.onClickFn}
            >
              {dom.text}
            </div>
          )) }
        </div>
      </div>
    )
  }
  return el
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

export const showCurrentData = (type: IBasicDataType, value: number) => {
  const el = (
    <div id='current-data' className={type}>
      <div className='percent'>
        <div style={{width: `${value / CEILING * 100}%`}}></div>
      </div>
    </div>
  )
  return el
}

export const getBasicData = () => {
  let data = {
    health: 0,
    feeling: 0,
    knowledge: 0,
    relationship: 0,
  }
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.BASIC_DATA) || '')
  } catch (e) {
    // PASS
  }
  return data
}
export const setBasicData = (basicData: object) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.BASIC_DATA, JSON.stringify(basicData))
  } catch (e) {
    // PASS
  }
}