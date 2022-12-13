import { amplifyScale } from "./game-controller"

export type ITransformElement = {
  scaleDom: {
    id: string,
    transType: string,
    speed: string,
  }
  moveOrderId: string[]
}

type IPosition = {
  x: number
  y: number
}

export const amplifyDom = ({ scaleDom, moveOrderId } : ITransformElement) => {
  if (moveOrderId.length === 0) {
    return
  }
  const { id: amplifyId, transType, speed } = scaleDom
  const amplifyDom = document.getElementById(amplifyId)
  // 中心缩放，获取到屏幕中心点
  const screenOrigin = {
    x: window.document.body.clientWidth / 2,
    y: window.document.body.clientHeight / 2
  }
  // 缩放目标的中心坐标
  if (!amplifyDom) {
    return
  }
  const aimPosition = {
    x: amplifyDom.getBoundingClientRect().left + amplifyDom.offsetWidth / 2 || 0 ,
    y: amplifyDom?.getBoundingClientRect().top + amplifyDom.offsetHeight / 2 || 0
  }
  const dPosition = {
    x: aimPosition.x - screenOrigin.x,
    y: aimPosition.y - screenOrigin.y
  }
  amplifyScenes({
    scale: amplifyScale.dialogue,
    duration: 2,
    position: dPosition,
  })
  document.body.classList.add(transType, speed)

}
export const amplifyScenes = ({ scale, duration, position }: {
  scale: number
  duration: number
  position?: IPosition
}) => {

  let amplified = false
  let scalePosition = position || {
    x: 0,
    y: 0
  }
  const container = document.body
  const scaleFn = (s: boolean) => {
    if (container) {
      amplified = s
      container.style.transform = s ? `scale(${scale})` : ''
      container.style.marginLeft = s ? `calc(${-scalePosition.x}px * ${scale})` : ''
      container.style.marginTop = s ? `calc(${-scalePosition.y}px * ${scale})` : ''
      console.log(`calc(-${scalePosition.x}px * ${scale})`)
    }
  }

  if (!position) {
    // 获取当前鼠标位置
    container.onmousemove = (e) => {
      if (amplified) {
        return
      }
      scalePosition.x = e.clientX - window.document.body.clientWidth / 2
      scalePosition.y = e.clientY - window.document.body.clientHeight / 2
    }
    // 按下空格键缩放
    container.onkeydown = (e) => {
      if (e.code === 'Space') {
        if (!amplified) {
          scaleFn(true)
        } else if (amplified) {
          scaleFn(false)
        }
      }
    }
  } else {
    // 根据文字设置自动缩放
    scaleFn(true)
    setTimeout(() => {
      scaleFn(false)
    }, 1000)
  }
}
