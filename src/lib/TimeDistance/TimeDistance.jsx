import React from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import TimeSlider from './TimeSlider'
import Switch from 'antd/es/switch'
import mergeDeepRight from 'ramda/src/mergeDeepRight'
import { defaultWidth, defaultHeight, padding, markList } from './const'

let styles
let svg
let offset
let xScale, yScale // 定义比例尺
let linePath // 创建一个线段生成器
let dataList // 计算结果数组

let width
let height

const UIStyles = {
  colors: {
    path: '#8897A7',
    roadName: 'rgba(0, 0, 0, 0.65)',
    roadforward: '#4CAF50',
    roadReverse: '#F15533',
    roadDashed: 'rgba(0, 0, 0, 0.1)',
    axisName: 'rgba(0, 0, 0, 0.45)'
  },
  fontSize: 12
}

class TimeDistance extends React.Component {
  state = {
    checked: true, // true: X轴代表距离|Y轴代表时间,  false: X轴代表时间|Y轴代表距离
    isShowSlider: true, // 是否展示TimeSlider组件
    isShowSwitch: true, // 是否展示switch切换按钮
    timeRange: ['00:00', '24:00']
  }

  componentWillReceiveProps (nextProps) {
    const [start1, end1] = this.props.timeRange || []
    const [start2, end2] = nextProps.timeRange || []
    if (start1 !== start2 || end1 !== end2) {
      this.setState({ timeRange: nextProps.timeRange })
    }
    const propList = ['checked', 'isShowSlider', 'isShowSwitch']
    propList.forEach(key => {
      if (key in nextProps) {
        if (nextProps[key] !== this.props[key]) {
          this.setState({ [key]: nextProps[key] })
        }
      }
    })
  }

  componentDidMount () {
    this.initState()
    this.renderCanvas()
  }

  componentDidUpdate () {
    this.renderCanvas()
  }

  initState () {
    const stateList = ['timeRange', 'checked', 'isShowSlider', 'isShowSwitch']
    stateList.forEach(key => {
      if (key in this.props) {
        this.setState({ [key]: this.props[key] })
      }
    })
  }

  setInitData () {
    const propStyles = this.props.styles || {}
    width = propStyles.width || defaultWidth
    height = propStyles.height || defaultHeight
    styles = mergeDeepRight(UIStyles, this.props.styles)
    offset = `translate(${padding.left}, ${padding.top})`
  }

  renderCanvas () {
    this.setInitData()

    d3.select('#time-distance-svg').selectAll('*').remove()
    svg = d3
      .select('#time-distance-svg')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // 定义变量
    let SumRoadlen = 0 // Roadlen的总长度
    let maxOffset = 0 // 最大偏移
    let maxCycleTime = 0 // 最大周期时间
    let SumTravelTime = 0 // 正向通行总时间
    let invSumTravelTime = 0 // 反向通行总时间
    let cycleCount = 0 // 正向周期数量
    let invCycleCount = 0 // 反向周期数量

    const data = this.getPropsData('data')

    // 遍历路口数据
    // 计算SumRoadlen,SumTravelTime,invSumTravelTime,maxOffset,maxCycleTime
    for (var i = 0; i < data.length; i++) {
      if (this.state.checked) {
        data[i].start_y = data[i].offset
        data[i].end_y = 0
        data[i].x = SumRoadlen
      } else {
        data[i].start_x = data[i].offset
        data[i].end_x = 0
        data[i].y = SumRoadlen
      }

      SumRoadlen += data[i].roadlen
      SumTravelTime += data[i].travel_time
      invSumTravelTime += data[i].inv_travel_time

      if (data[i].offset > maxOffset) maxOffset = data[i].offset
      if (data[i].cycle_time > maxCycleTime) maxCycleTime = data[i].cycle_time
    }

    // 根据通行时间和最大周期时间计算需要绘制的周期数量
    cycleCount = parseInt(d3.format('.0f')(SumTravelTime / maxCycleTime + 1)) // 正向周期数量
    invCycleCount = parseInt(d3.format('.0f')(invSumTravelTime / maxCycleTime + 1)) // 反向周期数量

    if (this.state.checked) {
      const YmaxDomain = maxCycleTime * (cycleCount + invCycleCount) + maxOffset // 计算Y轴最大值域（正反向总时间+最大偏移值）
      this.initAxis(SumRoadlen, YmaxDomain)
      this.renderDashedRoad(YmaxDomain)
    } else {
      const XmaxDomain = maxCycleTime * (cycleCount + invCycleCount) + maxOffset // 计算X轴最大值域（正反向总时间+最大偏移值）
      this.initAxis(XmaxDomain, SumRoadlen)
      this.renderDashedRoad(XmaxDomain * 1.1)
    }

    // 复制data数据进行编辑
    dataList = this.deepCopy(data)

    // 绘制车辆行进轨迹
    this.initVehiclePath()

    // 绘制正向绿波带
    this.initChart(true, cycleCount)

    // 绘制反向绿波带
    this.initChart(false, invCycleCount)
  }

