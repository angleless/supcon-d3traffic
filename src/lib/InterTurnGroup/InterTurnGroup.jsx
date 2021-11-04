import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import './index.less'

class InterTurnGroup extends React.Component {
  /**
   * 计算画布经纬度边界
   * @param inter 路口经纬度
   * @param lnglats 线经纬度串
   **/
  computeMaxMin (inter, lnglats) {
    var minLon = 0
    var maxLon = 180
    var minLat = 0
    var maxLat = 90
    var lnglatsArr = lnglats.map((item, lnglatArrIndex) => {
      const newLnglats = []
      item.split(';').map((lnglat, lnglatIndex) => {
        const lnglatArr = lnglat.split(',').map((item) => { return +item })
        if (lnglatArrIndex === 0 && lnglatIndex === 0) {
          minLon = lnglatArr[0]
          maxLon = lnglatArr[0]
          minLat = lnglatArr[1]
          maxLat = lnglatArr[1]
        } else {
          lnglatArr[0] < minLon && (minLon = lnglatArr[0])
          lnglatArr[0] > maxLon && (maxLon = lnglatArr[0])
          lnglatArr[1] < minLat && (minLat = lnglatArr[1])
          lnglatArr[1] > maxLat && (maxLat = lnglatArr[1])
        }
        newLnglats.push({ lng: lnglatArr[0], lat: lnglatArr[1] })
      })
      return newLnglats
    })

    var latMaxDval = Math.max(Math.abs(maxLat - (+inter.split(',')[1])), Math.abs(minLat - (+inter.split(',')[1])))
    var lonMaxDval = Math.max(Math.abs(maxLon - (+inter.split(',')[0])), Math.abs(minLon - (+inter.split(',')[0])))
    minLon = +inter.split(',')[0] - lonMaxDval
    maxLon = +inter.split(',')[0] + lonMaxDval
    minLat = +inter.split(',')[1] - latMaxDval
    maxLat = +inter.split(',')[1] + latMaxDval
    return { lnglatsArr, minLon, maxLon, minLat, maxLat }
  }

  /**
   * 计算路口和线的画布坐标
   * @param inter 路口经纬度
   * @param line 线经纬度串
   **/
  computeScreenXY (inter, line, svgWidth, svgHeight) {
    var { lnglatsArr, minLon, maxLon, minLat, maxLat } = this.computeMaxMin(inter, line)
    var scaleX = ((maxLon - minLon)) / svgWidth
    var scaleY = ((maxLat - minLat)) / svgHeight

    var interXY = {
      X: (inter.split(',')[0] - minLon) / scaleX,
      Y: (maxLat - inter.split(',')[1]) / scaleY
    }

    var lineXYs = lnglatsArr.map((item) => {
      return item.map((lnglat) => {
        var X = (lnglat.lng - minLon) / scaleX
        var Y = (maxLat - lnglat.lat) / scaleY
        return { X, Y }
      })
    })
    // console.log(lnglatsArr)
    return { interXY, lineXYs }
  }

  /**
   * 计算线paht
   * @param lineXY 线屏幕坐标
   **/
  getLinePath (interXY, lineXY) {
    const p = d3.path()
    // 绘制线的每一个经纬度点
    lineXY.map((item, index) => {
      if (index === 0) {
        p.moveTo(item.X, item.Y)
      } else {
        p.lineTo(item.X, item.Y)
      }
    })

    // 绘制线趋势，以中心点为控制点
    // p.moveTo(lineXY[0].X, lineXY[0].Y)
    // p.quadraticCurveTo(interXY.X, interXY.Y, lineXY[lineXY.length-1].X, lineXY[lineXY.length-1].Y)

    // 贝塞尔线斜率
    // const k = ((-2) * + 2 * - 2 * 1 * interXY.X + 2 * 1 * lineXY[0].X ) / ((-2) + - 2 * 1 * interXY.Y + 2 * 1 * lineXY[0].Y)

    return p.toString()
  }

