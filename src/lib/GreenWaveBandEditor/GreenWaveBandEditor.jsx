import React from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import SVG from 'svg.js'
import 'svg.select.js'
import 'svg.resize.js'

import './index.less'

const width = 1000; const height = 500 // SVG绘制区域的大小
const padding = { top: 50, right: 50, bottom: 50, left: 100 } // 外边框
let styles
let svg, draw
let offset
// 定义比例尺
let xScale, yScale
// 创建一个线段生成器
let linePath
// 计算结果数组
let dataList

class GreenWaveBandEditor extends React.Component {
  componentDidMount () {
    this.renderCanvas()
  }

  componentDidUpdate () {
    this.renderCanvas()
  }

  renderCanvas () {
    // d3.select('svg').remove()
    // 增加svg绘制区域
    draw = new SVG('wave').size(width, height)
    svg = d3.select('#body') // 选择id为body的div
      .append('svg') // 在div中添加<svg>
      .attr('width', width) // 设定<svg>的宽度
      .attr('height', height) // 设定<svg>的高度

    offset = 'translate(' + padding.left + ',' + padding.top + ')'

    // 定义变量
    let SumRoadlen = 0 // Roadlen的总长度
    let maxOffset = 0 // 最大偏移
    let maxCycleTime = 0 // 最大周期时间
    let SumTravelTime = 0 // 正向通行总时间
    let invSumTravelTime = 0 // 反向通行总时间
    let cycleCount = 0 // 正向周期数量
    let invCycleCount = 0 // 反向周期数量

    // 获取传入的变量
    const data = this.props.data
    styles = this.props.styles

    // 遍历路口数据
    // 计算SumRoadlen,SumTravelTime,invSumTravelTime,maxOffset,maxCycleTime
    for (var i = 0; i < data.length; i++) {
      data[i].start_x = data[i].offset
      data[i].end_x = 0
      data[i].y = SumRoadlen
      SumRoadlen += data[i].roadlen
      SumTravelTime += data[i].travel_time
      invSumTravelTime += data[i].inv_travel_time
      if (data[i].offset > maxOffset) maxOffset = data[i].offset
      if (data[i].cycle_time > maxCycleTime) maxCycleTime = data[i].cycle_time
    }

    // 根据通行时间和最大周期时间计算需要绘制的周期数量
    cycleCount = parseInt(d3.format('.0f')(SumTravelTime / maxCycleTime + 1)) // 正向周期数量
    invCycleCount = parseInt(d3.format('.0f')(invSumTravelTime / maxCycleTime + 1)) // 反向周期数量

    // 计算X轴最大值域（正反向总时间+最大偏移值）
    const XmaxDomain = maxCycleTime * (cycleCount + invCycleCount) + maxOffset
    // 绘制坐标轴
    this.initAxis(XmaxDomain, SumRoadlen)

    // 复制data数据进行编辑
    dataList = this.deepCopy(data)

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
    // 初始化比例尺
    xScale = d3.scaleLinear() // x轴比例尺
      .domain([-99, Xmax * 1.1]) // 设定x轴的值域
      .range([0, width - padding.left - padding.right]) // 设定x轴的定义域

    yScale = d3.scaleLinear() // y轴比例尺
      .domain([-99, yMax]) // 设定y轴的值域
      .range([height - padding.top - padding.bottom, 0]) // 设定y轴的定义域

    // 创建坐标轴-x轴
    const xAxis = d3.axisBottom() // 创建一个新坐标轴
      .scale(xScale) // 设定x坐标轴的比例尺
      .ticks(6)
      .tickFormat(d3.format('d')) // 刻度的数组用字符串表示
    // 创建坐标轴-y轴
    const yAxis = d3.axisLeft() // 创建一个新坐标
      .scale(yScale) // 设定y坐标轴的比例尺

    this.addAxis(xAxis, padding.left + ',' + (height - padding.bottom))
    this.addAxis(yAxis, padding.left + ',' + padding.top)
    this.addText('dinstance(m)', -200, 50, styles.fontSize, 'black', 'end', 'rotate(-90)')
    this.addText('time(s)', 400, 430, styles.fontSize, 'black', 'middle', offset)

    // 创建一个线段生成器
    linePath = d3.line() // 创建一个线段生成器
      .x(function (d) { return xScale(d[0]) }) // 设置x坐标的访问器
      .y(function (d) { return yScale(d[1]) }) // 设置y坐标的访问器

    // 添加平行于y轴的刻度线
    this.addPath([-70, 0], [-70, yMax], 'blue', 2, offset)
  }

