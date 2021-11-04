import * as turf from '@turf/turf'

const splitLatlng = data => {
  return data.split(';').map(item => {
    const [lng, lat] = item.split(',')
    return [+lng, +lat]
  })
}

const sortLatlng = data => {
  const lngs = data.map(item => { return item[0] })
  const lats = data.map(item => { return item[1] })
  const minLng = lngs.sort()[0] // 从小到大排序
  const maxLng = lngs[lngs.length - 1]
  const minLat = lats.sort()[0]
  const maxLat = lats[lats.length - 1]
  return [minLng, maxLng, minLat, maxLat]
}

const computeLineIntersect = (line1, line2) => {
  const line1Json = turf.lineString(line1)
  const line2Json = turf.lineString(line2)
  const intersect = turf.lineIntersect(line1Json, line2Json)
  let points = []
  if (intersect.features.length) {
    points = turf.getCoord(intersect.features[0])
  }
  return points
}

const polygonTransRect = data => {
  if (!data) {
    return null
  }
  const latlngList = splitLatlng(data)
  const [minLng, maxLng, minLat, maxLat] = sortLatlng(latlngList)
  return [minLng, maxLng, minLat, maxLat]
}

const splitRoadName = texts => {
  const arr = []
  if (texts && texts.length) {
    for (let i = 0; i < texts.length; i++) {
      arr.push(texts.charAt(i))
    }
  }
  return arr
}

const computedRoadAngle = (x1, y1, x2, y2) => {
  const height = y1 - y2
  const width = x1 - x2
  if (width === 0) {
    // 如果和y轴平行，角度为90或270
    return y1 >= y2 ? 90 : 270
  } else {
    const tan = Math.atan(height / width) // 弧度
    const angle = tan * 180 / Math.PI // 弧度转角度
    return tan > 0 ? (x1 > x2 ? angle : angle + 180) : (x1 > x2 ? angle + 360 : angle + 180)
  }
}

const computedSlopeRoadNamePoi = ({ start, end, half, angle, idx, textLength, fontSize, letterSpacing }) => {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dist = Math.sqrt(dx * dx + dy * dy)
  let x = 0
  let y = 0
  const scale = half / dist
  if (angle < 90) {
    if (Math.abs(dy) > textLength) {
      const newStartX = start[0]
      const newStartY = start[1] + fontSize / 2
      const t = (scale * dy + idx * (fontSize + letterSpacing)) / dy * dx
      x = newStartX + t
      y = newStartY + scale * dy + idx * (fontSize + letterSpacing)
    } else if (Math.abs(dx) > textLength) {
      const newStartX = start[0] + fontSize / 2
      const newStartY = start[1]
      const t = (scale * dx + idx * (fontSize + letterSpacing)) / dx * dy
      x = newStartX + scale * dx + idx * (fontSize + letterSpacing)
      y = newStartY + t
    } else {
      if (Math.abs(dx) > Math.abs(dy)) {
        const newStartX = start[0] + fontSize / 2
        const newStartY = start[1]
        const t = (fontSize + idx * (fontSize + letterSpacing)) / dx * dy
        x = newStartX + idx * (fontSize + letterSpacing)
        y = newStartY + t
      } else {
        const newStartX = start[0]
        const newStartY = start[1] + fontSize / 2
        const t = (fontSize + idx * (fontSize + letterSpacing)) / dy * dx
        x = newStartX + t
        y = newStartY + idx * (fontSize + letterSpacing)
      }
    }
  } else if (angle < 180) {
    if (Math.abs(dy) > textLength) {
      const newStartX = start[0]
      const newStartY = start[1] - fontSize / 2
      const t = (scale * dy + idx * (fontSize + letterSpacing)) / dy * dx
      x = newStartX + t
      y = newStartY + scale * dy + idx * (fontSize + letterSpacing)
    } else if (Math.abs(dx) > textLength) {
      const newStartX = start[0] - fontSize / 2
      const newStartY = start[1]
      const t = (scale * dx - idx * (fontSize + letterSpacing)) / dx * dy
      x = newStartX + scale * dx - idx * (fontSize + letterSpacing)
      y = newStartY + t
    } else {
      if (Math.abs(dx) > Math.abs(dy)) {
        const newStartX = start[0] - fontSize / 2
        const newStartY = start[1]
        const t = (fontSize - idx * (fontSize + letterSpacing)) / dx * dy
        x = newStartX - idx * (fontSize + letterSpacing)
        y = newStartY + t
      } else {
        const newStartX = start[0]
        const newStartY = start[1] + fontSize / 2
        const t = (fontSize + idx * (fontSize + letterSpacing)) / dy * dx
        x = newStartX + t
        y = newStartY + idx * (fontSize + letterSpacing)
      }
    }
  } else if (angle < 270) {
    if (Math.abs(dy) > textLength) {
      const newStartX = start[0]
      const newStartY = start[1] + fontSize / 2
      const t = (scale * dy - idx * (fontSize + letterSpacing)) / dy * dx
      x = newStartX + t
      y = newStartY + scale * dy - idx * (fontSize + letterSpacing)
    } else if (Math.abs(dx) > textLength) {
      const newStartX = start[0] - fontSize / 2
      const newStartY = start[1]
      const t = (scale * dx - idx * (fontSize + letterSpacing)) / dx * dy
      x = newStartX + scale * dx - idx * (fontSize + letterSpacing)
      y = newStartY + t
    } else {
      if (Math.abs(dx) > Math.abs(dy)) {
        const newStartX = start[0] - fontSize / 2
        const newStartY = start[1]
        const t = (fontSize + idx * (fontSize + letterSpacing)) / dx * dy
        x = newStartX - idx * (fontSize + letterSpacing)
        y = newStartY - t
      } else {
        const newStartX = start[0]
        const newStartY = start[1] - fontSize / 2
        const t = (fontSize + idx * (fontSize + letterSpacing)) / dy * dx
        x = newStartX - t
        y = newStartY - idx * (fontSize + letterSpacing)
      }
    }
  } else {
    if (Math.abs(dy) > textLength) {
      const newStartX = start[0]
      const newStartY = start[1] + fontSize / 2
      const t = (scale * dy - idx * (fontSize + letterSpacing)) / dy * dx
      x = newStartX + t
      y = newStartY + scale * dy - idx * (fontSize + letterSpacing)
    } else if (Math.abs(dx) > textLength) {
      const newStartX = start[0] + fontSize / 2
      const newStartY = start[1]
      const t = (scale * dx - idx * (fontSize + letterSpacing)) / dx * dy
      x = newStartX + scale * dx + idx * (fontSize + letterSpacing)
      y = newStartY - t
    } else {
      if (Math.abs(dx) > Math.abs(dy)) {
        const newStartX = start[0] + fontSize / 2
        const newStartY = start[1]
        const t = (fontSize + idx * (fontSize + letterSpacing)) / dx * dy
        x = newStartX + idx * (fontSize + letterSpacing)
        y = newStartY + t
      } else {
        const newStartX = start[0]
        const newStartY = start[1] - fontSize / 2
        const t = (fontSize - idx * (fontSize + letterSpacing)) / dy * dx
        x = newStartX + t
        y = newStartY - idx * (fontSize + letterSpacing)
      }
    }
  }
  return { x, y }
}

export {
  polygonTransRect,
  computeLineIntersect,
  splitRoadName,
  computedRoadAngle,
  computedSlopeRoadNamePoi
}
