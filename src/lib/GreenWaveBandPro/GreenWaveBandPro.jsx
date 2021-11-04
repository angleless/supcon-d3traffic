import React from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import './index.less'
import Phase from '../Phase/Phase'

// const width = 1000
// const height = 500 // SVG绘制区域的大小
const padding = { top: 50, right: 100, bottom: 50, left: 100 } // 外边框
const posOffset = -20 // 正向偏移量
let styles
let svg
let offset
// 定义比例尺
let xScale, yScale
// X,Y值域
let XmaxDomain, YmaxDomain
// 创建一个线段生成器
let linePath
// 基础数据
let dataList
// 操作数据
let operateData
// 操作点集合
let pointList
// 自定义车速
let posSpeed, negSpeed
// 路口距离
let interDistance
let negativeInterDistance
// 绿灯数据二维数组
let greenSignalList
// 绿波图数据
let posLimitPoint, posLimitPoint2, negLimitPoint, negLimitPoint2
let positiveStart, positiveEnd
let negativeStart, negativeEnd
// 鼠标提示
let tooltip = {
  display: false,
  x: null,
  y: null,
  message: '',
  size: null,
  color: null,
  transform: null,
  anchor: null
}
// 数据显示开关
let visibleBtn = {
  actualSpeed: true,
  arrow: true,
  negativeInter: true
}
// 相位图X坐标列表
let phaseX = []

let renderKey = Math.random()

