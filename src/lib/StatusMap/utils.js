import { polar2rect, normalMovePoint, lineAnglePoint, intersectionPoint2, pointLenth, splitPoint } from './geometry'

function caclStreetInfos (aspectData) {
  const { streets } = aspectData
  const streetsClone = JSON.parse(JSON.stringify(streets))
  const streesAscend = streetsClone.sort((a, b) => a.angle - b.angle)

  const tabStreets = streesAscend.map((items, index) => {
    return {
      ...items,
      tabs: index
    }
  })
  const filterStreetsAngleNext = tabStreets.filter((items, index) => {
    const prev = index === tabStreets.length - 1 ? tabStreets[0] : tabStreets[index + 1]
    return Math.abs(items.angle - prev.angle) > 40 && Math.abs(items.angle - prev.angle) < 320
  })

  const streetsWithNext = filterStreetsAngleNext.reduce(
    (p, v, i, a) => {
      const idxNext = (i + 1) % a.length
      const streetNext = a[idxNext]
      const obj = { ...v, angleNext: streetNext.angle, widthNext: streetNext.width, laneWidthNext: streetNext.laneWidth, lengthNext: streetNext.length }
      return [...p, obj]
    }, [])

  const result = streetsWithNext.reduce((p, c, i, a) => {
    const borderRadius = 10
    const safePath = 60
    const { angle, angleNext, length, lengthNext, ins, outs, laneWidth, laneWidthNext } = c
    const len = ins.length + outs
    const totalWidth = laneWidth * len
    const totalNextWidth = laneWidthNext * len
    const { x: xCurrLine, y: yCurrLine } = polar2rect({ x: 0, y: 0 }, angle, length)
    const { x: xNextLine, y: yNextLine } = polar2rect({ x: 0, y: 0 }, angleNext, lengthNext)
    const { x: xCurrLineDown, y: yCurrLineDown } = normalMovePoint(angle, { x: xCurrLine, y: yCurrLine }, totalWidth * 0.5, true)
    const { x: xNextLineUp, y: yNextLineUp } = normalMovePoint(angleNext, { x: xNextLine, y: yNextLine }, totalNextWidth * 0.5, false)
    // currDownline
    const { a: a1, b: b1, c: c1 } = lineAnglePoint(angle, { x: xCurrLineDown, y: yCurrLineDown })
    // nextUpline
    const { a: a2, b: b2, c: c2 } = lineAnglePoint(angleNext, { x: xNextLineUp, y: yNextLineUp })
    // joint
    const { x: xJoint, y: yJoint } = intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    const { x: xCorrect, y: yCorrect } = xJoint === Infinity ? splitPoint({ x: xCurrLineDown, y: yCurrLineDown }, { x: xNextLineUp, y: yNextLineUp }, 1 / 2) : { x: xJoint, y: yJoint }
    // new
    const prev = pointLenth({ x: xCurrLineDown, y: yCurrLineDown }, { x: xCorrect, y: yCorrect })
    const next = pointLenth({ x: xNextLineUp, y: yNextLineUp }, { x: xCorrect, y: yCorrect })
    const { x: xJointPrev, y: yJointPrev } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xCurrLineDown, y: yCurrLineDown }, borderRadius / prev)
    const { x: xJointNext, y: yJointNext } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xNextLineUp, y: yNextLineUp }, borderRadius / next)
    const { x: xSafePrev, y: ySafePrev } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xCurrLineDown, y: yCurrLineDown }, safePath / prev)
    const { x: xSafeNext, y: ySafeNext } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xNextLineUp, y: yNextLineUp }, safePath / next)
    // news
    // const { x: xJointPrev, y: yJointPrev } = distancePoints({ a: a1, b: b1, c: c1 }, { x: xJoint, y: yJoint }, borderRadius)[1]
    // const { x: xJointNext, y: yJointNext } = distancePoints({ a: a2, b: b2, c: c2 }, { x: xJoint, y: yJoint }, borderRadius)[1]
    const result = [
      ...p,
      {
        ...c,
        start: { x: xCurrLineDown, y: yCurrLineDown },
        end: { x: xNextLineUp, y: yNextLineUp },
        joint: { x: xCorrect, y: yCorrect },
        curveStart: { x: xJointPrev, y: yJointPrev },
        curveEnd: { x: xJointNext, y: yJointNext },
        safeStart: { x: xSafePrev, y: ySafePrev },
        safeEnd: { x: xSafeNext, y: ySafeNext },
        angle: { from: angle, to: angleNext },
        widthNext: totalNextWidth,
        width: totalWidth,
        ins,
        outs
      }
    ]
    return result
  }, [])
  return result
}

