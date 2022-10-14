export const amplifyScenes = () => {
  let amplified = false
  let mousePosition = {
    x: 0,
    y: 0
  }
  const container = document.body
  // 获取当前鼠标位置
  container.onmousemove = (e) => {
    if (amplified) {
      return
    }
    mousePosition.x = e.clientX
    mousePosition.y = e.clientY
  }
  // 按下空格键缩放
  container.onkeydown = (e) => {
    if (e.code === 'Space' && container && !amplified) {
      amplified = true
      container.setAttribute('class', `amplified x${mousePosition.x} y${mousePosition.y}`)
    } else if (e.code === 'Space' && container && amplified) {
      amplified = false
      container.removeAttribute('class')
    }
  }
}
