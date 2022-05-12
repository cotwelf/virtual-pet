import { CEILING, DATA_TYPES } from './consts'
import { IBasicDataType, IValueChangeType } from './types'

export * from './consts'

export const createDialogueDom = function (type: 'small' | 'big', config: string | {
  btnList: {
    text: string,
    className?: string,
    id?: string,
    onClickFn: () => void
  }[],
  dialogueText: string,
}) {
  const el = document.createElement('div')
  el.classList.add('dialogue', type)
  if (typeof config === 'string') {
    el.innerText = config
  } else {
    const text = createDom('div',{className: 'dialogue-text'})
    text.innerText =  config.dialogueText
    el.appendChild(text)
    const btnBox = createDom('div', {className: `btn${config.btnList.length > 1 ? '-box' : ''}`})
    if (config.btnList.length > 1) {
      config.btnList.forEach((i, index) => {
        let child = createDom('div', {className: `btn btn-${index} ${i.className ? i.className : ''}`})
        child.innerText = i.text
        child.addEventListener('click', i.onClickFn)
        btnBox.appendChild(child)
      })
    }
    el.appendChild(btnBox)
  }
  return el
}

export const createBtnSet = (
  btnList: {
    text: string,
    className?: string,
    id?: string,
    onClickFn: () => void
  }[]
) => {
  const btnBox = createDom('div', {className: `btn${btnList.length > 1 ? '-box' : ''}`})
  if (btnList.length > 1) {
    btnList.forEach((i, index) => {
      let child = createDom('div', {className: `btn btn-${index} ${i.className ? i.className : ''}`})
      child.innerText = i.text
      child.addEventListener('click', i.onClickFn)
      btnBox.appendChild(child)
    })
  }
  return btnBox
}

export const showCurrentData = (type: IBasicDataType, value: number) => {
  const el = document.createElement('div')
  const percent = document.createElement('div')
  const inner = document.createElement('div')
  percent.appendChild(inner)
  el.appendChild(percent)
  el.id = 'current-data'
  el.className = type
  percent.className = 'percent'
  inner.style.width = `${value / CEILING * 100}%`
  return el
}


export const createDom = (type: string, opt?: {className?: string, id?: string}) => {
  const el = document.createElement(type)
  if (opt) {
    for (let key in opt) {
      el[key] = opt[key]
    }
  }
  return el
}