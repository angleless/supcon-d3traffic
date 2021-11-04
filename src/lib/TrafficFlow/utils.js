import { polar2rect, normalMovePoint, lineAnglePoint, intersectionPoint2, pointLenth, splitPoint } from './geometry'

function caclStreetInfos (aspectData, widthMap, interval = 240) {
  const { streets } = aspectData
  // 将数组深拷贝
  const streetsClone = JSON.parse(JSON.stringify(streets))
  // 将道路按照角度从小到大排序
  const streesAscend = streetsClone.sort((a, b) => a.angle - b.angle)

  const tabStreets = streesAscend.map((items, index) => {
    // isNonMotorVehicleOutLane 是否展示出口道的非机动车道
    // isNonMotorVehicleInsLane 是否展示进口道的非机动车道
    const { isNonMotorVehicleOutLane, isNonMotorVehicleInsLane } = items
    const tabIns = items.ins.map((item, i) => {
      return {
        ...item,
        tabs: index, // 给每个车道ins赋值道路的下标用来合并之后的拆分用到
        insTab: i // 进口道的下标
      }
    })
    let newOut = items.outs
    if (isNonMotorVehicleInsLane && tabIns.length > 0) {
      tabIns.push({ nonMontor: true })
    }
    if (isNonMotorVehicleOutLane && newOut > 0) {
      newOut = newOut + 1
    }
    return {
      ...items,
      ins: tabIns,
      outs: newOut,
      tabs: index
    }
  })

  // 如果车道为2路口且两个角度在160到200之间之内 将角度变成180度
  if (tabStreets.length === 2 &&
    Math.abs(tabStreets[0].angle - tabStreets[1].angle) > 160 && Math.abs(tabStreets[0].angle - tabStreets[1].angle) < 200) {
    tabStreets[1].angle = tabStreets[0].angle + 180
  }
  // 处理角度小于10度的相邻车道进行合并
  const filterStreetsAngleNext = tabStreets.reduce((p, v, i, a) => {
    if (p.length === 0) { // 为0将车道返回
      return [{
        ...v
      }]
    } else {
      const pClone = JSON.parse(JSON.stringify(p))
      const { angle: prevAngle, ins: prevIns, outs: prevOuts, isInsBool: previsInsBool, isOutBool: previsOutBool } = pClone[pClone.length - 1]
      const { angle: nowAngle, ins: nowIns, outs: nowOuts, isInsBool: nowisInsBool, isOutBool: nowisOutBool } = v
      if (Math.abs(nowAngle - prevAngle) < 10 || Math.abs(nowAngle - prevAngle) >= 350) {
        //  < 10 到 > 350
        const newIns = [...prevIns, ...nowIns]
        const newOuts = prevOuts + nowOuts
        pClone[pClone.length - 1].ins = newIns
        pClone[pClone.length - 1].outs = newOuts
        pClone[pClone.length - 1].isInsBool = prevIns.length === [] ? nowisInsBool : previsInsBool
        pClone[pClone.length - 1].isOutBool = prevIns.length === [] ? nowisOutBool : previsOutBool
        return [...pClone]
      } else if (v.ridTypeNo && ((v.ridTypeNo === 2 &&
          pClone[pClone.length - 1].ridTypeNo === 1) || (v.ridTypeNo === 1 && pClone[pClone.length - 1].ridTypeNo === 2)) &&
          (Math.abs(nowAngle - prevAngle) < 30 || Math.abs(nowAngle - prevAngle) >= 330)) {
        const newIns = [...nowIns, ...prevIns]
        const newOuts = prevOuts + nowOuts
        pClone[pClone.length - 1].ins = newIns
        pClone[pClone.length - 1].outs = newOuts
        pClone[pClone.length - 1].isInsBool = prevIns.length === [] ? nowisInsBool : previsInsBool
        pClone[pClone.length - 1].isOutBool = prevIns.length === [] ? nowisOutBool : previsOutBool
        return [...pClone]
      } else if (v.ridTypeNo && (v.ridTypeNo === 1 && pClone[pClone.length - 1].ridTypeNo === 2) &&
        (Math.abs(nowAngle - prevAngle) < 30 || Math.abs(nowAngle - prevAngle) >= 330)) {
        const newIns = [...nowIns, ...prevIns]
        const newOuts = prevOuts + nowOuts
        pClone[pClone.length - 1].ins = newIns
        pClone[pClone.length - 1].outs = newOuts
        pClone[pClone.length - 1].isInsBool = prevIns.length === [] ? nowisInsBool : previsInsBool
        pClone[pClone.length - 1].isOutBool = prevIns.length === [] ? nowisOutBool : previsOutBool
        return [...pClone]
      } else {
        return [...p, {
          ...v,
          tabs: pClone.length
        }]
      }
    }
  }, [])
  // 如果最小角度车道和最大角度车道相减大于350 车道进行合并逻辑
  if (Math.abs(filterStreetsAngleNext[0].angle - filterStreetsAngleNext[filterStreetsAngleNext.length - 1].angle) >= 350) {
    const lastData = filterStreetsAngleNext[filterStreetsAngleNext.length - 1]
    filterStreetsAngleNext[0].ins = [...filterStreetsAngleNext[0].ins, ...lastData.ins]
    filterStreetsAngleNext[0].outs = filterStreetsAngleNext[0].outs + lastData.outs
    filterStreetsAngleNext.pop()
  }

  const streetsWithNext = filterStreetsAngleNext.reduce(
    (p, v, i, a) => {
      const idxNext = (i + 1) % a.length // 得到下一个坐标点
      const streetNext = a[idxNext] // 得到下一个坐标的数据
      const obj = { ...v, angleNext: streetNext.angle, nextIns: streetNext.ins, nextOuts: streetNext.outs, widthNext: streetNext.width, laneWidthNext: streetNext.laneWidth, lengthNext: streetNext.length }
      return [...p, obj]
    }, [])

  const result = streetsWithNext.reduce((p, c, i, a) => {
    // borderRadius: 贝塞尔曲线的控制点距离
    // safePath 增删车道的控制点的距离
    // crossPath 人行横道，停止线，分割线等的基准线的控制点的距离
    const borderRadius = 10
    const safePath = 80
    const crossPath = interval || 240
    const { angle, angleNext, length, ins, outs, laneWidth, nextIns, nextOuts } = c
    // 车道的长度 如果比渠化图的宽度的2/3小的话取宽度的2/3
    const laneLength = widthMap * 2 / 3 > length ? widthMap * 2 / 3 : length
    // 车道的数目
    const len = ins.length + outs
    // 下个车道的数目
    const lenNext = nextIns.length + nextOuts
    // 每个车道的宽度最小宽度30
    const laneWidthNum = laneWidth < 30 ? 30 : laneWidth
    // 总的道路的宽度 每个车道的数目乘以车道的宽度
    const totalWidth = laneWidthNum ? laneWidthNum * len : 30 * len
    // 总的下一个道路的宽度 每个车道的数目乘以车道的宽度
    const totalNextWidth = laneWidthNum ? laneWidthNum * lenNext : 30 * lenNext
    // 计算到初始的开始点绕着坐标原点，直角坐标系
    const { x: xCurrLine, y: yCurrLine } = polar2rect({ x: 0, y: 0 }, angle, laneLength)
    // 计算结束点绕着坐标点， 直角坐标系
    const { x: xNextLine, y: yNextLine } = polar2rect({ x: 0, y: 0 }, angleNext, laneLength)
    // 沿着初始开始点顺着角度移动到得到最终的开始点
    const { x: xCurrLineDown, y: yCurrLineDown } = normalMovePoint(angle, { x: xCurrLine, y: yCurrLine }, totalWidth * 0.5, true)
    // 沿着初始开始点顺着角度移动到得到最终的结束点
    const { x: xNextLineUp, y: yNextLineUp } = normalMovePoint(angleNext, { x: xNextLine, y: yNextLine }, totalNextWidth * 0.5, false)
    // currDownline
    // 得到开始点的方程式 ax+by+c = 0
    const { a: a1, b: b1, c: c1 } = lineAnglePoint(angle, { x: xCurrLineDown, y: yCurrLineDown })
    // nextUpline
    // 得到结束点的方程式
    const { a: a2, b: b2, c: c2 } = lineAnglePoint(angleNext, { x: xNextLineUp, y: yNextLineUp })
    // joint
    // 两个坐标点的交点根据方程公式
    // 判断是否为180或者160 到 200之间，在这个区间直接取开始点和结束点的中点
    const juiTwoRoadBool = ((streetsWithNext.length === 2) &&
                            Math.abs(streetsWithNext[0].angle - streetsWithNext[1].angle) > 160 && Math.abs(streetsWithNext[0].angle - streetsWithNext[1].angle) < 200)
    const joint = (Math.abs(angle - angleNext) < 190 && Math.abs(angle - angleNext) > 170) || juiTwoRoadBool || (Math.abs(angle - angleNext) === 180) ? { x: Infinity, y: Infinity } : intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    const correctJoinLine = joint.x === Infinity ? splitPoint({ x: xCurrLineDown, y: yCurrLineDown }, { x: xNextLineUp, y: yNextLineUp }, 1 / 2) : joint
    // new
    // 计算出开始点和连接点的距离
    const prev = pointLenth({ x: xCurrLineDown, y: yCurrLineDown }, correctJoinLine)
    // 计算出结束点和连接点的距离
    const next = pointLenth({ x: xNextLineUp, y: yNextLineUp }, correctJoinLine)
    // 计算开始点和连接点中间比例borderRadius / prev的点的坐标
    const curveStartLine = splitPoint(correctJoinLine, { x: xCurrLineDown, y: yCurrLineDown }, borderRadius / prev)
    // 计算结束点和连接点中间比例borderRadius / prev的点的坐标
    const curveEndLine = splitPoint(correctJoinLine, { x: xNextLineUp, y: yNextLineUp }, borderRadius / next)

    // 通过开始点旋转了angle-90角度 laneLength - safePath 道路总长度减去80 得到距离连接点80的点
    const safeStartLine = normalMovePoint(angle - 90, { x: xCurrLineDown, y: yCurrLineDown }, laneLength - safePath, false)
    // 通过结束点旋转了angleNext-90角度 laneLength - safePath 道路总长度减去80 得到距离连接点80的点
    const safeEndLine = normalMovePoint(angleNext - 90, { x: xNextLineUp, y: yNextLineUp }, laneLength - safePath, false)
    // 通过开始点旋转了angle-90角度 laneLength - safePath 道路总长度减去80再减去200 得到距离连接点80的点
    const safeStartBtn = normalMovePoint(angle - 90, { x: xCurrLineDown, y: yCurrLineDown }, laneLength - (safePath + 200), false)
    // 通过结束点旋转了angleNext-90角度 laneLength - safePath 道路总长度减去80再减去200 得到距离连接点80的点
    const safeEndBtn = normalMovePoint(angleNext - 90, { x: xNextLineUp, y: yNextLineUp }, laneLength - (safePath + 200), false)
    // 通过开始点旋转了angle-90角度 laneLength - crossPath 道路总长度减去240的点
    const inflectionStart = normalMovePoint(angle - 90, { x: xCurrLineDown, y: yCurrLineDown }, laneLength - crossPath, false)
    // 通过结束点旋转了angleNext-90角度 laneLength - crossPath 道路总长度减去240的点
    const inflectionEnd = normalMovePoint(angleNext - 90, { x: xNextLineUp, y: yNextLineUp }, laneLength - crossPath, false)

    const result = [
      ...p,
      {
        ...c,
        start: { x: xCurrLineDown, y: yCurrLineDown },
        end: { x: xNextLineUp, y: yNextLineUp },
        joint: correctJoinLine,
        curveStart: curveStartLine,
        curveEnd: curveEndLine,
        safeStart: safeStartLine,
        safeEnd: safeEndLine,
        angle: { from: angle, to: angleNext },
        widthNext: totalNextWidth,
        turnNo: len,
        width: totalWidth,
        safeStartBtn,
        safeEndBtn,
        inflectionStart,
        inflectionEnd,
        laneLength,
        crossPath,
        ins,
        outs
      }
    ]
    return result
  }, [])
  return result
}

