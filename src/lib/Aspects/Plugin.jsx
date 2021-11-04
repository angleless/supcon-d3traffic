import React, { Component } from 'react'
import { splitPoint, pointLenth, ang2rad, normalMovePoint } from './geometry'
import * as d3 from 'd3'
import {
  CROSS_WALK_WIDTH,
  CROSS_SCALE_WALK_WIDTH
} from './consts'
class Plugin extends Component {
  componentDidMount () {
    const { children: { props: { id } } } = this.props
    this.calculationProps()
    if (document.getElementById(`${id}`) && document.getElementById(`${id}`).offsetHeight) {
      this.offsetHeight = document.getElementById(`${id}`).offsetHeight
      this.offsetWidth = document.getElementById(`${id}`).offsetWidth
    }
  }

  pluginOrigin () {

  }

  componentDidUpdate (prevProps) {
    const { data: propData, width, height, streetInfos, children: { props: { id } } } = this.props
    if (propData !== prevProps.data || prevProps.width !== width || prevProps.height !== height || streetInfos !== prevProps.streetInfos || prevProps) {
      if (document.getElementById(`${id}`)) {
        this.offsetHeight = document.getElementById(`${id}`).offsetHeight
        this.offsetWidth = document.getElementById(`${id}`).offsetWidth
      }
      this.calculationProps()
    }
  }

  // 中心plugin定位
  crossOrigin () {
    const { children: { props: { coordinate: { x, y }, rotateorigin, rotateadjust } }, index, width, height, propData } = this.props
    if (!this.offsetHeight || !this.offsetWidth || !width || !propData) {
      return
    }
    const innerHeight = this.offsetHeight
    const innerWidth = this.offsetWidth
    const { center } = propData
    const { x: x1, y: y1 } = center // 中心点x, y比例
    const rotateParams = rotateorigin === 'pluginCenter' ? `translate(${width * x1 - innerWidth / 2 + x} ${height * y1 - innerHeight / 2 + y}) rotate(${rotateadjust} ${innerWidth / 2} ${innerHeight / 2})` : ''
    d3.select(`#cb-aspects-plugin-content${index}`)
      .attr('transform', rotateParams)
      .attr('width', this.offsetWidth)
      .attr('height', this.offsetHeight)
  }

  outPlugin () {
    const { children: { props: { origin, rotateadjust, coordinate: { x, y } } }, streetInfos, coord, index } = this.props
    const i = +origin.split('_')[1]
    const j = +origin.split('_')[2]
    const options = origin.split('_')[3]
    const optionsVertical = origin.split('_')[4]
    if (streetInfos.length !== 0) {
      const { turnNo } = streetInfos[i]
      const { inflectionStart, angle, end, start } = this.concatCurPrePoint(i)
      const startLine1 = splitPoint(start, end, j / turnNo)
      const startLine2 = splitPoint(start, end, (j + 1) / turnNo)
      const len = pointLenth(start, inflectionStart)
      const widths = pointLenth(startLine1, startLine2)
      const scale = optionsVertical === 'left' ? splitPoint(startLine1, startLine2, (0 + Number(x)) / widths) : optionsVertical === 'center' ? splitPoint(startLine1, startLine2, (widths * 0.5 + Number(x)) / widths) : splitPoint(startLine1, startLine2, (widths + Number(x)) / widths)
      const horizonScale = options === 'start' ? coord.math2svg(normalMovePoint(angle.from - 90, scale, len - y, false)) : options === 'middle' ? coord.math2svg(normalMovePoint(angle.from - 90, scale, len / 2 - y, false)) : coord.math2svg(normalMovePoint(angle.from - 90, scale, -y, false))

      d3.select(`#cb-aspects-plugin-content${index}`)
        .attr('transform', `translate(${horizonScale.x} ${horizonScale.y}) rotate(${angle.from + Number(rotateadjust)} 0 0)`)
        .attr('width', this.offsetWidth)
        .attr('height', this.offsetHeight)
    }
  }