  /**
    * 初始化图表
    * @param isForward  绘制方向
    * @param count      绘制数量
  **/
  initChart (isForward, count) {
    const data = this.props.data
    for (var i = 0; i < data.length; i++) {
      dataList[i].phase = []
      for (var j = 0; j < count; j++) {
        dataList[i].phase.push.apply(dataList[i].phase, data[i].phase)
      }
    }

    if (!isForward) dataList.reverse()

    dataList.forEach((data) => {
      var index = 0
      data.phase.forEach((d) => {
        var isCophase = isForward ? d.is_co_phase : d.inv_is_co_phase

        data.end_x = data.start_x + d.split_time
        this.addPath([data.start_x, data.y], [data.end_x, data.y], styles.colors[isCophase], 3, offset)
        if (isCophase === 1) {
          this.initGreenBand(data, isForward)

          if (isForward && data.travel_time !== 0 && index === 0) {
            var speed = d3.format('.1f')(data.roadlen / data.travel_time * 3.6)
            this.addText(speed + 'km/h', xScale(data.start_x + data.travel_time / 2), yScale(data.y + data.roadlen / 2), styles.fontSize, 'black', 'end', offset)
          }
          if (!isForward && data.inv_travel_time !== 0 && index === 1) {
            speed = d3.format('.1f')(data.inv_roadlen / data.inv_travel_time * 3.6)
            this.addText(speed + 'km/h', xScale(data.end_x + data.inv_travel_time / 2), yScale(data.y - data.inv_roadlen / 2), styles.fontSize, 'black', 'start', offset)
          }
          index++
        }
        data.start_x = data.end_x
      })

      this.addText(data.inter_name, xScale(data.offset + 20), yScale(data.y + 20), styles.fontSize, 'black', 'end', offset)

      if (data.travel_time !== 0) { this.addText(data.roadlen + 'm', xScale(-70 + 2), yScale(data.y + data.roadlen / 2), styles.fontSize, 'black', 'start', offset) }
    })
  }

  /**
    * 绘制绿波带形状
    * @param data         路口数据
    * @param isForward    绿波方向
  **/
  initGreenBand (data, isForward) {
    var path1 = []; var path2 = []
    path1[0] = xScale(data.start_x)
    path1[1] = xScale(data.end_x)
    path1[2] = yScale(data.y)

    path2[0] = xScale(data.start_x + (isForward ? data.travel_time : data.inv_travel_time))
    path2[1] = xScale(data.end_x + (isForward ? data.travel_time : data.inv_travel_time))
    path2[2] = yScale(isForward ? data.y + data.roadlen : data.y - data.inv_roadlen)

    const points = path1[0] + ',' + path1[2] + ' ' + path1[1] + ',' + path1[2] + ' ' +
        path2[1] + ',' + path2[2] + ' ' + path2[0] + ',' + path2[2]

    this.addPolygon(points, styles.colors[1], 'none', 3, styles.opacity, offset)
  }

  /**
    * 添加坐标轴
    * @param axis        对象
    * @param translate   位移
  **/
  addAxis (axis, translate) {
    svg.append('g')
      .attr('class', 'axis')
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
  addPath (d1, d2, color, width, transform) {
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
  addPolygon (points, fill, stroke, strokewidth, opacity, transform) {
    draw.polygon(points).stroke(stroke).fill(fill).opacity(opacity)
      .selectize().selectize(false, { deepSelect: true })
      .resize().dmove(padding.left, padding.top)
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
  addText (name, x, y, size, color, anchor, transform) {
    svg.append('g').append('text')
      .text(name)
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', anchor)
      .attr('font-size', size)
      .attr('fill', color)
      .attr('transform', transform)
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

  render () {
    return (
      <div id='body'>
        <div id='wave' />
      </div>
    )
  }
}

GreenWaveBandEditor.defaultProps = {
  data: [],
  styles: {
    colors: ['red', 'green'],
    opacity: 0.5,
    fontSize: 12
  }
}

GreenWaveBandEditor.propTypes = {
  data: PropTypes.array,
  colors: PropTypes.object
}

export default GreenWaveBandEditor
