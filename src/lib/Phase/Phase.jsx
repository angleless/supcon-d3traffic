import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import './index.less'

class Phase extends React.Component {
  sidewalkStyle = { strokeColor: 'white', strokeWidth: 1, sidewalkLen: 10 }
  /**
   * 计算路段path
   * @param angle 路段初始化角度
   **/
  computeRoadVertex (angle) {
    // const p = d3.path()
    const { svgHeight, svgWidth, roadStyle: { roadWidth } } = this.props
    const roadlen = Math.min(svgWidth, svgHeight) / 2 + 10
    const halfWidth = svgWidth / 2
    const halfHeight = svgHeight / 2

    const roadLeftBottom = {}
    roadLeftBottom.x = halfWidth - Math.sin((90 - angle) * Math.PI / 180) * (roadWidth / 2)
    roadLeftBottom.y = halfHeight - Math.cos((90 - angle) * Math.PI / 180) * (roadWidth / 2)

    const roadLeftTop = {}
    roadLeftTop.x = Math.sin(angle * Math.PI / 180) * roadlen + roadLeftBottom.x
    roadLeftTop.y = roadLeftBottom.y - Math.cos(angle * Math.PI / 180) * roadlen

    const roadRightBottom = {}
    roadRightBottom.x = halfWidth + Math.sin((90 - angle) * Math.PI / 180) * (roadWidth / 2)
    roadRightBottom.y = halfHeight + Math.cos((90 - angle) * Math.PI / 180) * (roadWidth / 2)

    const roadRightTop = {}
    roadRightTop.x = Math.sin(angle * Math.PI / 180) * roadlen + roadRightBottom.x
    roadRightTop.y = roadRightBottom.y - Math.cos(angle * Math.PI / 180) * roadlen

    return { roadLeftTop, roadLeftBottom, roadRightBottom, roadRightTop }
    // p.moveTo(roadLeftTop.x, roadLeftTop.y)
    // p.lineTo(roadLeftBottom.x, roadLeftBottom.y)
    // p.lineTo(roadRightBottom.x, roadRightBottom.y)
    // p.lineTo(roadRightTop.x, roadRightTop.y)

    // console.log(p.toString())
    // return p.toString()
  }

  /**
   * 计算车道path
   * @param angle 路段初始化角度
   **/
  getLaneCenterPath (laneIndex, angle) {
    const p = d3.path()
    const { svgHeight, svgWidth } = this.props
    const lanelen = Math.min(svgWidth, svgHeight) / 2
    const halfWidth = svgWidth / 2
    const halfHeight = svgHeight / 2

    const dx = Math.sin(angle * Math.PI / 180) * lanelen
    const dy = angle === 0 ? 0 : (halfHeight - dx / Math.tan(angle * Math.PI / 180))

    p.moveTo(dx + halfWidth, dy)
    p.lineTo(halfWidth, halfHeight)

    // console.log(p.toString())
    return p.toString()
  }