function reSizeWidthInfo (streetsWithNext, widthMap, interval = 240) {
  const result = streetsWithNext.reduce((p, c, i, a) => {
    const borderRadius = 10
    const safePath = 80
    const crossPath = interval || 240
    const { angle, length, ins, outs, laneWidth } = c
    const { ins: nextIns, outs: nextOuts } = i === a.length - 1 ? a[0] : a[i + 1]
    const len = ins.length + outs
    const lenNext = nextIns.length + nextOuts
    const laneLength = widthMap * 2 / 3 > length ? widthMap * 2 / 3 : length
    const laneWidthNum = laneWidth < 30 ? 30 : laneWidth
    const totalWidth = laneWidthNum ? laneWidthNum * len : 30 * len
    const totalNextWidth = laneWidthNum ? laneWidthNum * lenNext : 30 * lenNext
    const { x: xCurrLine, y: yCurrLine } = polar2rect({ x: 0, y: 0 }, angle.from, laneLength)
    const { x: xNextLine, y: yNextLine } = polar2rect({ x: 0, y: 0 }, angle.to, laneLength)
    const { x: xCurrLineDown, y: yCurrLineDown } = normalMovePoint(angle.from, { x: xCurrLine, y: yCurrLine }, totalWidth * 0.5, true)
    const { x: xNextLineUp, y: yNextLineUp } = normalMovePoint(angle.to, { x: xNextLine, y: yNextLine }, totalNextWidth * 0.5, false)
    // currDownline
    const { a: a1, b: b1, c: c1 } = lineAnglePoint(angle.from, { x: xCurrLineDown, y: yCurrLineDown })
    // nextUpline
    const { a: a2, b: b2, c: c2 } = lineAnglePoint(angle.to, { x: xNextLineUp, y: yNextLineUp })
    // joint
    // 判断是否为两条路且角度在160到200度之间
    const juiTwoRoadBool = streetsWithNext.length === 2 && Math.abs(streetsWithNext[0].angle.from - streetsWithNext[1].angle.from) > 160 && Math.abs(streetsWithNext[0].angle.from - streetsWithNext[1].angle.from) < 200

    const joint = (Math.abs(angle.to - angle.from) < 190 && Math.abs(angle.to - angle.from) > 170) || juiTwoRoadBool || (Math.abs(angle.to - angle.from) === 180) ? { x: Infinity, y: Infinity } : intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    const correctJoinLine = joint.x === Infinity ? splitPoint({ x: xCurrLineDown, y: yCurrLineDown }, { x: xNextLineUp, y: yNextLineUp }, 1 / 2) : joint
    // new
    const prev = pointLenth({ x: xCurrLineDown, y: yCurrLineDown }, correctJoinLine)
    const next = pointLenth({ x: xNextLineUp, y: yNextLineUp }, correctJoinLine)
    const curveStartLine = splitPoint(correctJoinLine, { x: xCurrLineDown, y: yCurrLineDown }, borderRadius / prev)
    const curveEndLine = splitPoint(correctJoinLine, { x: xNextLineUp, y: yNextLineUp }, borderRadius / next)

    const safeStartLine = normalMovePoint(angle.from - 90, { x: xCurrLineDown, y: yCurrLineDown }, laneLength - safePath, false)
    const safeEndLine = normalMovePoint(angle.to - 90, { x: xNextLineUp, y: yNextLineUp }, laneLength - safePath, false)
    const safeStartBtn = normalMovePoint(angle.from - 90, { x: xCurrLineDown, y: yCurrLineDown }, laneLength - (safePath + 200), false)
    const safeEndBtn = normalMovePoint(angle.to - 90, { x: xNextLineUp, y: yNextLineUp }, laneLength - (safePath + 200), false)

    const inflectionStart = normalMovePoint(angle.from - 90, { x: xCurrLineDown, y: yCurrLineDown }, laneLength - crossPath, false)
    const inflectionEnd = normalMovePoint(angle.to - 90, { x: xNextLineUp, y: yNextLineUp }, laneLength - crossPath, false)
    const result = [
      ...p,
      {
        ...c,
        start: { x: xCurrLineDown, y: yCurrLineDown },
        end: { x: xNextLineUp, y: yNextLineUp },
        joint: correctJoinLine,
        curveStart: curveStartLine,
        curveEnd: curveEndLine,
        safeStart: safeStartLine,
        safeEnd: safeEndLine,
        safeStartBtn,
        safeEndBtn,
        inflectionStart,
        inflectionEnd,
        angle: { from: angle.from, to: angle.to },
        widthNext: totalNextWidth,
        turnNo: len,
        width: totalWidth,
        ins,
        laneLength,
        crossPath,
        outs
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

function devicesAllInfoIndex (streetInfos, aggregateIndex) {
  return {
    obj: streetInfos[Number(aggregateIndex.split('_')[0])],
    objIndex: Number(aggregateIndex.split('_')[0]),
    insIndex: Number(aggregateIndex.split('_')[1]),
    devicesIndex: Number(aggregateIndex.split('_')[2])
  }
}

function prevDrectionAllInfoIndex (prevDrection) {
  return {
    objIndex: prevDrection.split(',')[0],
    insIndex: prevDrection.split(',')[1],
    directionPrev: prevDrection.split(',')[2],
    directionBack: prevDrection.split(',')[3]
  }
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
  reSizeWidthInfo,
  devicesAllInfoIndex,
  prevDrectionAllInfoIndex
}