  /**
    * 初始化坐标系组件
    * @param XmaxDomain  x轴最大值域
    * @param SumRoadlen  y轴最大值域
  **/
  initAxis (Xmax, yMax) {
    let xAxis
    let yAxis
    if (this.state.checked) {
      xScale = d3
        .scaleLinear()
        .domain([-50, Xmax * 1.2])
        .range([0, width - padding.left - padding.right])

      yScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height - padding.top - padding.bottom, 0])

      xAxis = d3
        .axisBottom()
        .scale(xScale)
        .tickSizeOuter([0])

      yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickValues(this.getTickValues(yMax))
        .tickFormat(d => this.formatTickTime(d))

      this.addText('距离(m)', width / 2, height - padding.bottom + 55, styles.fontSize, styles.colors.axisName, 'middle', 'rotate(0)')
      this.addText('时间(s)', 35, height / 2 - 10, styles.fontSize, styles.colors.axisName, 'middle', `rotate(-90, 35 ${height / 2})`)
    } else {
      xScale = d3
        .scaleLinear()
        .domain([0, Xmax * 1.1])
        .range([0, width - padding.left - padding.right])

      yScale = d3
        .scaleLinear()
        .domain([-99, yMax])
        .range([height - padding.top - padding.bottom, 0])

      xAxis = d3
        .axisBottom()
        .scale(xScale)
        .tickValues(this.getTickValues(Xmax))
        .tickFormat(d => this.formatTickTime(d))
        .tickSizeOuter([0])

      yAxis = d3
        .axisLeft()
        .scale(yScale)

      this.addText('时间(s)', width / 2, height - padding.bottom + 55, styles.fontSize, styles.colors.axisName, 'middle', 'rotate(0)')
      this.addText('距离(m)', 35, height / 2, styles.fontSize, styles.colors.axisName, 'middle', `rotate(-90, 35 ${height / 2})`)
    }

    this.addAxis(xAxis, padding.left + ',' + (height - padding.bottom), 'x-axis')
    this.addAxis(yAxis, padding.left + ',' + padding.top, 'y-axis')

    // 创建一个线段生成器
    linePath = d3.line() // 创建一个线段生成器
      .x(function (d) { return xScale(d[0]) }) // 设置x坐标的访问器
      .y(function (d) { return yScale(d[1]) }) // 设置y坐标的访问器
  }

  /**
    * 初始化图表
    * @param isForward  绘制方向
    * @param count      绘制数量
  **/
  initChart (isForward, count) {
    const data = this.getPropsData('data')
    for (var i = 0; i < data.length; i++) {
      dataList[i].phase = []
      for (var j = 0; j < count; j++) {
        dataList[i].phase.push.apply(dataList[i].phase, data[i].phase)
      }
    }

    if (!isForward) dataList.reverse()

    dataList.forEach((data) => {
      // var index = 0
      data.phase.forEach((d) => {
        var isCophase = isForward ? d.is_co_phase : d.inv_is_co_phase
        var color = isCophase === 1 ? styles.colors.roadforward : styles.colors.roadReverse
        if (this.state.checked) {
          data.end_y = data.start_y + d.split_time
          this.addPath([data.x, data.start_y], [data.x, data.end_y], color, 3, offset)
          data.start_y = data.end_y
        } else {
          data.end_x = data.start_x + d.split_time
          this.addPath([data.start_x, data.y], [data.end_x, data.y], color, 3, offset)
          data.start_x = data.end_x
        }
      })

      if (this.state.checked) {
        this.addText(data.inter_name, xScale(data.x + 10), yScale(data.offset), styles.fontSize, styles.colors.roadName, 'start', offset)
      } else {
        this.addText(data.inter_name, xScale(data.offset), yScale(data.y + 20), styles.fontSize, styles.colors.roadName, 'start', offset)
      }

      // if (data.travel_time !== 0) { this.addText(data.roadlen + 'm', xScale(-70 + 2), yScale(data.y + data.roadlen / 2), styles.fontSize, 'black', 'start', offset) }
    })
  }

  renderDashedRoad (max) {
    const dataList = this.getPropsData('data')
    const color = styles.colors.roadDashed
    dataList.forEach(data => {
      if (this.state.checked) {
        this.addPath([data.x, 0], [data.x, max], color, 1, offset, 4)
      } else {
        this.addPath([0, data.x], [max, data.x], color, 1, offset, 4)
      }
    })
  }

  initVehiclePath () {
    const dataList = JSON.parse(JSON.stringify(this.getPropsData('path')))
    dataList.forEach(data => {
      if (!this.state.checked) {
        data.path.forEach(v => { v.reverse() })
      }
      for (let i = 0; i < data.path.length; i++) {
        if (i > 0) {
          this.addPath(data.path[i - 1], data.path[i], styles.colors.path, 1, offset)
        }
      }
    })
  }

  /**
    * 添加坐标轴
    * @param axis        对象
    * @param translate   位移
  **/
  addAxis (axis, translate, className) {
    svg.append('g')
      .attr('class', className)
      .attr('transform', 'translate(' + translate + ')')
      .call(axis)
  }

  /**
    * 添加线段
    * @param d1     起点坐标
    * @param d2     终点坐标
    * @param color  颜色
    * @param width  线宽
  **/
  addPath (d1, d2, color, width, transform, dasharray = 0) {
    svg.append('path')
      .attr('transform', transform)
      .attr('d', function () {
        return linePath([d1, d2])
      })
      .attr('fill', 'none')
      .attr('stroke', function () {
        return color
      })
      .attr('stroke-width', width)
      .attr('stroke-dasharray', dasharray)
  }

  /**
    * 绘制文字标注
    * @param name   名称
    * @param x      x最标
    * @param y      y坐标
    * @param size   大小
    * @param color  颜色
    * @param anchor 位置：start/end/middle
    * @param fontFamily 字体
  **/
  addText (name, x, y, size, color, anchor, transform, fontFamily = 'PingFangSC-Regular') {
    svg.append('g').append('text')
      .text(name)
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', anchor)
      .attr('font-size', size)
      .attr('fill', color)
      .attr('transform', transform)
      .attr('font-family', fontFamily)
  }

  /**
   * 复制对象
   * @param obj 目标对象
   **/
  deepCopy (obj) {
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

  getTickValues = (yMax) => {
    const indexList = []
    const minutes = Math.ceil(yMax / 60)
    const interval = Math.ceil(minutes / 10)
    for (let index = 0; index < minutes + 1; index += interval) {
      indexList.push(index)
    }
    return indexList.map(v => v * 60)
  }

  formatTickTime = (d) => {
    const { timeRange } = this.props
    if (timeRange) {
      const startTime = timeRange[0]
      const minuteAdd = d / 60
      if (d > 0) {
        let [hour, minute] = startTime.split(':').map(v => Number(v))
        const minuteSum = minute + minuteAdd
        if (minuteSum >= 60) {
          hour += Math.floor(minuteSum / 60)
          minute = minuteSum % 60
        } else {
          minute += minuteAdd
        }
        if (hour < 10) hour = `0${hour}`
        if (minute < 10) minute = `0${minute}`
        return `${hour}:${minute}`
      } else {
        return startTime
      }
    } else {
      return d
    }
  }

  handleChange = (value) => {
    const [start, end] = value
    this.setState({ timeRange: [markList[start], markList[end]] })
  }

  handleAfterChange = (value) => {
    const [start, end] = value
    this.props.onAfterChange && this.props.onAfterChange([markList[start], markList[end]])
  }

  getPropsData = (key, value = []) => {
    return this.props[key] || value
  }

  render () {
    const { checked, timeRange, isShowSlider, isShowSwitch } = this.state
    const chartClassName = `time-distance-chart ${checked ? 'check' : 'unckeck'} ${isShowSlider ? 'show-slider' : 'hide-slider'}`
    return (
      <div className='time-distance'>
        {
          isShowSwitch && (
            <div className='time-distance-switch'>
              <span className='switch-label'>切换坐标轴: </span>
              <Switch size='small' checked={checked} onChange={checked => { this.setState({ checked }) }} />
              <br />
              <span className='switch-label'>展示/隐藏Slider: </span>
              <Switch size='small' checked={isShowSlider} onChange={checked => { this.setState({ isShowSlider: checked }) }} />
            </div>
          )
        }
        <div className={chartClassName}>
          <div id='time-distance-svg' />
          {
            isShowSlider && (
              <TimeSlider
                styles={this.props.styles}
                checked={checked}
                timeRange={timeRange}
                onChange={this.handleChange}
                onAfterChange={this.handleAfterChange}
              />
            )
          }
        </div>
      </div>
    )
  }
}

TimeDistance.defaultProps = {
  data: [],
  path: [],
  styles: UIStyles
}

TimeDistance.propTypes = {
  data: PropTypes.array,
  path: PropTypes.array,
  styles: PropTypes.object
}

export default TimeDistance