function reSizeWidthInfo (streetsWithNext) {
  const result = streetsWithNext.reduce((p, c, i, a) => {
    const borderRadius = 10
    const safePath = 60
    const { angle, length, lengthNext, ins, outs, laneWidthNext, laneWidth } = c
    const len = ins.length + outs
    const totalWidth = laneWidth * len
    const totalNextWidth = laneWidthNext * len
    const { x: xCurrLine, y: yCurrLine } = polar2rect({ x: 0, y: 0 }, angle.from, length)
    const { x: xNextLine, y: yNextLine } = polar2rect({ x: 0, y: 0 }, angle.to, lengthNext)
    const { x: xCurrLineDown, y: yCurrLineDown } = normalMovePoint(angle.from, { x: xCurrLine, y: yCurrLine }, totalWidth * 0.5, true)
    const { x: xNextLineUp, y: yNextLineUp } = normalMovePoint(angle.to, { x: xNextLine, y: yNextLine }, totalNextWidth * 0.5, false)
    // currDownline
    const { a: a1, b: b1, c: c1 } = lineAnglePoint(angle.from, { x: xCurrLineDown, y: yCurrLineDown })
    // nextUpline
    const { a: a2, b: b2, c: c2 } = lineAnglePoint(angle.to, { x: xNextLineUp, y: yNextLineUp })
    // joint
    const { x: xJoint, y: yJoint } = intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    const { x: xCorrect, y: yCorrect } = xJoint === Infinity ? splitPoint({ x: xCurrLineDown, y: yCurrLineDown }, { x: xNextLineUp, y: yNextLineUp }, 1 / 2) : { x: xJoint, y: yJoint }
    // new
    const prev = pointLenth({ x: xCurrLineDown, y: yCurrLineDown }, { x: xCorrect, y: yCorrect })
    const next = pointLenth({ x: xNextLineUp, y: yNextLineUp }, { x: xCorrect, y: yCorrect })
    const { x: xJointPrev, y: yJointPrev } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xCurrLineDown, y: yCurrLineDown }, borderRadius / prev)
    const { x: xJointNext, y: yJointNext } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xNextLineUp, y: yNextLineUp }, borderRadius / next)
    const { x: xSafePrev, y: ySafePrev } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xCurrLineDown, y: yCurrLineDown }, safePath / prev)
    const { x: xSafeNext, y: ySafeNext } = splitPoint({ x: xCorrect, y: yCorrect }, { x: xNextLineUp, y: yNextLineUp }, safePath / next)
    const result = [
      ...p,
      {
        ...c,
        start: { x: xCurrLineDown, y: yCurrLineDown },
        end: { x: xNextLineUp, y: yNextLineUp },
        joint: { x: xCorrect, y: yCorrect },
        curveStart: { x: xJointPrev, y: yJointPrev },
        curveEnd: { x: xJointNext, y: yJointNext },
        safeStart: { x: xSafePrev, y: ySafePrev },
        safeEnd: { x: xSafeNext, y: ySafeNext },
        widthNext: totalNextWidth,
        width: totalWidth
      }
    ]
    return result
  }, [])
  return result
}

function originDataInfos (aspectData) {
  const { streets } = aspectData
  const streetsClone = JSON.parse(JSON.stringify(streets))
  const streesAscend = streetsClone.sort((a, b) => a.angle - b.angle)

  const tabStreets = streesAscend.map((items, index) => {
    return {
      ...items,
      tabs: index
    }
  })
  return tabStreets
}

function streetBorderPath (caclBorderJoint) {
  const { start, end, joint, curveStart, curveEnd } = caclBorderJoint
  const { x: xCurrLineDown, y: yCurrLineDown } = start
  const { x: xNextLineUp, y: yNextLineUp } = end
  const { x: xCurveStart, y: yCurveStart } = curveStart
  const { x: xJoint, y: yJoint } = joint
  const { x: xCurveEnd, y: yCurveEnd } = curveEnd

  return `M ${xCurrLineDown} ${yCurrLineDown} L ${xCurveStart} ${yCurveStart} Q ${xJoint} ${yJoint} ${xCurveEnd} ${yCurveEnd} L ${xNextLineUp} ${yNextLineUp}`
}
function curveStartPath (caclBorderJoint) {
  const { curveStart, curveEnd } = caclBorderJoint
  const { x: xCurveStart, y: yCurveStart } = curveStart
  const { x: xCurveEnd, y: yCurveEnd } = curveEnd

  return `M ${xCurveStart} ${yCurveStart} L ${xCurveEnd} ${yCurveEnd} `
}

function directions2Id (directions) {
  const symbolStr = directions.reduce((p, v, i, arr) => p.concat(`${v}${i !== arr.length - 1 ? '_' : ''}`), '#')
  return symbolStr
}

function SVGCoord ({ x: xMath, y: yMath }, { x: xSvg, y: ySvg }) {
  this.dx = xSvg - xMath
  this.dy = ySvg - yMath
}

function correctPoint (angleNext, angle, safeStart, nextJoint, start) {
  const angleRect = angleNext < 90 ? angleNext + 90 : angleNext - 90
  const { a: a1, b: b1, c: c1 } = lineAnglePoint(Math.abs(angleRect), safeStart)
  const { a: a3, b: b3, c: c3 } = lineAnglePoint(Math.abs(angleRect), nextJoint)
  const { a: a2, b: b2, c: c2 } = lineAnglePoint(angle, start)
  const { x: newCurX, y: newCurY } = intersectionPoint2({ a1: a1, b1: b1, c1: c1 }, { a2, b2, c2 })
  const { x: newJointX, y: newJointY } = intersectionPoint2({ a1: a3, b1: b3, c1: c3 }, { a2, b2, c2 })
  return {
    joint: { x: newJointX, y: newJointY },
    safe: { x: newCurX, y: newCurY }
  }
}

SVGCoord.prototype.math2svg = function ({ x, y, ...other }) {
  const isPoint = x !== undefined && y !== undefined
  const point = {
    x: x + this.dx,
    y: this.dy - y
  }
  const result = isPoint ? point : other
  return result
}

export {
  SVGCoord,
  streetBorderPath,
  curveStartPath,
  directions2Id,
  correctPoint,
  caclStreetInfos,
  originDataInfos,
  reSizeWidthInfo
}
