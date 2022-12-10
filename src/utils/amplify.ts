export const amplifyScenes = ({ scale, duration }) => {
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
      console.log(container.classList)
      container.classList.add(`d${duration}`)
      container.classList.add('amplified', `x${mousePosition.x}`, `y${mousePosition.y}`, `s${scale}`)
    } else if (e.code === 'Space' && container && amplified) {
      amplified = false
      container.classList.remove(`d${duration}`, 'amplified', `x${mousePosition.x}`, `y${mousePosition.y}`, `s${scale}`)
    }
  }
}