  /**
   * 计算路口点path
   * @param interXY 路口坐标
   * @param radius 路口点半径
   **/
  getInterPath (interXY, radius) {
    const p = d3.path()
    p.arc(interXY.X, interXY.Y, radius, 0, Math.PI * 2)
    return p.toString()
  }

  /**
   * 计算箭头path
   * @param lineXY 线屏幕坐标
   **/
  getLineArrowPath (interXY, lineXY) {
    // 贝塞尔线箭头
    // const { X: fromX, Y: fromY } = interXY
    // const { X: toX,   Y: toY } = lineXY[lineXY.length - 1]
    // 完整线箭头
    const { X: fromX, Y: fromY } = lineXY[lineXY.length - 2]
    const { X: toX, Y: toY } = lineXY[lineXY.length - 1]

    // theta:箭头与线的夹角, headlen:箭头线的长度
    const { headlen, theta } = Object.assign({}, { color: 'black', headlen: 10, theta: 30, lineWidth: 1 }, this.props.arrowStyle)

    var arrowX, arrowY// 箭头线终点坐标

    // 计算各角度和对应的箭头终点坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
    // var angle = Math.atan(-4.878048780487805) * 180 / Math.PI

    var angle1 = (angle + theta) * Math.PI / 180
    var angle2 = (angle - theta) * Math.PI / 180
    var topX = headlen * Math.cos(angle1)
    var topY = headlen * Math.sin(angle1)
    var botX = headlen * Math.cos(angle2)
    var botY = headlen * Math.sin(angle2)

    arrowX = toX + topX
    arrowY = toY + topY

    const p = d3.path()

    // 画上边箭头线
    p.moveTo(arrowX, arrowY)
    p.lineTo(toX, toY)

    arrowX = toX + botX
    arrowY = toY + botY

    // 画下边箭头线
    p.lineTo(arrowX, arrowY)
    return p.toString()
  }

  render () {
    const { lineStyle, interStyle, background, phaseNameStyle } = this.props
    return (
      <div className='interTurnGroup'>
        {this.props.data.map((item, index) => {
          const conWidth = 100
          const conHeight = 100
          const svgWidth = 100
          const svgHeight = item.name ? 80 : 100
          const { interXY, lineXYs } = this.computeScreenXY(item.inter, item.lnglats, svgWidth, svgHeight)

          return (
            <div key={item.name} className='phaseItem' style={{ width: conWidth, height: conHeight }}>
              {item.name && <div className='phaseName' style={{ background: phaseNameStyle.phaseNameBg, color: phaseNameStyle.phaseNameColor }}>{item.name}</div>}
              <div className='phasePic'>
                <svg style={{ background }} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  {
                    item.lnglats.map((lnglat, lnglatIndex) => {
                      return <path key={`line${lnglatIndex}`} stroke={lineStyle.strokeColor} strokeWidth={lineStyle.lineWidth} fill='none' d={this.getLinePath(interXY, lineXYs[lnglatIndex])} />
                    })
                  }
                  {
                    item.lnglats.map((lnglat, lnglatIndex) => {
                      return <path key={`arrow${lnglatIndex}`} stroke={lineStyle.strokeColor} strokeWidth={lineStyle.lineWidth} fill='none' d={this.getLineArrowPath(interXY, lineXYs[lnglatIndex])} />
                    })
                  }
                  {item.inter && <path stroke={interStyle.strokeColor} fill={interStyle.fillColor} d={this.getInterPath(interXY, interStyle.radius)} />}
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

InterTurnGroup.defaultProps = {
  data: [],
  background: 'white',
  phaseNameStyle: { phaseNameBg: 'silver', phaseNameColor: 'white' },
  arrowStyle: { color: 'black', headlen: 10, theta: 30, lineWidth: 1 },
  lineStyle: { strokeColor: 'black', lineWidth: 1 },
  interStyle: { strokeColor: 'black', fillColor: 'black', radius: 5 }
}

InterTurnGroup.propTypes = {
  data: PropTypes.array,
  arrowStyle: PropTypes.object,
  lineStyle: PropTypes.object,
  interStyle: PropTypes.object
}

export default InterTurnGroup
