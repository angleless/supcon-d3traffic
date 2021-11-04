import React from 'react'
// import mockData from './mock'
import PropTypes from 'prop-types'

const LINE_WIDTH = 857
const FONT_SIZE = 12
const BACKGROUND = 'white'

const RoadThrough = ({ width = 977, height = 190, points = [], ftimes = [], fqueues = [], ftotals = [], btimes = [], bqueues = [], btotals = [], style = {}, data = {}, format = v => v }) => {
//   if (!!data) {
  //       const { points, ftimes, fqueues, ftotals, btimes, bqueues, btotals } = format(data)
  //   }
  const background = style.background ? style.background : BACKGROUND
  const fontSize = style.fontSize ? style.fontSize : FONT_SIZE
  return (
    <svg style={{ background }} width='977px' height='190px' viewBox={`0 0 ${width} ${height}`} preserveAspectRatio='xMinYMin meet' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
      <g id='ROAD-THROUGH' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <g id='bg' transform='translate(0.000000, -0.000000)'>
          <rect id='border' stroke='#979797' x='0.5' y='0.5' width='976' height='189' />
          <path d='M60,95.5 L917,95.5' id='Line' stroke='#01A65E' strokeWidth='5' strokeLinecap='square' strokeDasharray='10,10' />
        </g>
        <g id='title' transform='translate(15.000000, 25.000000)' fontFamily='PingFangSC-Regular, PingFang SC' fontWeight='normal'>
          <text id='title-time-up' style={{ fontSize }} fill='#04058E'>
            <tspan x='0' y='12'>时  间：</tspan>
          </text>
          <text id='title-time-down' style={{ fontSize }} fill='#8E0606'>
            <tspan x='0' y='107'>时  间：</tspan>
          </text>
          <text id='title-queue-up' style={{ fontSize }} fill='#04058E'>
            <tspan x='0' y='43'>队/长:</tspan>
          </text>
          <text id='title-queue-down' style={{ fontSize }} fill='#8E0606'>
            <tspan x='0' y='138'>队/长：</tspan>
          </text>
        </g>
        <g id='middle' transform='translate(46.000000, 84.000000)'>
          {createCrosses(points)}
        </g>
        <g id='down' transform='translate(60.000000, 119.000000)' fill='#8E0606' fontFamily='PingFangSC-Regular, PingFang SC' style={{ fontSize }} fontWeight='normal'>
          <text id='demo-time-down'>
            {genBackTimes(btimes, points)}
          </text>
          <text id='demo-queue-down'>
            {genBackQueues(bqueues, btotals, points)}
          </text>
        </g>
        <g id='up' transform='translate(57.000000, 25.000000)' fill='#04058E' fontFamily='PingFangSC-Regular, PingFang SC' fontWeight='normal'>
          <text id='demo-queue-up' style={{ fontSize }}>
            {genFrontTimes(ftimes, points)}
          </text>
          <text id='demo-time-up' style={{ fontSize }}>
            {genFrontQueues(fqueues, ftotals, points)}
          </text>
        </g>
      </g>
    </svg>
  )
}
function genOffsetX (pointX) {
  return pointX * LINE_WIDTH
}
function pair (arr1, arr2) {
  return arr1.reduce((p, c, i, a) => {
    return p.concat([[c, arr2[i]]])
  }, [])
}
function genFrontTimes (ftimes, points) {
  return alignInfo(pair(ftimes, points)).map(genFrontTime)
}
function genFrontTime (ftimeWithPoint, i) {
  const [ftime, point] = ftimeWithPoint
  let result = null
  result = <tspan key={`ftime-${i}`} x={genOffsetX(point[0])} y='12'>{ftime}s-&gt;</tspan>
  return result
}
function genBackTimes (btimes, points) {
  return alignInfo(pair(btimes, points)).map(genBackTime)
}
function genBackTime (btimeWithPoint, i) {
  const [btime, point] = btimeWithPoint
  let result = null
  result = <tspan key={`btime-${i}`} x={genOffsetX(point[0])} y='12'>&lt;-{btime}s</tspan>
  return result
}
function genBackQueues (bqueues, btotals, points) {
  return alignInfo(pair(pair(bqueues, btotals), points)).map(genBackQueue)
}
function genBackQueue (bqueueBtotalWithPoint, i) {
  const [[bqueue, btotal], point] = bqueueBtotalWithPoint

  let result = null
  result = <tspan key={`bqueue-${i}`} x={genOffsetX(point[0])} y='44'>{bqueue}/{btotal}m</tspan>
  return result
}
function genFrontQueues (fqueues, ftotals, points) {
  return alignInfo(pair(pair(fqueues, ftotals), points)).map(genFrontQueue)
}
function genFrontQueue (fqueueFtotalWithPoint, i) {
  const [[fqueue, ftotal], point] = fqueueFtotalWithPoint

  let result = null
  result = <tspan key={`fqueue-${i}`} x={genOffsetX(point[0])} y='44'>{fqueue}/{ftotal}m</tspan>
  return result
}
function createCrosses (points = []) {
  return points.map(createCross)
}
function createCross (point, i) {
  let result = null
  result = Array.isArray(point)
    ? (
      <g id='crossWithNum' key={`corss-${i}`} transform={`translate(${LINE_WIDTH * point[0]}, 0)`}>
        <g id='cross' stroke='#000000' strokeLinecap='square' strokeWidth='1'>
          <path d='M0,11.5 L22,11.5' id='Line-2' />
          <path d='M0.5,11.5 L22.5,11.5' id='Line-2-Copy' transform='translate(11.500000, 11.500000) rotate(90.000000) translate(-11.500000, -11.500000) ' />
        </g>
        <text id='1' fontFamily='Helvetica' fontSize='12' fontWeight='normal' fill='#000000'>
          <tspan x='19' y='27'>{i}</tspan>
        </text>
      </g>
    )
    : null

  return result
}
function middlePoint (p1, p2) {
  const offsetX = -0.03
  const middleX = (p1[0] + p2[0]) / 2
  const middleY = (p1[1] + p2[1]) / 2
  return [middleX + offsetX, middleY]
}
function alignInfo (arrWithPoints) {
  const result = arrWithPoints.reduce((p, c, i, a) => {
    let result
    // [[23,129],[0.2,0]]
    if (i < a.length - 1) {
      const currentPnt = c[1]
      const nextPnt = a[i + 1][1]
      const middlePnt = middlePoint(currentPnt, nextPnt)

      result = p.concat([[c[0], middlePnt]])
    } else {
      result = p
    }
    return result
  }, [])
  return result
}

RoadThrough.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  points: PropTypes.array,
  ftimes: PropTypes.array,
  fqueues: PropTypes.array,
  ftotals: PropTypes.array,
  btimes: PropTypes.array,
  bqueues: PropTypes.array,
  btotals: PropTypes.array,
  style: PropTypes.object,
  data: PropTypes.object,
  format: PropTypes.func
}

export default RoadThrough