  concatCurPrePoint (index) {
    const { streetInfos, propData } = this.props
    const { crossWolkWidth, crossWolkHeight } = propData
    const { angle, start, ins, outs, width, inflectionStart, joint } = streetInfos[index]
    const len = streetInfos.length
    const vprev = streetInfos[(index - 1 + len) % len]
    const { end, inflectionEnd, joint: nextJoint, angle: nextAngle } = vprev
    const startInflectionStartLen = pointLenth(inflectionStart, start)
    const endInflectionEndLen = pointLenth(inflectionEnd, end)
    const startJointLen = pointLenth(joint, start)
    const endJointLen = pointLenth(nextJoint, end)
    let newInflectionStart = inflectionStart
    let newInflectionEnd = inflectionEnd
    const startDistance = crossWolkWidth || CROSS_WALK_WIDTH // 人行道的宽度
    const crosswalkLen = crossWolkHeight || startDistance * CROSS_SCALE_WALK_WIDTH // 人形道的长度
    if (startInflectionStartLen + crosswalkLen > startJointLen || endInflectionEndLen + crosswalkLen > endJointLen) {
      const diff = Math.abs(startJointLen) - Math.abs(endJointLen) > 0
        ? endJointLen : startJointLen
      newInflectionStart = normalMovePoint(angle.from - 90, start, diff - crosswalkLen - 30, false)
      newInflectionEnd = normalMovePoint(nextAngle.to - 90, end, diff - crosswalkLen - 30, false)
    }
    return {
      start,
      end,
      ins,
      outs,
      angle,
      nextAngle,
      inflectionStart: newInflectionStart,
      inflectionEnd: newInflectionEnd,
      width
    }
  }

  insPlugin () {
    const { children: { props: { origin, rotateadjust, coordinate: { x, y } } }, streetInfos, coord, index } = this.props
    const i = +origin.split('_')[1]
    const j = +origin.split('_')[2]
    const options = origin.split('_')[3]
    const optionsVertical = origin.split('_')[4]
    if (streetInfos.length !== 0) {
      const { turnNo, angle, outs } = streetInfos[i]
      const { inflectionStart, start, end } = this.concatCurPrePoint(i)
      const startLine1 = splitPoint(end, start, (outs + j) / turnNo)
      const startLine2 = splitPoint(end, start, (outs + j + 1) / turnNo)
      const widths = pointLenth(startLine1, startLine2)
      const len = pointLenth(start, inflectionStart)

      const scale = optionsVertical === 'left' ? splitPoint(startLine1, startLine2, (0 + Number(x)) / widths) : optionsVertical === 'center' ? splitPoint(startLine1, startLine2, (widths * 0.5 + Number(x)) / widths) : splitPoint(startLine1, startLine2, (widths + Number(x)) / widths)
      const horizonScale = options === 'start' ? coord.math2svg(normalMovePoint(angle.from - 90, scale, len - y, false)) : options === 'middle' ? coord.math2svg(normalMovePoint(angle.from - 90, scale, len / 2 - y, false)) : coord.math2svg(normalMovePoint(angle.from - 90, scale, -y, false))

      d3.select(`#cb-aspects-plugin-content${index}`)
        .attr('transform', `translate(${horizonScale.x} ${horizonScale.y}) rotate(${angle.from + Number(rotateadjust)} 0 0)`)
        .attr('width', this.offsetWidth)
        .attr('height', this.offsetHeight)
    }
  }

  roadOrigin () {
    const { children: { props: { origin, coordinate: { x, y }, rotateorigin, rotateadjust } }, streetInfos, coord, index } = this.props
    const roadId = origin.split('_')[1]
    const turnNumber = origin.split('_')[2]
    if (streetInfos.length !== 0 && streetInfos[roadId]) {
      const { turnNo, angle } = streetInfos[roadId]
      const { inflectionEnd, inflectionStart } = this.concatCurPrePoint(roadId)
      const line1 = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, turnNumber / turnNo))
      const line2 = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, (turnNumber + 1) / turnNo))
      const len = pointLenth(line1, line2)
      const centerLine = splitPoint(line1, line2, x / len)
      let transformOption = ''
      const dx = y * Math.sin(ang2rad(angle.from))
      const dy = y * Math.cos(ang2rad(angle.from))
      if (rotateorigin === 'pluginCenter') {
        transformOption = `translate(${centerLine.x - this.offsetWidth / 2 + x} ${centerLine.y - this.offsetHeight / 2 + y}) rotate(${rotateadjust} ${this.offsetWidth / 2} ${this.offsetHeight / 2})`
      } else {
        transformOption = `translate(${centerLine.x + dx} ${centerLine.y - dy}) rotate(${Number(angle.from) + Number(rotateadjust)} 0 0)`
      }
      d3.select(`#cb-aspects-plugin-content${index}`)
        .attr('transform', transformOption)
        .attr('width', this.offsetWidth)
        .attr('height', this.offsetHeight)
    }
  }

  calculationProps () {
    const { children: { props: { origin } } } = this.props
    switch (origin) {
      case 'plugin':
        this.pluginOrigin()
        break
      case 'cross':
        this.crossOrigin()
        break
      default:
        if (origin.indexOf('in') > -1) {
          this.insPlugin()
        } else if (origin.indexOf('out') > -1) {
          this.outPlugin()
        } else {
          this.roadOrigin()
        }
        break
    }
  }

  render () {
    const { index } = this.props
    return (
      <foreignObject id={`cb-aspects-plugin-content${index}`} x='0' y='0'>
        {this.props.children}
      </foreignObject>
    )
  }
}
export default Plugin