  renderRoads () {
    const { roadStyle: { strokeColor, fill, strokeWidth } } = this.props
    const p = d3.path()
    return Object.keys(this.roadVertexs).map(roadName => {
      const { roadLeftTop, roadLeftBottom, roadRightBottom, roadRightTop } = this.roadVertexs[roadName]
      p.moveTo(roadLeftTop.x, roadLeftTop.y)
      p.lineTo(roadLeftBottom.x, roadLeftBottom.y)
      p.lineTo(roadRightBottom.x, roadRightBottom.y)
      p.lineTo(roadRightTop.x, roadRightTop.y)
      return (
        <path
          key={roadName}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fill}
          d={p.toString()}
        />
      )
    })
  }

  renderRoadsByArcTo () {
    // M10 10 C 20 20, 40 20, 50 10
    const { roadStyle: { strokeColor, fill } } = this.props
    const roads = Object.keys(this.roadVertexs)
    const roadNum = roads.length
    const p = d3.path()

    const { roadRightTop } = this.roadVertexs[roads[0]]
    p.moveTo(roadRightTop.x, roadRightTop.y)

    roads.map((roadName, index) => {
      const nextRoadIndex = (index + 1) < roadNum ? (index + 1) : 0
      const { sidewalkRightTopPoint: rightBottom, sidewalkRightBottomPoint, roadRightTop: rightTop } = this.roadVertexs[roads[index]]
      const { roadLeftTop: leftTop, sidewalkLeftTopPoint: leftBottom, sidewalkLeftBottomPoint } = this.roadVertexs[roads[nextRoadIndex]]
      p.lineTo(rightTop.x, rightTop.y)
      p.lineTo(rightBottom.x, rightBottom.y)
      p.bezierCurveTo(sidewalkRightBottomPoint.x, sidewalkRightBottomPoint.y, sidewalkLeftBottomPoint.x, sidewalkLeftBottomPoint.y, leftBottom.x, leftBottom.y)
      p.lineTo(leftTop.x, leftTop.y)
    })
    return (
      <path
        stroke={strokeColor}
        strokeWidth={1}
        fill={fill}
        d={p.toString()}
      />
    )
  }

  computeRoadPathVertex (roads) {
    const vertexs = {}
    roads.map((road) => {
      const { roadName, angle } = road
      vertexs[roadName] = this.computeRoadVertex(angle)
      vertexs[roadName].angle = angle
      vertexs[roadName].leftCrossPoint = vertexs[roadName].roadLeftBottom
      vertexs[roadName].rightCrossPoint = vertexs[roadName].roadRightBottom
    })
    this.roadVertexs = vertexs
  }

  segmentsIntr (road1, road2) {
    const [a, b] = road1
    const [c, d] = road2
    // console.log(a,b,c,d)

    // segmentsIntr({x: 120,y:0}, {x: 120,y:100}, {x: 100,y:80}, {x: 200,y:80})
    // 如果分母为0 则平行或共线, 不相交
    var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y)
    if (denominator === 0) {
      return false
    }

    // 线段所在直线的交点坐标 (x , y)
    var x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) + (b.y - a.y) * (d.x - c.x) * a.x - (d.y - c.y) * (b.x - a.x) * c.x) / denominator
    var y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x) + (b.x - a.x) * (d.y - c.y) * a.y - (d.x - c.x) * (b.y - a.y) * c.y) / denominator

    // console.log("xxxx", a, b, c, d, x, y)

    return {
      x: x,
      y: y
    }
    // 判断交点是否在两条线段上
    // if (
    //   // 交点在线段1上, 且交点也在线段2上
    //   (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0 &&
    //   (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
    // ) {
    //   // 返回交点p
    //   return {
    //     x: x,
    //     y: y
    //   }
    // }
    // // 否则不相交
    // return false
  }

  computeRoadCrossPoint () {
    const roads = Object.keys(this.roadVertexs)
    const roadNums = roads.length
    if (roadNums > 1) {
      // 路的个数大于1，才可能存在和其他路的交点
      roads.map((roadName, index) => {
        let rightCrossPoint = null
        // 计算右交点
        if ((index + 1) < roadNums) {
          const road1 = [this.roadVertexs[roads[index]].roadRightTop, this.roadVertexs[roads[index]].roadRightBottom]
          const road2 = [this.roadVertexs[roads[index + 1]].roadLeftTop, this.roadVertexs[roads[index + 1]].roadLeftBottom]

          const angle1 = this.roadVertexs[roads[index]].angle
          const angle2 = this.roadVertexs[roads[index + 1]].angle

          if (Math.abs(angle1 - angle2) < 10) rightCrossPoint = this.roadVertexs[roads[index]].roadRightBottom
          else rightCrossPoint = this.segmentsIntr(road1, road2)
          // console.log('aaaa', road1, road2)
          // console.log('ssss', rightCrossPoint)

          rightCrossPoint &&
          (this.roadVertexs[roads[index]].rightCrossPoint = rightCrossPoint) &&
          (this.roadVertexs[roads[index + 1]].leftCrossPoint = rightCrossPoint)
        }
      })

      if (roadNums > 2) {
        let crossPoint = null
        // 计算最后一个road和第一个road的交点
        const roadLast = [this.roadVertexs[roads[roadNums - 1]].roadRightTop, this.roadVertexs[roads[roadNums - 1]].roadRightBottom]
        const roadFirst = [this.roadVertexs[roads[0]].roadLeftTop, this.roadVertexs[roads[0]].roadLeftBottom]
        // console.log(roadLast, roadFirst)
        const angle1 = this.roadVertexs[roads[roadNums - 1]].angle
        const angle2 = this.roadVertexs[roads[0]].angle
        if (Math.abs(angle1 - angle2) < 10) crossPoint = this.roadVertexs[roads[roadNums - 1]].roadRightBottom
        else crossPoint = this.segmentsIntr(roadLast, roadFirst)

        crossPoint &&
        (this.roadVertexs[roads[roadNums - 1]].rightCrossPoint = crossPoint) &&
        (this.roadVertexs[roads[0]].leftCrossPoint = crossPoint)
      }
    }
  }

  renderCrossPoints () {
    const paths = []

    Object.keys(this.roadVertexs).map((roadName) => {
      const p = d3.path()

      if (this.roadVertexs[roadName].leftCrossPoint) {
        const { x: leftCrossPointx, y: leftCrossPoiny } = this.roadVertexs[roadName].leftCrossPoint
        p.arc(leftCrossPointx, leftCrossPoiny, 3, 0, Math.PI * 2)
        paths.push(p.toString())
      }
      if (this.roadVertexs[roadName].rightCrossPoint) {
        const { x: rightCrossPointx, y: rightCrossPointy } = this.roadVertexs[roadName].rightCrossPoint
        p.arc(rightCrossPointx, rightCrossPointy, 3, 0, Math.PI * 2)
        paths.push(p.toString())
      }
    })

    return paths.map((pathstr, index) => {
      return (
        <path
          key={`crosspoint-${index}`}
          d={pathstr}
        />
      )
    })
  }

  computeRoadSidewalkPoint () {
    const { svgHeight, svgWidth, roadStyle: { roadWidth } } = this.props
    const { sidewalkLen } = this.sidewalkStyle
    const halfSvg = Math.min(svgWidth, svgHeight) / 2
    const originPoint = { x: halfSvg, y: halfSvg }

    Object.keys(this.roadVertexs).map(roadName => {
      const { leftCrossPoint, rightCrossPoint, angle } = this.roadVertexs[roadName]
      const leftCrossPointDisToOriginPoint = Math.sqrt(Math.pow((leftCrossPoint.x - originPoint.x), 2) + Math.pow((leftCrossPoint.y - originPoint.y), 2))
      const rightCrossPointDisToOriginPoint = Math.sqrt(Math.pow((rightCrossPoint.x - originPoint.x), 2) + Math.pow((rightCrossPoint.y - originPoint.y), 2))

      if (leftCrossPointDisToOriginPoint < rightCrossPointDisToOriginPoint) {
        // Math.sin((90 - angle) * Math.PI / 180)  = (rightCrossPoint.x - x?) / roadWidth
        // Math.cos((90 - angle) * Math.PI / 180)  = (rightCrossPoint.y - y?) / roadWidth
        const x = rightCrossPoint.x - Math.sin((90 - angle) * Math.PI / 180) * roadWidth
        const y = rightCrossPoint.y - Math.cos((90 - angle) * Math.PI / 180) * roadWidth
        this.roadVertexs[roadName].sidewalkLeftBottomPoint = { x, y }
        this.roadVertexs[roadName].sidewalkRightBottomPoint = { x: rightCrossPoint.x, y: rightCrossPoint.y }
      } else {
        // Math.sin((90 - angle) * Math.PI / 180)  = (x? - leftCrossPoint.x) / roadWidth
        // Math.cos((90 - angle) * Math.PI / 180)  = (y? - leftCrossPoint.y) / roadWidth
        const x = leftCrossPoint.x + Math.sin((90 - angle) * Math.PI / 180) * roadWidth
        const y = leftCrossPoint.y + Math.cos((90 - angle) * Math.PI / 180) * roadWidth
        this.roadVertexs[roadName].sidewalkLeftBottomPoint = { x: leftCrossPoint.x, y: leftCrossPoint.y }
        this.roadVertexs[roadName].sidewalkRightBottomPoint = { x, y }
      }
    })

    Object.keys(this.roadVertexs).map(roadName => {
      const { sidewalkLeftBottomPoint, sidewalkRightBottomPoint, angle } = this.roadVertexs[roadName]
      //  Math.sin((angle) * Math.PI / 180)  = (x? - sidewalkLeftBottomPoint.x) / sidewalkLen
      //  Math.cos((angle) * Math.PI / 180)  = (sidewalkLeftBottomPoint.y - y?) / sidewalkLen

      const sidewalkLeftTopPoint = {
        x: Math.sin((angle) * Math.PI / 180) * sidewalkLen + sidewalkLeftBottomPoint.x,
        y: sidewalkLeftBottomPoint.y - Math.cos((angle) * Math.PI / 180) * sidewalkLen
      }

      const sidewalkRightTopPoint = {
        x: Math.sin((angle) * Math.PI / 180) * sidewalkLen + sidewalkRightBottomPoint.x,
        y: sidewalkRightBottomPoint.y - Math.cos((angle) * Math.PI / 180) * sidewalkLen
      }

      this.roadVertexs[roadName].sidewalkLeftTopPoint = sidewalkLeftTopPoint
      this.roadVertexs[roadName].sidewalkRightTopPoint = sidewalkRightTopPoint
    })
  }

  renderSidewalkPoints () {
    const p = d3.path()
    const sidewalkPointRadius = 2
    Object.keys(this.roadVertexs).map((roadName, index) => {
      if (this.roadVertexs[roadName].sidewalkLeftBottomPoint) {
        const { x: leftCrossPointx, y: leftCrossPoiny } = this.roadVertexs[roadName].sidewalkLeftBottomPoint
        p.arc(leftCrossPointx, leftCrossPoiny, sidewalkPointRadius, 0, Math.PI * 2)
        p.closePath()
      }
      if (this.roadVertexs[roadName].sidewalkRightBottomPoint) {
        const { x: rightCrossPointx, y: rightCrossPointy } = this.roadVertexs[roadName].sidewalkRightBottomPoint
        p.arc(rightCrossPointx, rightCrossPointy, sidewalkPointRadius, 0, Math.PI * 2)
        p.closePath()
      }
      if (this.roadVertexs[roadName].sidewalkLeftTopPoint) {
        const { x: leftCrossPointx, y: leftCrossPoiny } = this.roadVertexs[roadName].sidewalkLeftTopPoint
        p.arc(leftCrossPointx, leftCrossPoiny, sidewalkPointRadius, 0, Math.PI * 2)
        p.closePath()
      }
      if (this.roadVertexs[roadName].sidewalkRightTopPoint) {
        const { x: rightCrossPointx, y: rightCrossPointy } = this.roadVertexs[roadName].sidewalkRightTopPoint
        p.arc(rightCrossPointx, rightCrossPointy, sidewalkPointRadius, 0, Math.PI * 2)
        p.closePath()
      }
    })

    return (
      <path
        key='sidewalkPoints'
        d={p.toString()}
        fill='white'
      />
    )
  }

  computeRoadOutInPoint () {
    Object.keys(this.roadVertexs).map(roadName => {
      const { sidewalkLeftBottomPoint, sidewalkRightBottomPoint, sidewalkLeftTopPoint, sidewalkRightTopPoint, angle } = this.roadVertexs[roadName]
      const leftOutBottomSidewalkBottom = {
        x: sidewalkLeftBottomPoint.x + (sidewalkRightBottomPoint.x - sidewalkLeftBottomPoint.x) / 4,
        y: sidewalkLeftBottomPoint.y + (sidewalkRightBottomPoint.y - sidewalkLeftBottomPoint.y) / 4
      }
      const leftOutBottom = {
        x: sidewalkLeftTopPoint.x + (sidewalkRightTopPoint.x - sidewalkLeftTopPoint.x) / 4,
        y: sidewalkLeftTopPoint.y + (sidewalkRightTopPoint.y - sidewalkLeftTopPoint.y) / 4
      }

      const rightInBottomSidewalkBottom = {
        x: sidewalkLeftBottomPoint.x + (sidewalkRightBottomPoint.x - sidewalkLeftBottomPoint.x) * 3 / 4,
        y: sidewalkLeftBottomPoint.y + (sidewalkRightBottomPoint.y - sidewalkLeftBottomPoint.y) * 3 / 4
      }
      const rightInBottom = {
        x: sidewalkLeftTopPoint.x + (sidewalkRightTopPoint.x - sidewalkLeftTopPoint.x) * 3 / 4,
        y: sidewalkLeftTopPoint.y + (sidewalkRightTopPoint.y - sidewalkLeftTopPoint.y) * 3 / 4
      }
      this.roadVertexs[roadName].leftOutBottom = leftOutBottom
      this.roadVertexs[roadName].rightInBottom = rightInBottom
      this.roadVertexs[roadName].leftOutBottomSidewalkBottom = leftOutBottomSidewalkBottom
      this.roadVertexs[roadName].rightInBottomSidewalkBottom = rightInBottomSidewalkBottom
      this.roadVertexs[roadName].leftOutTop = this.getOtherPointByAngle(leftOutBottom, angle)
      this.roadVertexs[roadName].rightInTop = this.getOtherPointByAngle(rightInBottom, angle)
    })
  }

  getOtherPointByAngle ({ x, y }, angle) {
    const { svgHeight, svgWidth } = this.props
    const halfWidth = Math.min(svgHeight, svgWidth) / 10
    // Math.sin(angle * Math.PI / 180) = (x? - x) / 50
    // Math.cos(angle * Math.PI / 180) = (y - y?) / 50
    return {
      x: Math.sin(angle * Math.PI / 180) * halfWidth + x,
      y: y - Math.cos(angle * Math.PI / 180) * halfWidth
    }
  }

  renderOutInLines () {
    const p1 = d3.path()
    const p2 = d3.path()
    Object.keys(this.roadVertexs).map((roadName) => {
      p1.moveTo(this.roadVertexs[roadName].leftOutTop.x, this.roadVertexs[roadName].leftOutTop.y)
      p1.lineTo(this.roadVertexs[roadName].leftOutBottom.x, this.roadVertexs[roadName].leftOutBottom.y)
    })

    Object.keys(this.roadVertexs).map((roadName) => {
      p2.moveTo(this.roadVertexs[roadName].rightInBottom.x, this.roadVertexs[roadName].rightInBottom.y)
      p2.lineTo(this.roadVertexs[roadName].rightInTop.x, this.roadVertexs[roadName].rightInTop.y)
    })

    const { turnStyle: { strokeWidth } } = this.props

    return [
      <path
        key='turnsLeft'
        d={p1.toString()}
        stroke='#56a162'
        strokeWidth={strokeWidth}
      />,
      <path
        key='turnsRight'
        d={p2.toString()}
        stroke='orange'
        strokeWidth={strokeWidth}
      />
    ]
  }

  renderSidewalkLines () {
    const p = d3.path()

    Object.keys(this.roadVertexs).map((roadName, index) => {
      p.moveTo(this.roadVertexs[roadName].sidewalkLeftTopPoint.x, this.roadVertexs[roadName].sidewalkLeftTopPoint.y)
      p.lineTo(this.roadVertexs[roadName].sidewalkRightTopPoint.x, this.roadVertexs[roadName].sidewalkRightTopPoint.y)
      p.moveTo(this.roadVertexs[roadName].sidewalkLeftBottomPoint.x, this.roadVertexs[roadName].sidewalkLeftBottomPoint.y)
      p.lineTo(this.roadVertexs[roadName].sidewalkRightBottomPoint.x, this.roadVertexs[roadName].sidewalkRightBottomPoint.y)
    })

    const { strokeColor, strokeWidth } = this.sidewalkStyle

    return (
      <path
        d={p.toString()}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    )
  }

  renderTurns () {
    const turnLinesP = d3.path()
    const turnLineArrowsP = d3.path()

    const { turns } = this.props.data

    const { turnStyle: { strokeColor, strokeWidth }, arrowStyle: { arrowLen } } = this.props

    const turnLines = turns && turns.length > 0 && turns.map(turn => {
      const { from, to } = turn
      if (from && to && this.roadVertexs[from] && this.roadVertexs[to]) {
        const point1 = this.roadVertexs[from].leftOutTop
        const point2 = this.roadVertexs[from].leftOutBottom
        const point3 = this.roadVertexs[to].rightInBottom
        const point4 = this.roadVertexs[to].rightInTop

        const ctl1 = this.roadVertexs[from].leftOutBottomSidewalkBottom

        const ctl2 = this.roadVertexs[to].rightInBottomSidewalkBottom

        turnLinesP.moveTo(point1.x, point1.y)
        turnLinesP.lineTo(point2.x, point2.y)

        if (from !== to) {
          // 非掉头
          turnLinesP.bezierCurveTo(ctl1.x, ctl1.y, ctl2.x, ctl2.y, point3.x, point3.y)
        } else {
          // 掉头
          turnLinesP.bezierCurveTo(ctl1.x, ctl1.y, ctl2.x, ctl2.y, point3.x, point3.y)
        }
        turnLinesP.lineTo(point4.x, point4.y)
        const angle = this.roadVertexs[to].angle

        const arrows = [
          {
            x: point4.x - Math.sin((90 - angle) * Math.PI / 180) * arrowLen / 2,
            y: point4.y - Math.cos((90 - angle) * Math.PI / 180) * arrowLen / 2
          }, {
            x: point4.x + Math.sin((90 - angle) * Math.PI / 180) * arrowLen / 2,
            y: point4.y + Math.cos((90 - angle) * Math.PI / 180) * arrowLen / 2
          }, {
            x: Math.sin(angle * Math.PI / 180) * Math.sqrt(3) * arrowLen / 2 + point4.x,
            y: point4.y - Math.cos(angle * Math.PI / 180) * Math.sqrt(3) * arrowLen / 2
          }, {
            x: point4.x - Math.sin((90 - angle) * Math.PI / 180) * arrowLen / 2,
            y: point4.y - Math.cos((90 - angle) * Math.PI / 180) * arrowLen / 2
          }
        ]
        turnLineArrowsP.moveTo(arrows[0].x, arrows[0].y)
        turnLineArrowsP.lineTo(arrows[1].x, arrows[1].y)
        turnLineArrowsP.lineTo(arrows[2].x, arrows[2].y)
        turnLineArrowsP.lineTo(arrows[3].x, arrows[3].y)

        return [
          <path
            key='turnsLine'
            d={turnLinesP.toString()}
            stroke={strokeColor}
            fill='none'
            strokeWidth={strokeWidth}
          />,
          <path
            key='turnsLineArrows'
            d={turnLineArrowsP.toString()}
            stroke={strokeColor}
            fill={strokeColor}
            strokeWidth={0}
          />
        ]
      }
    })
    return turnLines
  }

  render () {
    const { background, svgHeight, svgWidth } = this.props
    const { roads } = this.props.data
    const sortedRoads = roads.sort((a, b) => {
      if (a.angle < b.angle) {
        return -1
      } else if (a.angle === b.angle) {
        return 0
      } else {
        return 1
      }
    })
    this.computeRoadPathVertex(sortedRoads)
    // this.computeRoadPathVertex(roads)
    this.computeRoadCrossPoint()
    this.computeRoadSidewalkPoint()
    this.computeRoadOutInPoint()

    // console.log(this.roadVertexs)
    return (
      <div className='phaseGroup'>
        <svg style={{ background, height: svgHeight, width: svgWidth, border: '1px solid silver' }}>
          {/* {this.renderRoads()} */}
          {this.renderRoadsByArcTo()}
          {/* {this.renderSidewalkPoints()} */}
          {/* {this.renderCrossPoints()} */}
          {/* {this.renderSidewalkLines()} */}
          {/* {this.renderOutInLines()} */}
          {this.renderTurns()}
        </svg>
      </div>
    )
  }
}

Phase.defaultProps = {
  data: {},
  svgWidth: 200,
  svgHeight: 200,
  background: '#646464',
  roadStyle: { strokeColor: '#515151', fill: '#515151', roadWidth: 20, strokeWidth: 0 }, // #44444670
  turnStyle: { strokeColor: '#ffffff', strokeWidth: 1 },
  arrowStyle: { arrowLen: 5 }
}

Phase.propTypes = {
  data: PropTypes.object,
  svgWidth: PropTypes.number,
  svgHeight: PropTypes.number,
  background: PropTypes.string,
  roadStyle: PropTypes.object,
  turnStyle: PropTypes.object,
  arrowStyle: PropTypes.object
}

export default Phase
