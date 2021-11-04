const defaultWidth = 1000 // SVG绘制区域的宽度
const defaultHeight = 500 // SVG绘制区域的高度
const padding = { // SVG绘制区域内边距
  top: 50,
  right: 50,
  bottom: 60,
  left: 80
}
const getMarksTime = (minDifferNum) => {
  const obj = {}
  for (let i = 0, z = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += minDifferNum) {
      const iTime = i.toString().padStart(2, '0')
      const jTime = j.toString().padStart(2, '0')
      obj[z++] = `${iTime}:${jTime}`
    }
  }
  obj[1440 / minDifferNum] = '24:00'
  return obj
}
const markList = getMarksTime(1)

export {
  defaultWidth,
  defaultHeight,
  padding,
  markList
}