class GreenWaveBandPro extends React.Component {
  state = {
    inputVisible: false,
    inputValue: 0,
    isForward: true,
    type: '',
    interIndex: null
  }
  componentWillMount() {
    const { positiveSpeed, negativeSpeed, standardData } = this.props.data
    operateData = {
      positiveData: this.deepCopy(standardData),
      negativeData: this.deepCopy(standardData).reverse()
    }
    posSpeed = positiveSpeed
    negSpeed = negativeSpeed
    this.initData()
  }
  componentDidMount() {
    this.initData()
    document.addEventListener('keydown', this.cancelEvent)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.cancelEvent)
  }

  componentWillReceiveProps(props) {
    const { positiveSpeed, negativeSpeed, standardData } = props.data
    operateData = {
      positiveData: this.deepCopy(standardData),
      negativeData: this.deepCopy(standardData).reverse()
    }
    posSpeed = positiveSpeed
    negSpeed = negativeSpeed
    this.initData()
  }

  getData = () => {
    return operateData;
  }

  // 初始化渲染数据
  initData = () => {
    const { actualSpeed, arrow, negativeInter } = this.props.visible
    // 自定义变量赋值
    offset = 'translate(' + padding.left + ',' + padding.top + ')'
    dataList = []
    phaseX = []
    interDistance = 0
    negativeInterDistance = 0

    greenSignalList = {
      positiveData: [],
      negativeData: []
    }
    posLimitPoint = 0
    posLimitPoint2 = 0
    negLimitPoint = 0
    negLimitPoint2 = 0
    positiveStart = 0
    positiveEnd = 0

    // 获取传入的变量
    styles = this.props.styles
    visibleBtn = {
      actualSpeed: actualSpeed,
      arrow: arrow,
      negativeInter: negativeInter
    }

    // 初始化坐标轴
    this.initAxis()

    // 初始化正向数据
    this.initPositive()

    // 初始化反向数据
    this.initNegative()

    this.initInteractiveData(greenSignalList.positiveData, true)
    this.initInteractiveData(greenSignalList.negativeData, false)

    this.randerSvg()
  }

  initPositive = () => {
    const colors = styles.colors ? styles.colors : ['red', 'green']
    // 遍历路口数据计算坐标轴值域
    operateData.positiveData.map((item, index) => {
      interDistance = index === 0 ? 0 : interDistance + item.inter_spacing
      const tempLength = item.signal_cycle * item.phase_difference / 100
      const greenSignalLength = item.signal_cycle * item.green_signal_ratio / 100
      if (index === 0) {
        positiveStart = tempLength
        positiveEnd = positiveStart + greenSignalLength
      }

      const nearestY1 = this.getPositiveY(interDistance, positiveStart)
      const nearestY2 = this.getPositiveY(interDistance, positiveEnd)
      const pointStart1 = (nearestY1 - tempLength) % item.signal_cycle
      const pointStart2 = (nearestY2 - tempLength) % item.signal_cycle
      if (pointStart1 > greenSignalLength || (parseInt((nearestY2 - tempLength) / item.signal_cycle) !== parseInt((nearestY1 - tempLength) / item.signal_cycle))) {
        const tempLimitPoint = item.signal_cycle - pointStart1
        if (tempLimitPoint > posLimitPoint) posLimitPoint = tempLimitPoint
      }
      if (pointStart2 > greenSignalLength || (parseInt((nearestY2 - tempLength) / item.signal_cycle) !== parseInt((nearestY1 - tempLength) / item.signal_cycle))) {
        const tempLimitPoint2 = pointStart2 - greenSignalLength
        if (tempLimitPoint2 > posLimitPoint2) posLimitPoint2 = tempLimitPoint2
      }
    })
    // 遍历路口数据计算坐标轴值域
    operateData.positiveData.map((item, index) => {
      const { negativeInter } = visibleBtn
      interDistance = index === 0 ? 0 : interDistance + item.inter_spacing

      const tempLength = item.signal_cycle * item.phase_difference / 100
      const greenSignalLength = item.signal_cycle * item.green_signal_ratio / 100
      const redSignalLength = item.signal_cycle - greenSignalLength
      const interGreenSignalList = []
      const phaseOffset = 48 * 35.39 / xScale(1)
      if (tempLength > redSignalLength) {
        dataList.push({
          d: linePath([[interDistance + posOffset, 0], [interDistance + posOffset, tempLength - redSignalLength - 3]]),
          style: colors[1],
          width: 1,
          transform: offset,
          type: 'path',
          x:interDistance + posOffset,
          isForward: true,
          index
        })
        
        dataList.push({
          x: xScale(interDistance + posOffset),
          y: yScale(tempLength - redSignalLength),
          startPoint: yScale(0),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: true,
          isMiddle: true,
          transform: offset,
          type: 'point'
        })

        dataList.push({
          d: linePath([[interDistance + posOffset, tempLength - redSignalLength + 3], [interDistance + posOffset, tempLength - 3]]),
          style: colors[0],
          width: 1,
          transform: offset,
          type: 'path',
          x:interDistance + posOffset,
          isForward: true,
          index
        })

        dataList.push({
          d: linePath([[interDistance + posOffset, item.signal_cycle * item.cycle_times + tempLength + 3], [interDistance + posOffset, item.signal_cycle * (item.cycle_times + 1)]]),
          style: colors[1],
          width: 1,
          transform: offset,
          type: 'path',
          x:interDistance + posOffset,
          isForward: true,
          index
        })

        dataList.push({
          x: xScale(interDistance + posOffset),
          y: yScale(item.signal_cycle * item.cycle_times + tempLength),
          startPoint: yScale(item.signal_cycle * item.cycle_times + tempLength),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: true,
          isMiddle: false,
          transform: offset,
          tempLength: tempLength,
          type: 'point'
        })

        index === 0 && interGreenSignalList.push({
          start: tempLength - item.signal_cycle,
          end: tempLength - item.signal_cycle + greenSignalLength,
          limitPoint: posLimitPoint,
          limitPoint2: posLimitPoint2,
          index,
          redEnd: tempLength,
          x: interDistance + posOffset,
          tempLength: tempLength,
          tempWave: true
        })
      } else {
        dataList.push({
          d: linePath([[interDistance + posOffset, 0], [interDistance + posOffset, tempLength - 3]]),
          style: colors[0],
          width: 1,
          transform: offset,
          type: 'path',
          x:interDistance + posOffset,
          isForward: true,
          index
        })

        dataList.push({
          x: xScale(interDistance + posOffset),
          y: yScale(tempLength),
          startPoint: yScale(0),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: true,
          isMiddle: true,
          transform: offset,
          type: 'point'
        })

        dataList.push({
          d: linePath([[interDistance + posOffset, tempLength + item.signal_cycle * item.cycle_times + 3], [interDistance + posOffset, tempLength + item.signal_cycle * item.cycle_times + greenSignalLength - 3]]),
          style: colors[1],
          width: 1,
          transform: offset,
          type: 'path',
          x:interDistance + posOffset,
          isForward: true,
          index
        })
        dataList.push({
          d: linePath([[interDistance + posOffset, tempLength + item.signal_cycle * item.cycle_times + greenSignalLength + 3], [interDistance + posOffset, item.signal_cycle * (item.cycle_times + 1)]]),
          style: colors[0],
          width: 1,
          transform: offset,
          type: 'path',
          x:interDistance + posOffset,
          isForward: true,
          index
        })

        dataList.push({
          x: xScale(interDistance + posOffset),
          y: yScale(tempLength + item.signal_cycle * item.cycle_times),
          startPoint: yScale(tempLength + item.signal_cycle * item.cycle_times),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: true,
          isMiddle: false,
          transform: offset,
          tempLength: tempLength,
          type: 'point'
        })

        dataList.push({
          x: xScale(interDistance + posOffset),
          y: yScale(tempLength + item.signal_cycle * item.cycle_times + greenSignalLength),
          startPoint: yScale(tempLength + item.signal_cycle * item.cycle_times + greenSignalLength),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: true,
          isMiddle: true,
          transform: offset,
          tempLength: tempLength,
          type: 'point'
        })
      }
      // if (negativeInter) {
      //   // 正反向配信信息
      //   interDistance === 0 && dataList.push({
      //     x1: xScale(interDistance + posOffset),
      //     y1: yScale(item.signal_cycle * (item.cycle_times + 1)),
      //     x2: xScale(interDistance + 30),
      //     y2: yScale(item.signal_cycle * (item.cycle_times + 1) + 25),
      //     style: 'red',
      //     width: 1,
      //     transform: offset,
      //     type: 'line'
      //   })
      //   interDistance === 0 && dataList.push({
      //     x1: xScale(interDistance),
      //     y1: yScale(item.signal_cycle * (item.cycle_times + 1)),
      //     x2: xScale(interDistance + 30),
      //     y2: yScale(item.signal_cycle * (item.cycle_times + 1) + 10),
      //     style: 'red',
      //     width: 1,
      //     transform: offset,
      //     type: 'line'
      //   })
      //   interDistance === 0 && dataList.push({
      //     name: '正向的信号配时表达',
      //     x: xScale(interDistance + 30),
      //     y: yScale(item.signal_cycle * (item.cycle_times + 1) + 25),
      //     size: styles.fontSize,
      //     color: styles.fontColor,
      //     anchor: 'start',
      //     transform: offset,
      //     type: 'text'
      //   })
      //   interDistance === 0 && dataList.push({
      //     name: '反向的信号配时表达',
      //     x: xScale(interDistance + 30),
      //     y: yScale(item.signal_cycle * (item.cycle_times + 1) + 10),
      //     size: styles.fontSize,
      //     color: styles.fontColor,
      //     anchor: 'start',
      //     transform: offset,
      //     type: 'text'
      //   })
      // }
      for (let i = 0; i < item.cycle_times; i++) {
        const startY = tempLength + item.signal_cycle * i
        const endY = tempLength + greenSignalLength + item.signal_cycle * i
        const redEndY = tempLength + item.signal_cycle + item.signal_cycle * i
        interGreenSignalList.push({
          start: startY,
          end: endY,
          limitPoint: posLimitPoint,
          limitPoint2: posLimitPoint2,
          index,
          redEnd: redEndY,
          x: interDistance + posOffset,
          tempLength: tempLength,
          tempWave: false
        })
      }
      greenSignalList.positiveData.push(interGreenSignalList)

      var word_length = item.inter_name.length > 6 ? 6 : item.inter_name.length ;

      dataList.push({
        name: item.inter_name,
        x: xScale(interDistance - word_length * 12 - 10),
        y: yScale(-15),
        size: styles.fontSize,
        color: styles.fontColor,
        anchor: 'middle',
        transform: offset,
        type: 'text_nowrap'
      })

      phaseX.push({ x: xScale(interDistance - 1 * 12 + padding.left) + phaseOffset, y: yScale(YmaxDomain) })

      dataList.push({
        name: '←',
        x: xScale(interDistance - 12 + 5),
        y: yScale(-10),
        size: 10,
        color: styles.fontColor,
        anchor: 'start',
        transform: offset,
        type: 'text'
      })

      dataList.push({
        name: '→',
        x: xScale(interDistance - 12 - 30),
        y: yScale(-10),
        size: 10,
        color: styles.fontColor,
        anchor: 'start',
        transform: offset,
        type: 'text'
      })

      if (item.inter_spacing !== 0) {
        dataList.push({
          name: `${item.inter_spacing}`,
          x: xScale(interDistance - item.inter_spacing / 2 - 20 + posOffset),
          y: yScale(-10),
          size: 10,
          color: styles.fontColor,
          anchor: 'start',
          transform: offset,
          type: 'text'
        })
      }
    })
  }

  initNegative = () => {
    const colors = styles.colors ? styles.colors : ['red', 'green']
    // 遍历路口数据计算坐标轴值域
    operateData.negativeData.map((item, index) => {
      negativeInterDistance = index === 0 ? interDistance : negativeInterDistance - operateData.negativeData[index - 1].inter_spacing
      const tempLength = item.signal_cycle * item.phase_difference / 100
      const greenSignalLength = item.signal_cycle * item.green_signal_ratio / 100

      if (index === 0) {
        negativeStart = tempLength
        negativeEnd = negativeStart + greenSignalLength
      }

      const nearestY1 = this.getNegativeY(interDistance - negativeInterDistance, negativeStart)
      const nearestY2 = this.getNegativeY(interDistance - negativeInterDistance, negativeEnd)
      const pointStart1 = (nearestY1 - tempLength) % item.signal_cycle
      const pointStart2 = (nearestY2 - tempLength) % item.signal_cycle
      if (pointStart1 > greenSignalLength || (parseInt((nearestY2 - tempLength) / item.signal_cycle) !== parseInt((nearestY1 - tempLength) / item.signal_cycle))) {
        const tempLimitPoint = item.signal_cycle - pointStart1
        if (tempLimitPoint > negLimitPoint) negLimitPoint = tempLimitPoint
      }
      if (pointStart2 > greenSignalLength || (parseInt((nearestY2 - tempLength) / item.signal_cycle) !== parseInt((nearestY1 - tempLength) / item.signal_cycle))) {
        const tempLimitPoint2 = pointStart2 - greenSignalLength
        if (tempLimitPoint2 > negLimitPoint2) negLimitPoint2 = tempLimitPoint2
      }
    })
    // 遍历路口数据计算坐标轴值域
    operateData.negativeData.map((item, index) => {
      negativeInterDistance = index === 0 ? interDistance : negativeInterDistance - operateData.negativeData[index - 1].inter_spacing
      const tempLength = item.signal_cycle * item.phase_difference / 100
      const greenSignalLength = item.signal_cycle * item.green_signal_ratio / 100
      const redSignalLength = item.signal_cycle - greenSignalLength
      const interGreenSignalList = []
      if (tempLength > redSignalLength) {
        dataList.push({
          d: linePath([[negativeInterDistance, 0], [negativeInterDistance, tempLength - redSignalLength - 3]]),
          style: colors[1],
          width: 1,
          transform: offset,
          type: 'path',
          x:negativeInterDistance,
          isForward: false,
          index
        })

        dataList.push({
          x: xScale(negativeInterDistance),
          y: yScale(tempLength - redSignalLength),
          startPoint: yScale(0),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: false,
          isMiddle: true,
          transform: offset,
          type: 'point'
        })

        dataList.push({
          d: linePath([[negativeInterDistance, tempLength - redSignalLength + 3], [negativeInterDistance, tempLength - 3]]),
          style: colors[0],
          width: 1,
          transform: offset,
          type: 'path',
          x:negativeInterDistance,
          isForward: false,
          index
        })
        dataList.push({
          d: linePath([[negativeInterDistance, item.signal_cycle * item.cycle_times + tempLength + 3], [negativeInterDistance, item.signal_cycle * (item.cycle_times + 1)]]),
          style: colors[1],
          width: 1,
          transform: offset,
          type: 'path',
          x:negativeInterDistance,
          isForward: false,
          index
        })

        dataList.push({
          x: xScale(negativeInterDistance),
          y: yScale(item.signal_cycle * item.cycle_times + tempLength),
          startPoint: yScale(item.signal_cycle * item.cycle_times + tempLength),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: false,
          isMiddle: false,
          transform: offset,
          tempLength: tempLength,
          type: 'point'
        })

        index === 0 && interGreenSignalList.push({
          start: tempLength - item.signal_cycle,
          end: tempLength - item.signal_cycle + greenSignalLength,
          limitPoint: negLimitPoint,
          limitPoint2: negLimitPoint2,
          index,
          redEnd: tempLength,
          x: negativeInterDistance,
          tempLength: tempLength,
          tempWave: true
        })
      } else {
        dataList.push({
          d: linePath([[negativeInterDistance, 0], [negativeInterDistance, tempLength - 3]]),
          style: colors[0],
          width: 1,
          transform: offset,
          type: 'path',
          x:negativeInterDistance,
          isForward: false,
          index
        })

        // dataList.push({
        //   x: xScale(negativeInterDistance),
        //   y: yScale(tempLength - redSignalLength),
        //   startPoint: yScale(0),
        //   length: yScale(0) - yScale(tempLength),
        //   indexList: [index, 0],
        //   isForward: false,
        //   isMiddle: true,
        //   transform: offset,
        //   type: 'point'
        // })

        dataList.push({
          d: linePath([[negativeInterDistance, tempLength + item.signal_cycle * item.cycle_times + 3], [negativeInterDistance, tempLength + item.signal_cycle * item.cycle_times + greenSignalLength - 3]]),
          style: colors[1],
          width: 1,
          transform: offset,
          type: 'path',
          x:negativeInterDistance,
          isForward: false,
          index
        })
        dataList.push({
          d: linePath([[negativeInterDistance, tempLength + item.signal_cycle * item.cycle_times + greenSignalLength + 3], [negativeInterDistance, item.signal_cycle * (item.cycle_times + 1)]]),
          style: colors[0],
          width: 1,
          transform: offset,
          type: 'path',
          x:negativeInterDistance,
          isForward: false,
          index
        })

        dataList.push({
          x: xScale(negativeInterDistance),
          y: yScale(tempLength + item.signal_cycle * item.cycle_times),
          startPoint: yScale(tempLength + item.signal_cycle * item.cycle_times),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: false,
          isMiddle: false,
          transform: offset,
          tempLength: tempLength,
          type: 'point'
        })

        dataList.push({
          x: xScale(negativeInterDistance),
          y: yScale(tempLength + item.signal_cycle * item.cycle_times + greenSignalLength),
          startPoint: yScale(tempLength + item.signal_cycle * item.cycle_times + greenSignalLength),
          length: yScale(0) - yScale(tempLength),
          indexList: [index, 0],
          isForward: false,
          isMiddle: true,
          transform: offset,
          tempLength: tempLength,
          type: 'point'
        })
      }
      for (let i = 0; i < item.cycle_times; i++) {
        const startY = tempLength + item.signal_cycle * i
        const endY = tempLength + greenSignalLength + item.signal_cycle * i
        const redEndY = tempLength + item.signal_cycle + item.signal_cycle * i
        interGreenSignalList.push({
          start: startY,
          end: endY,
          limitPoint: negLimitPoint,
          limitPoint2: negLimitPoint2,
          index,
          redEnd: redEndY,
          x: negativeInterDistance,
          tempLength: tempLength,
          tempWave: false
        })
      }
      greenSignalList.negativeData.push(interGreenSignalList)
    })
  }

  /**
    * 绘制路口数据
    * @param data    路口数据
    * @param isForward    绿波方向
  **/
  initInteractiveData = (data, isForward) => {
    const colors = styles.colors ? styles.colors : ['red', 'green']
    pointList = []
    data.map((item, index) => {
      item.map((d, i) => {
        if (d.tempWave) {
          return
        }
        const start = {
          d: linePath([[d.x, d.start + 3], [d.x, d.end - 3]]),
          style: colors[1],
          width: 1,
          transform: offset,
          indexList: [index, i],
          type: 'path',
          x:d.x,
          isForward,
          index: d.index
        }
        const end = {
          d: linePath([[d.x, d.end + 3], [d.x, d.redEnd - 3]]),
          style: colors[0],
          width: 1,
          indexList: [index, i],
          transform: offset,
          type: 'path',
          x:d.x,
          isForward,
          index: d.index
        }
        dataList.push(start)
        dataList.push(end)
        pointList.push({
          x: xScale(d.x),
          y: yScale(d.end),
          startPoint: yScale(d.start),
          length: yScale(d.start) - yScale(d.redEnd),
          indexList: [index, i],
          isMiddle: true,
          isForward,
          transform: offset,
          type: 'point'
        })
        pointList.push({
          x: xScale(d.x),
          y: yScale(d.start),
          startPoint: yScale(d.start),
          length: yScale(d.start) - yScale(d.redEnd),
          indexList: [index, i],
          isForward,
          isMiddle: false,
          tempLength: d.tempLength,
          transform: offset,
          type: 'point'
        })
      })
    })

    // // 添加绿波
    data[0][0].tempWave
      ? data[0].map((item, index) => {
        index === 1
          ? this.initGreenBand(item, interDistance, isForward, true)
          : this.initGreenBand(item, interDistance, isForward, false)
      })
      : data[0].map((item, index) => {
        index === 0
          ? this.initGreenBand(item, interDistance, isForward, true)
          : this.initGreenBand(item, interDistance, isForward, false)
      })

    pointList.map(item => {
      dataList.push(item)
    })
  }

  /**
    * 绘制绿波带形状
    * @param data         路口数据
    * @param endX         最后路口距离
    * @param isForward    绿波方向
    * @param isDiscrib    是否展示数据
  **/
  initGreenBand(data, endX, isForward, isDiscrib) {
    let path1 = []
    let path2 = []
    let arrowStartY
    let isMult = false
    const startY = data.start + data.limitPoint
    const endY = data.end - data.limitPoint2
    if (startY < 0) {
      path1[0] = yScale(0)
      path1[1] = yScale(endY)
      path1[2] = xScale(
        isForward
          ? this.getPositiveX(0, startY) + posOffset
          : this.getNegativeX(interDistance, startY, data.tempWave)
      )
      path1[3] = xScale(data.x)
      path1[4] = yScale(0)
      path1[5] = xScale(
        isForward
          ? posOffset
          : interDistance
      )
    } else {
      path1[0] = yScale(startY)
      path1[1] = yScale(endY)
      path1[2] = xScale(data.x)
      path1[3] = xScale(data.x)
    }

    const positiveY1 = this.getPositiveY(endX, startY)
    const positiveY2 = this.getPositiveY(endX, endY)
    const negativeY1 = this.getNegativeY(endX, startY)
    const negativeY2 = this.getNegativeY(endX, endY)

    path2[0] = yScale(
      isForward
        ? positiveY1 > YmaxDomain
          ? YmaxDomain
          : positiveY1
        : negativeY1 > YmaxDomain
          ? YmaxDomain
          : negativeY1
    )
    path2[1] = yScale(
      isForward
        ? positiveY2 > YmaxDomain
          ? YmaxDomain
          : positiveY2
        : negativeY2 > YmaxDomain
          ? YmaxDomain
          : negativeY2
    )
    path2[2] = xScale(
      isForward
        ? positiveY1 > YmaxDomain
          ? this.getPositiveX(YmaxDomain, startY) + posOffset
          : endX + posOffset
        : negativeY1 > YmaxDomain
          ? this.getNegativeX(interDistance, startY)
          : 0
    )
    path2[3] = xScale(
      isForward
        ? positiveY2 > YmaxDomain
          ? this.getPositiveX(YmaxDomain, endY) + posOffset
          : endX + posOffset
        : negativeY2 > YmaxDomain
          ? this.getNegativeX(interDistance, endY)
          : 0
    )
    if (negativeY1 < YmaxDomain && negativeY2 > YmaxDomain) {
      path2[4] = yScale(
        isForward
          ? YmaxDomain
          : YmaxDomain
      )
      path2[5] = xScale(
        isForward
          ? interDistance
          : 0
      )
      isMult = true
    }

    if (path1[0] <= path1[1]) return

    // 方向箭头
    arrowStartY = endY - (endY - startY) / 2

    dataList.push({
      path1,
      path2,
      isMult,
      fill: isForward ? styles.greenWaveColors[0] : styles.greenWaveColors[1],
      stroke: 'none',
      strokewidth: 3,
      opacity: styles.opacity,
      transform: offset,
      type: 'polygon',
      isForward,
      tempWave: data.tempWave
    })

    // 实际速度虚线数据
    isDiscrib && visibleBtn.actualSpeed && dataList.push({
      x1: xScale(data.x),
      y1: yScale(isForward ? endY + 15 : endY + 15),
      x2: xScale(isForward ? endX : 0),
      y2: yScale(isForward ? this.getPositiveY(endX, endY) + 15 : this.getNegativeY(endX, endY) + 15),
      style: isForward ? styles.greenWaveColors[0] : styles.greenWaveColors[1],
      width: 1,
      transform: offset,
      type: 'line'
    })

    if(isDiscrib){
      dataList.push({
        name: isForward ? `实际速度` : `实际速度`,
        x: isForward ? xScale(endX + 25) : xScale(endX + 25),
        y: isForward ? 50 : yScale(20),
        size: styles.fontSize,
        color: styles.fontColor,
        anchor: isForward ? 'start' : 'start',
        transform: offset,
        type: 'text'
      })
      dataList.push({
        name: isForward ? `${(posSpeed * 3.6).toFixed(2)}km/h` : `${(negSpeed * 3.6).toFixed(2)}km/h`,
        x: isForward ? xScale(endX + 25) : xScale(endX + 25),
        y: isForward ? 68 : yScale(5),
        size: styles.fontSize,
        color: styles.fontColor,
        anchor: isForward ? 'start' : 'start',
        transform: offset,
        type: 'text'
      })
    }

    // 方向箭头数据
    isDiscrib && visibleBtn.arrow && dataList.push({
      x1: xScale(endX / 2),
      y1: yScale(isForward ? this.getPositiveY(endX / 2, arrowStartY) : this.getNegativeY(endX / 2, arrowStartY)),
      x2: xScale(isForward ? endX / 2 + 500 : endX / 2 - 500),
      y2: yScale(isForward ? this.getPositiveY(endX / 2 + 500, arrowStartY) : this.getNegativeY(endX / 2 + 500, arrowStartY)),
      style: 'white',
      width: 2,
      transform: offset,
      type: 'arrow'
    })

    if(isDiscrib){
      dataList.push({
        name: isForward ? `正向绿波` : `反向绿波`,
        x: isForward ? xScale(endX + 25) : xScale(endX + 25),
        y: isForward ? 10 : yScale(55),
        size: styles.fontSize,
        color: styles.fontColor,
        anchor: 'start',
        transform: offset,
        type: 'text'
      })
      dataList.push({
        name: isForward ? `${(posSpeed * 3.6).toFixed(2)}km/h` : `${(negSpeed * 3.6).toFixed(2)}km/h`,
        x: isForward ? xScale(endX + 25) : xScale(endX + 25),
        y: isForward ? 28 : yScale(40),
        size: styles.fontSize,
        color: styles.fontColor,
        anchor: 'start',
        transform: offset,
        type: 'text'
      })
    }
  }

  addToolTip = () => {
    const { message, x, y, anchor, size, color, transform } = tooltip

    svg.append('g').append('foreignObject').attr('x', x-80).attr('y', y).attr('width','120').attr('height','40').attr('transform', transform).attr('text-anchor', anchor)
    .append('xhtml:div')
    .style('color','white')
    .text(message)
    .style('padding', '10px 15px')
    .style('background', 'black')
    .style('font-size', size + 'px')

    // svg.append('g').append('text')
    //   .text(message)
    //   .attr('x', x)
    //   .attr('y', y)
    //   .attr('text-anchor', anchor)
    //   .attr('font-size', size)
    //   .attr('fill', color)
    //   .attr('transform', transform)
  }

  /**
    * 绘制面对象
    * @param points       坐标集合
    * @param fill         填充颜色
    * @param stroke       边框颜色
    * @param strokewidth  边框线宽
    * @param opacity      透明度
    * @param transform    位移
  **/
  addPolygon(data, index) {
    const [leftPointY1, leftPointY2, leftPointX1, leftPointX2, leftPointY3, leftPointX3] = data.path1
    const [rightPointY1, rightPointY2, rightPointX1, rightPointX2, rightPointY3, rightPointX3] = data.path2
    const points = data.tempWave
      ? data.isMult
        ? leftPointX1 + ',' + leftPointY1 + ((leftPointX3 && leftPointY3) ? ' ' + leftPointX3 + ',' + leftPointY3 : '') + ' ' + leftPointX2 + ',' + leftPointY2 + ' ' +
        rightPointX2 + ',' + rightPointY2 + ' ' + rightPointX3 + ',' + rightPointY3 + ' ' + rightPointX1 + ',' + rightPointY1
        : leftPointX1 + ',' + leftPointY1 + ((leftPointX3 && leftPointY3) ? ' ' + leftPointX3 + ',' + leftPointY3 : '') + ' ' + leftPointX2 + ',' + leftPointY2 + ' ' +
        rightPointX2 + ',' + rightPointY2 + ' ' + rightPointX1 + ',' + rightPointY1
      : data.isMult
        ? leftPointX1 + ',' + leftPointY1 + ' ' + leftPointX2 + ',' + leftPointY2 + ' ' +
        rightPointX2 + ',' + rightPointY2 + ' ' + rightPointX3 + ',' + rightPointY3 + ' ' + rightPointX1 + ',' + rightPointY1
        : leftPointX1 + ',' + leftPointY1 + ' ' + leftPointX2 + ',' + leftPointY2 + ' ' +
        rightPointX2 + ',' + rightPointY2 + ' ' + rightPointX1 + ',' + rightPointY1
    svg.append('g').append('polygon')
      .attr('class', data.isForward ? 'forward' : 'backward')
      .attr('transform', data.transform)
      .attr('points', points)
      .attr('fill', data.fill)
      .attr('stroke', data.stroke)
      .attr('stroke-width', data.strokewidth)
      .attr('opacity', data.opacity)
      .on('dblclick', () => {
        this.setState({
          inputVisible: true,
          inputValue: data.isForward ? posSpeed : negSpeed,
          isForward: data.isForward,
          inputX: d3.event.offsetX - 80,
          inputY: d3.event.offsetY - 33,
          type: 'speed'
        })
      })
  }

  /**
  * 添加拖拽点
  * @param data  数据集合
  **/
  addPoint(data) {
    var that = this
    var drage = d3.drag()
      .on('start', started)
    function started() {
      var circle = d3.select(this).classed('dragging', true)
      d3.event.on('drag', dragged).on('end', ended)

      function dragged() {
        if (data.isMiddle) {
          let greenSignalRatio = (data.startPoint - (d3.event.sourceEvent.offsetY - padding.top)) / data.length * 100
          if(greenSignalRatio > 100) greenSignalRatio = 100;
          if(greenSignalRatio <0 ) greenSignalRatio = 0;
          data.isForward
            ? operateData.positiveData[greenSignalList.positiveData[data.indexList[0]][data.indexList[1]].index].green_signal_ratio = greenSignalRatio
            : operateData.negativeData[greenSignalList.negativeData[data.indexList[0]][data.indexList[1]].index].green_signal_ratio = greenSignalRatio
          tooltip = {
            message: `绿信比: ${greenSignalRatio.toFixed(2)}%`,
            x: d3.event.sourceEvent.offsetX,
            y: d3.event.sourceEvent.offsetY - 50,
            size: styles.fontSize,
            color: styles.fontColor,
            anchor: 'end',
            transform: offset,
            display: true
          }
        } else {
          let phaseDifference = (data.tempLength - ((d3.event.sourceEvent.offsetY - padding.top) - data.startPoint)) / data.length * 100
          if(phaseDifference > 100) phaseDifference = 100;
          if(phaseDifference <0 ) phaseDifference = 0;
          data.isForward
            ? operateData.positiveData[greenSignalList.positiveData[data.indexList[0]][data.indexList[1]].index].phase_difference = phaseDifference
            : operateData.negativeData[greenSignalList.negativeData[data.indexList[0]][data.indexList[1]].index].phase_difference = phaseDifference
          tooltip = {
            message: `相位差: ${phaseDifference.toFixed(2)}%`,
            x: d3.event.sourceEvent.offsetX,
            y: d3.event.sourceEvent.offsetY - 50,
            size: styles.fontSize,
            color: styles.fontColor,
            anchor: 'end',
            transform: offset,
            display: true
          }
        }
        that.initData()
      }

      function ended() {
        tooltip.display = false
        that.initData()
        circle.classed('dragging', false)
      }
    }
    svg.append('circle')
      .attr('cx', data.x)
      .attr('cy', data.y)
      .attr('fill', data.isMiddle ? 'green' : 'red')
      .attr('r', 2)
      .attr('transform', data.transform)
      .attr('opacity', 0.8)
      .call(drage)
  }

  // 初始化比例尺
  initAxis = () => {
    const data = operateData.positiveData
    XmaxDomain = 0
    YmaxDomain = 0
    const width = styles.width ? styles.width : 1000
    const height = styles.height ? styles.height : 500
    data.map(item => {
      XmaxDomain += item.inter_spacing
      if (item.signal_cycle * (item.cycle_times + 1) > YmaxDomain) YmaxDomain = item.signal_cycle * (item.cycle_times + 1)
    })
    xScale = d3.scaleLinear() // x轴比例尺
      .domain([-50, XmaxDomain * 1.01]) // 设定x轴的值域
      .range([0, width - padding.left - padding.right]) // 设定x轴的定义域

    yScale = d3.scaleLinear() // y轴比例尺
      .domain([0, YmaxDomain]) // 设定y轴的值域
      .range([height - padding.top - padding.bottom, 0]) // 设定y轴的定义域

    // 创建坐标轴-x轴
    const xAxis = d3.axisBottom() // 创建一个新坐标轴
      .scale(xScale) // 设定x坐标轴的比例尺
      .ticks(0)
      // .tickSize(height)
      // .tickPadding(8 - height)
      .tickFormat(d3.format('d')) // 刻度的数组用字符串表示
    // 创建坐标轴-y轴
    const yAxis = d3.axisLeft() // 创建一个新坐标
      .scale(yScale) // 设定y坐标轴的比例尺
      // .ticks(10)
      // .tickSize(-width+220)
      // .tickPadding(10);

    // 创建一个线段生成器
    linePath = d3.line() // 创建一个线段生成器
      .x(function (d) { return xScale(d[0]) }) // 设置x坐标的访问器
      .y(function (d) { return yScale(d[1]) }) // 设置y坐标的访问器

    // 储存坐标轴渲染信息
    dataList.push({
      axis: xAxis,
      translate: padding.left + ',' + (height - padding.bottom),
      type: 'axis'
    })
    dataList.push({
      axis: yAxis,
      translate: padding.left + ',' + padding.top,
      type: 'axis'
    })
    dataList.push({
      name: '通行时长（时间：s）',
      x: -0.5 * (height - padding.top),
      y: 60,
      size: styles.fontSize,
      color: styles.fontColor,
      anchor: 'middle',
      transform: 'rotate(-90)',
      type: 'text'
    })
    dataList.push({
      name:  `路段名称: ${data[0].inter_name} → ${data[data.length - 1].inter_name} （距离：m)`,
      x: (width-padding.left-padding.right)/2,
      y: height + 15,
      size: styles.fontSize,
      color: styles.fontColor,
      anchor: 'middle',
      transform: offset,
      type: 'text'
    })
  }

  // 绘制
  randerSvg() {
    d3.select('.greenwave').remove()
    const width = styles.width ? styles.width : 1000
    const height = styles.height ? styles.height : 500
    // 增加svg绘制区域
    svg = d3.select('#body') // 选择id为body的div
      .append('svg') // 在div中添加<svg>
      .attr('class', 'greenwave')
      .attr('width', width) // 设定<svg>的宽度
      .attr('height', height + 100) // 设定<svg>的高度
    dataList.map((data, index) => {
      switch (data.type) {
        case 'polygon':
          this.addPolygon(data, index)
          break
        default:
          break
      }
    })

    dataList.map((data, index) => {
      switch (data.type) {
        case 'path':
          this.addPath(data)
          break
        // case 'polygon':
        //   this.addPolygon(data, index)
        //   break
        case 'text':
          this.addText(data)
          break
        case 'text_nowrap':
          this.addText_nowrap(data)
          break
        case 'axis':
          this.addAxis(data)
          break
        case 'point':
          this.addPoint(data)
          break
        case 'line':
          this.addDashed(data)
          break
        case 'arrow':
          this.addArrow(data)
          break
        default:
          break
      }
    })
    tooltip.display && this.addToolTip()
  }

  /**
  * 添加坐标轴
  * @param axis        对象
  * @param translate   位移
  **/
  addAxis(data) {
    const width = styles.width ? styles.width : 1000
    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + data.translate + ')')
      .call(data.axis)
      .call(g => g.selectAll(".tick line").clone()
      .attr("stroke-opacity", 0.1)
      .attr("stroke-dasharray",5)
      .attr("x1", width-210))
      .call(g => g.select(".domain").remove())
  }

  /**
    * 添加线段
    * @param data     数据
  **/
  addPath(data) {
    var that = this;
    svg.append('path')
      .attr('transform', data.transform)
      .attr('d', data.d)
      .attr('fill', 'none')
      .attr('stroke', function () {
        return data.style
      })
      .attr('stroke-linecap','round')
      .attr('stroke-width', data.width)
      .on('dblclick', () => {
        this.setState({
          inputVisible: true,
          inputValue: operateData.positiveData[data.index].signal_cycle,
          inputX: d3.event.offsetX + 10,
          inputY: d3.event.offsetY - 15,
          type: 'signal_cycle',
          interIndex: data.index
        })
        this.initData()
      })
      .on('mouseover', () => {
        if(tooltip.display) return;

        var t = data.isForward ? '正向':'反向';

        svg.append('g').append('foreignObject').attr('x', xScale(data.x - 200)).attr('y', -40).attr('width','150').attr('height','40').attr('transform', data.transform).attr('text-anchor', 'start')
        .append('xhtml:div')
        .style('color','white')
        .text( t + '的信号配时表达')
        .style('padding', '10px 15px')
        .style('background', 'black')
        .style('font-size', '12px')
      }).on('mouseout',function(){
        that.initData()
      })
  }

  /**
    * 绘制文字标注
    * @param name   名称
    * @param x      x最标
    * @param y      y坐标
    * @param size   大小
    * @param color  颜色
    * @param anchor 位置：start/end/middle
  **/
  addText(data) {
    svg.append('g')
      .append('text')
      .text(data.name)
      .attr('x', data.x)
      .attr('y', data.y)
      .attr('text-anchor', data.anchor)
      .attr('font-size', data.size)
      .attr('fill', data.color)
      .attr('transform', data.transform)
  }

  addText_nowrap(data) {
    var that = this;
    svg.append('g').append('foreignObject').attr('x', data.x).attr('y', data.y).attr('width','60').attr('height','20').attr('transform', data.transform).attr('text-anchor', data.anchor)
    .append('xhtml:div')
    .style('color',data.color)
    .text(data.name)
    .style('overflow', 'hidden')
    .style('text-overflow', 'ellipsis')
    .style('font-size', data.size + 'px')
    .style('white-space', 'nowrap')
    .style('cursor','pointer')
    .on('mouseover',function(){
      svg.append('g').append('foreignObject').attr('x', data.x - 40).attr('y', data.y-40).attr('width',data.name.length*15).attr('height','40').attr('transform', data.transform).attr('text-anchor', data.anchor)
      .append('xhtml:div')
      .style('color','white')
      .text(data.name)
      .style('padding', '10px 15px')
      .style('background', 'black')
      .style('font-size', data.size + 'px')
    }).on('mouseout',function(){
      that.initData()
    })
  }

  /**
  * 绘制虚线
  * @param name   名称
  * @param x      x最标
  * @param y      y坐标
  * @param size   大小
  * @param color  颜色
  * @param anchor 位置：start/end/middle
  **/
  addDashed(data) {
    svg.append('line')
      .attr('class', 'dashed')
      .attr('x1', data.x1)
      .attr('y1', data.y1)
      .attr('x2', data.x2)
      .attr('y2', data.y2)
      .attr('transform', data.transform)
      .attr('stroke-width', data.width)
      .attr('stroke', function () {
        return data.style
      })
  }

  /**
 * 计算从x1y1到x2y2的直线，与水平线形成的夹角
 * 计算规则为顺时针从左侧0°到与该直线形成的夹角
 * @param {Object} x1
 * @param {Object} y1
 * @param {Object} x2
 * @param {Object} y2
 */
  getAngle(x1, y1, x2, y2) {
    var x = x1 - x2,
      y = y1 - y2;
    if (!x && !y) {
      return 0;
    }
    var angle = (180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360;
    return 180 + angle;
  }

  /**
  * 绘制方向箭头
  * @param name   名称
  * @param x      x最标
  * @param y      y坐标
  * @param size   大小
  * @param color  颜色
  * @param anchor 位置：start/end/middle
  **/
  addArrow(data) {
    var defs = svg.append("defs")

    var arrowMarker = defs.append("marker")
      .attr("id", "arrow")
      .attr("markerUnits", "strokeWidth")
      .attr("markerWidth", "8")
      .attr("markerHeight", "8")
      .attr("viewBox", "0 0 12 12")
      .attr("refX", "6")
      .attr("refY", "6")
      .attr("orient", "auto")

    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2"

    arrowMarker.append("path")
      .attr("d", arrow_path)
      .attr("fill", function () {
        return data.style
      })

    svg.append("line")
      .attr('class', 'arrow')
      .attr("x1", data.x1)
      .attr("y1", data.y1)
      .attr("x2", data.x2)
      .attr("y2", data.y2)
      .attr('transform', data.transform)
      .attr("stroke-width", data.width)
      .attr("marker-end", "url(#arrow)")
      .attr('stroke', function () {
        return data.style
      })
  }

  /**
    * 获取正向Y坐标
    * @param x        x坐标
    * @param offset   偏移
    * @param currentSpeed   当前使用的速度
    **/
  getPositiveY(x, offset, currentSpeed) {
    const spd = currentSpeed || posSpeed
    const y = x / spd + offset
    return y
  }

  /**
    * 获取反向Y坐标
    * @param x        x坐标
    * @param startY   起点Y坐标
    * @param currentSpeed   当前使用的速度
    **/
  getNegativeY(x, startY, currentSpeed) {
    const spd = currentSpeed || negSpeed
    const y = startY + x / spd
    return y
  }

  /**
  * 获取正向极限X坐标
  * @param maxY        极限y坐标
  * @param offset   偏移
  * @param currentSpeed   当前使用的速度
  **/
  getPositiveX(maxY, offset, currentSpeed) {
    const spd = currentSpeed || posSpeed
    const x = (maxY - offset) * spd
    return x
  }

  /**
  * 获取反向X坐标
  * @param maxX        极限y坐标
  * @param offset   偏移
  * @param isTempWave   是否是临时绿波
  **/
  getNegativeX(maxX, offset, isTempWave) {
    const spd = negSpeed
    const yMax = isTempWave ? 0 : YmaxDomain
    const x = maxX - (yMax - offset) * spd
    return x
  }

  /**
   * 复制对象
   * @param obj 目标对象
   **/
  deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {}
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = this.deepCopy(obj[key]) // 递归复制
        } else {
          result[key] = obj[key]
        }
      }
    }
    return result
  }

  onChange = e => {
    const value = Number(e.target.value)
    this.setState({
      inputValue: value
    })
    this.state.type === "speed"
      ? this.state.isForward
        ? posSpeed = value
        : negSpeed = value
      : operateData.positiveData[this.state.interIndex].signal_cycle = value
    this.initData()
  }

  onCancel = () => {
    this.setState({
      inputVisible: false
    })
  }

  cancelEvent = e => {
    e.keyCode === 27 && this.setState({
      inputVisible: false
    })
  }

  renderPhase = () => {
    const height = styles.height ? styles.height : 500
    return phaseX.map((item, index) => {
      return <div
        className={'phase'}
        key={index}
        style={{
          marginLeft: `${item.x - 54}px`,
          marginTop: `${height - 12}px`,
          position: 'absolute',
          width: '100px',
          height: '100px'
        }}
      >
        { this.props.data.standardData[index].PhaseData && this.props.data.standardData[index].PhaseData.roads ?
        <Phase
          svgWidth={45}
          svgHeight={45}
          data={this.props.data.standardData[index].PhaseData} /> : null }
      </div>
    })
  }

  handleDownload = () => {
    let data = {
      positiveData: operateData.positiveData,
      negativeData: operateData.positiveData
    }
    let str = JSON.stringify(data);
    let blob = new Blob([new Uint8Array(_toUtf16LE(str))], { type: "text/csv;charset=UTF-16;" });

    function _toUtf16LE(str) {
      let charCode, byteArray = [],
        len = str.length;
      byteArray.push(255, 254); // LE BOM
      for (let i = 0; i < len; ++i) {
        charCode = str.charCodeAt(i);
        // LE Bytes
        byteArray.push(charCode & 0xff);
        byteArray.push(charCode / 256 >>> 0);
      }
      return byteArray;
    }

    let downloadLink = document.createElement("a");
    if ('download' in downloadLink) { // feature detection, Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = '绿波图数据.js';
      downloadLink.hidden = true;
      downloadLink.click();
    } else {
      if (navigator.msSaveBlob) { //IE10+
        navigator.msSaveBlob(blob, '绿波图数据.js');
      }
    }
  }

  render() {
    return (
      <div id='body' key={renderKey}>
        {this.renderPhase()}
        {
          this.state.inputVisible
          && <div>
            <div
              className={'cover'}
              onClick={this.onCancel}
            />
            <div
              className={'input'}
              style={{ left: `${this.state.inputX}px`, top: `${this.state.inputY}px` }}
            >
              <label
                style={{ display: 'inline-block', textAlign: 'right' }}>
                <span id="speedValue-value">
                  {
                    this.state.type === 'speed'
                      ? this.state.isForward ? '正向速度:' : '反向速度:'
                      : `${operateData.positiveData[this.state.interIndex].inter_name}路口周期时长:`
                  }
                </span>
                <input
                  type="number"
                  style={{ width: '70px' }}
                  min="0"
                  step={this.state.type === 'speed' ? "0.1" : "1"}
                  value={this.state.inputValue}
                  id="speedValue"
                  onChange={this.onChange}
                />
                <span>
                  {
                    this.state.type === 'speed'
                      ? 'm/s'
                      : '秒'
                  }
                </span>
              </label>
            </div>
          </div>
        }
        {/* <button className='download' onClick={this.handleDownload}>数据下载</button> */}
      </div>
    )
  }
}

GreenWaveBandPro.defaultProps = {
  data: {},
  styles: {
    width:1000,
    height:800,
    colors: ['#2BAE41', '#5B6E90'],
    opacity: 0.25,
    fontSize: 12,
    fontSize: 'black'
  }
}

GreenWaveBandPro.propTypes = {
  data: PropTypes.object,
  styles: PropTypes.object
}

export default GreenWaveBandPro