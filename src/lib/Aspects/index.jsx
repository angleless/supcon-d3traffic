import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pointLenth, segmentDividePoints, splitPoint, normalMovePoint, ang2rad, pointOblique } from './geometry'
import { caclStreetInfos, streetBorderPath, SVGCoord, directions2Id, correctPoint, originDataInfos , reSizeWidthInfo} from './utils'
// import Device from './Device'
import {
  WIDTH,
  HEIGHT,
  CROSS_WALK_WIDTH,
  CROSS_SCALE_WALK_WIDTH
} from './consts'
import InnerAddDevice from './InnerAddDevice'
import InnerAddDirections from './InnerAddDirections'
import Plugin from './Plugin'
import CenterLight from './CenterLight'
import AddDevice from './AddDevice'
import AddDirection from './AddDirection'
import InnerCenterLight from './InnerCenterLight'
import TrafficFlow from './TrafficFlow'
import * as d3 from 'd3'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import zip from 'ramda/src/zip'
import mock from './mock'
import iconBg from './bg.png'
import './Aspects.less'
import svgPanZoom from 'svg-pan-zoom'

class Aspects extends Component {
  constructor (props) {
    super(props)
    this.flag = false
    this.x = 0
    this.dx = 0
    this.left = 0
    this.y = 0
    this.dy = 0
    this.top = 0
  }

  initialState = {
    svg: null,
    coord: null,
    data: null,
    left: 0,
    top: 0,
    prevDrection: null,
    streetInfos: [],
    showAddModal: false,
    showAddDirectionsModal: false,
    modalCoordinate: {},
    editRoadParams: {},
    checked: false,
    areaLength: 0,
    showRoadName: false,
    showWaitingArea: false,
    isEdited: false,
    isEditOut: false,
    isSelect: false,
    showTip: false,
    flag: false,
    center: {},
    contentScale: { x: 1, y: 1 },
    tipCoordinate: { x: 0, y: 0 }
  }

  componentWillMount () {
    const { width, height, background } = this.props
    const w = parseInt(width) ? parseInt(width) : WIDTH
    const h = parseInt(height) ? parseInt(height) : HEIGHT
    this.setState({
      ...this.initialState,
      background,
      w,
      h
    })
  }

  colorDictionory = {
    1: '#1890FF',
    2: '#29C754',
    3: '#FBCC0E',
    4: '#233273',
    5: '#8543E1',
    6: '#00C5CC',
    7: '#e96D11',
    8: '#9AE65C',
    9: '#3061F2',
    10: '#2F8F4D',
    11: '#E3F23D',
    12: '#3535C7',
    13: '#CD55F2',
    14: '#0BE6C1',
    15: '#FFA56A',
    16: '#A2C0DB'
  }

  addRoadBtnPlugin () {
    // 添加车道按钮的svg
    const { streetInfos, coord } = this.state
    const addList = streetInfos.map((items, laneIndex) => {
      // turnNo 车道总数量包括进口道和出口道
      // isOutBool 是否显示出口道
      // isInsBool 是否显示进口道
      // startOptions 在左边道路偏移20像素在安置增删车道的按钮
      // insLine2 在右边边道路偏移20像素在安置增删车道的按钮
      const { turnNo, angle, isOutBool, isInsBool, ins, outs } = items
      const { inflectionStart, inflectionEnd } = this.concatCurPrePoint(laneIndex)
      const newSaftStartLine = inflectionStart
      const newSaftEndLine = inflectionEnd
      const laneWidth = pointLenth(newSaftEndLine, newSaftStartLine)
      const startTurnNo = turnNo === 0 ? 1 : (laneWidth + 20) / laneWidth
      const endTurnNo = turnNo === 0 ? 0.7 : (laneWidth + 20) / laneWidth
      const startOptions = coord.math2svg(splitPoint(newSaftEndLine, newSaftStartLine, startTurnNo))
      const insLine2 = coord.math2svg(splitPoint(newSaftStartLine, newSaftEndLine, endTurnNo))
      const btnlist = []
      for (let i = 0; i < 4; i++) {
        if (!isOutBool && i === 2) {
          break
        }
        // 距离人行道300的位置点
        const startOption = 300
        if (isInsBool && (i === 0 || i === 1)) { // 如果为进口道
          const startPsi = 300
          const disY = i % 2 === 0 ? 32 : 0 // i % 2 === 0 为添加按钮进口道的 否则为删除进口道
          const type = i % 2 === 0 ? 'insAdd' : 'insDelete'
          // dx: dy: 通过这个300 加上30 或 0 的距离找到他们相应的x点和y左标点
          // x, y 通过之前的点准确找到具体的x，y坐标点
          // numb方向为0 或者180的道路不变其他的翻转90+保证每个按钮都是正方向的
          const dx = (startPsi + disY) * Math.sin(ang2rad(angle.from))
          const dy = (startPsi + disY) * Math.cos(ang2rad(angle.from))
          const x = insLine2.x + dx
          const y = insLine2.y - dy
          const numb = angle.from === 0 || angle.from === 180 ? angle.from : angle.from + 90
          ins.length > 0 && btnlist.push(
            <foreignObject key={`${laneIndex}_${i}`} id='cb-aspects-add-lane-button' transform={`translate(${x - 14} ${y - 14}) rotate(${numb} ${14} ${14})`} x={0} y={0} width={28} height={28}>
              <div
                className='lane-btn'
                onClick={() => {
                  this.addLaneOption(laneIndex, type)
                }}
                onMouseOver={() => {
                  this.setState({
                    showTip: true,
                    tipWords: `${i % 2 === 0 ? '增加进口道' : '减少进口道'}`,
                    tipCoordinate: { x: x, y: y }
                  })
                }}
                onMouseOut={() => {
                  this.setState({
                    showTip: false
                  })
                }}
              >
                <i className='ori' />
                {i % 2 === 0 && <i className='hro' />}
              </div>
            </foreignObject>)
          ins.length === 0 && i % 2 === 0 && btnlist.push(
            <foreignObject key={`${laneIndex}_${i}`} id='cb-aspects-add-lane-button' transform={`translate(${x - 14} ${y - 14}) rotate(${numb} ${14} ${14})`} x={0} y={0} width={28} height={28}>
              <div
                className='lane-btn'
                onClick={() => {
                  this.addLaneOption(laneIndex, type)
                }}
                onMouseOver={() => {
                  this.setState({
                    showTip: true,
                    tipWords: `${i % 2 === 0 ? '增加进口道' : '减少进口道'}`,
                    tipCoordinate: { x: x, y: y }
                  })
                }}
                onMouseOut={() => {
                  this.setState({
                    showTip: false
                  })
                }}
              >
                <i className='ori' />
                <i className='hro' />
              </div>
            </foreignObject>)
        }
        if (isOutBool && (i === 2 || i === 3)) {
          // 如果是出口道的增删车道
          const disY = i % 2 === 0 ? 32 : 0
          const type = i % 2 === 0 ? 'outAdd' : 'outDelete'
          const startLine = Math.abs(angle.to - angle.from) < 30 ? insLine2 : startOptions
          const dx = (startOption + disY) * Math.sin(ang2rad(angle.from))
          const dy = (startOption + disY) * Math.cos(ang2rad(angle.from))
          const x = startLine.x + dx
          const y = startLine.y - dy
          const numb = angle.from === 0 || angle.from === 180 ? angle.from : angle.from + 90
          outs > 0 && btnlist.push(
            <foreignObject key={`${laneIndex}_${i}`} id='cb-aspects-add-lane-out-button' transform={`translate(${x - 14} ${y - 14}) rotate(${numb} ${14} ${14})`} x={0} y={0} width={28} height={28}>
              <div
                className='lane-btn'
                onClick={() => {
                  this.addLaneOption(laneIndex, type)
                }}
                onMouseOver={() => {
                  this.setState({
                    showTip: true,
                    tipWords: `${i % 2 === 0 ? '增加出口道' : '减少出口道'}`,
                    tipCoordinate: { x: x, y: y }
                  })
                }}
                onMouseOut={() => {
                  this.setState({
                    showTip: false
                  })
                }}
              >
                <i className='ori' />
                {i % 2 === 0 && <i className='hro' />}
              </div>
            </foreignObject>)
          outs === 0 && i % 2 === 0 && btnlist.push(
            <foreignObject key={`${laneIndex}_${i}`} id='cb-aspects-add-lane-out-button' transform={`translate(${x - 14} ${y - 14}) rotate(${numb} ${14} ${14})`} x={0} y={0} width={28} height={28}>
              <div
                className='lane-btn'
                onClick={() => {
                  this.addLaneOption(laneIndex, type)
                }}
                onMouseOver={() => {
                  this.setState({
                    showTip: true,
                    tipWords: `${i % 2 === 0 ? '增加出口道' : '减少出口道'}`,
                    tipCoordinate: { x: x, y: y }
                  })
                }}
                onMouseOut={() => {
                  this.setState({
                    showTip: false
                  })
                }}
              >
                <i className='ori' />
                <i className='hro' />
              </div>
            </foreignObject>)
        }
      }
      return btnlist
    })
    return addList
  }
  render () {
    const { data: { center: { x, y }, showLight }, width, height,addBtnBool } = this.props
    const { background, isEdited, isSelect, showTip, showAddDirectionsModal, modalCoordinate, areaLength, checked, editRoadParams, showAddModal, w, h, top, left } = this.state
    return (
      <div id='cb-aspects-container' style={{ width: width, height: height, transformOrigin: '0 0' }}>
        <svg id='cb-aspects-svg' viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ background: `${background || 'transparent'}`, w, h }}>
          <pattern id='bg' width={w === 0 ? 0 : 24 / w} height={h === 0 ? 0 : 24 / h}>
            <rect x='0' y='0' width='24' height='24' fill='#ebebeb' />
            <image xlinkHref={iconBg} width='24' height='24' />
          </pattern>
          <rect x='0' y='0' width={w} height={h} fill='url(#bg)' />
          {
            this.props.colorData && this.props.colorData.map((items) => {
              return (
                items.trid.split(',').map((_item, index) => {
                  return (
                    <defs key={index}>
                      <linearGradient id={`Gradient${_item},${items.frid}`}>
                        <stop stopColor={items.color} offset='0%' />
                        <stop stopColor={items.color} offset='50%' />
                      </linearGradient>
                    </defs>
                  )
                })
              )
            })
          }
          {
            this.props.colorData && this.props.colorData.map((items, index) => {
              return items.turnDirNo.split(',').map((obj, i) => {
                return (
                  <defs key={i}>
                    <linearGradient id={`GradientLane${obj},${items.frid}`}>
                      <stop stopColor={items.color} offset='0%' />
                      <stop stopColor={items.color} offset='50%' />
                    </linearGradient>
                  </defs>
                )
              })
            })
          }
          <pattern id='grass' width='40%' height='6%' patternContentUnits='objectBoundingBox'>
            <image
              id='image0'
              width='1000'
              height='1000'
              x='0'
              y='0'
              href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAMK2lDQ1BpY2MAAHjalVd3VJN3F37e
              kYSEMBNRkBE2giiibNlbEJANLkISIBBCfElQcVtrK1gHKg4cddRdbR2g1IGodRbBbR0fDlSUWtTi
              Vr4/ErDjO+c7/Z2TN/c8v+c+97n3vCcnFzBKEqtUCtIYKFaqmeToMFFmVraI8wAESPBgAZFYUqoK
              TUqKB4Ce77+eV1dBAMAld7FKpcC/OyZSWakEIJIA5EpLJcUAsQ+gvSUqRg2wOgDYT1Sr1ADbGICQ
              yczKBtgOAIT52tgXgDBXG8cDEDKpyeEAOwfQ44vFTD5gqAAgKpPkqwHD+QA8lFK5EjA8BCBIUiCW
              AoYfAAwsLi6RAkYuAFxy/6ST/xfN3F5NsTi/N9b2AgDQi5CXqhTiyf9yHP//FCs0PTXsAfALmJhk
              AEKA2FdUEpcMgA8Qp5W5CYkATAHislwK6OKHBZqYNB3/jaQ0PBuAGUDypeKIOACWAGmnVCTE6/Cg
              PHlULABjgEyVq2NTtbmklClJ1umTk2SlkSk9sZgBdJwKTVFaqE5zbYEstkezvrwgNUPrk2wuk6cn
              ADAEyFulRSlxOs6T8oLwhB4Oo0lOA+AAUMhjopK1HMqhuLSnL8q/QB6boIvj1QWpMdpcapxEHJkC
              oB9AFcpKM+N7fEplEZHavqjZMmWazj9VpVKHJev4m1SKJB2fOiRTRCcDsAOoptKylJ7cTjWTqps/
              DZU6KVXrjRYWikckaT3QrohHOCIgggYi5KIEhZA3ddR1QKS7iYIYDPIhg7sO6cnIgBgMlBAjBeX4
              DUrIUNqbFwYxGMhQBiU+9qLapzvyIAaDMshQiiI8BINixEEBGTRgIIOyt1o6HoCB/B/VJSiBAiVg
              IP8nJjLqwdiR7Ah2DDuKPYC2oIPoADqeDqJD6CDak/al/Xp8feazHrJaWPdYV1itrBvj5bOZvzkX
              YSRaodFNRYbcP3dHO9GetBcdRgfSQbQfRLQZbQF3ehjtS4fSwXQA7UX7/cWrprfjz7PUaXE9uCS3
              LzeE6/J3B4auhl69KjIo/zILra/c3mmF9978vY/wP81PihLE/Z1JfU3tpU5Rx6gz1CGqDiLqKHWA
              Ok8dpur+9G48AIP83mrJkEGJIigg/0c9sa4mAxlKPXZ4tHt80N1BLZukBoDwEtVkRp5foBaFqlQK
              mShWKRk0UOTp4ekBZGZli7Q/LS/NQAAgzM5+xiY0AH4VAJH/GRPbAwcfAoJXnzH7FwB/EXC4WaJh
              yrQYDQAs8GAEIcxhDXu4wB2e8EYAQhCJEUhEKrIwDhIUoBgMJmIqZmEuKrEIy7AK67ARW/E99qAO
              h3AMP+McmnEFN9GKNjxFJ17hPUEQHMKAEBDmhA3hSLgRnoQvEUREEvFEMpFF5BD5hJLQEFOJL4hK
              oopYRawnthE/EgeJY8QZooW4Qdwl2okXxDuSIvmkkLQincjBpC8ZSsaRqeRYMp+cQJaTc8gF5Apy
              A7mTrCWPkefIK2Qr+ZTsokDpU2aULeVO+VLhVCKVTeVRDDWdqqCqqQ3ULqqeOkVdolqpDuotzaYF
              tIh2pwPoGDqNltAT6On0fHoVvZWupU/Ql+i7dCf9iWXAsmS5sfxZsaxMVj5rImsuq5q1mbWfdZJ1
              hdXGesVms83Yzmwfdgw7i13InsKez17D3s1uYLew77O7OByOOceNE8hJ5Ig5as5czkrOTs5RzkVO
              G+eNnr6ejZ6nXpRetp5Sb7Zetd52vSN6F/Ue6b3nGnMduf7cRK6UO5m7kLuJW8+9wG3jvueZ8Jx5
              gbxUXiFvFm8FbxfvJO8W76W+vr6dvp/+KH25/kz9Ffo/6J/Wv6v/lm/Kd+WH88fwNfwF/C38Bv4N
              /ksDAwMngxCDbAO1wQKDbQbHDe4YvDEUGA4yjDWUGs4wrDGsNbxo+MyIa+RoFGo0zqjcqNpor9EF
              ow5jrrGTcbix2Hi6cY3xQeNrxl0mApMhJokmxSbzTbabnDF5bMoxdTKNNJWazjHdaHrc9L6AEtgL
              wgUSwReCTYKTgjYhW+gsjBUWCiuF3wubhJ19TPsM65PeZ1Kfmj6H+7SaUWZOZrFmCrOFZnvMrpq9
              62vVN7SvrO+8vrv6Xuz7ul//fiH9ZP0q+u3ud6XfO3OReaR5kfli8zrz2xa0havFKIuJFmstTlp0
              9Bf2D+gv6V/Rf0//Xy1JS1fLZMsplhstz1t2WVlbRVuprFZaHbfqsDazDrEutF5qfcS63UZgE2Qj
              t1lqc9TmiaiPKFSkEK0QnRB12lraxthqbNfbNtm+t3O2S7Obbbfb7rY9z97XPs9+qX2jfaeDjcNI
              h6kOOxx+deQ6+joWOC53POX42snZKcPpK6c6p8fO/ZxjncuddzjfcjFwCXaZ4LLB5fIA9gDfAUUD
              1gxodiVdvVwLXGtcL7iRbt5ucrc1bi0DWQP9BioHbhh4zZ3vHupe5r7D/e4gs0Hxg2YPqhv0bLDD
              4OzBiwefGvzJw8tD4bHJ4+YQ0yEjhsweUj/khaerp8SzxvPyUIOhUUNnDD0w9Pkwt2GyYWuHXfcS
              eI30+sqr0eujt483473Lu93HwSfHZ7XPNV+hb5LvfN/Tfiy/ML8Zfof83vp7+6v99/j/HuAeUBSw
              PeDxcOfhsuGbht8PtAsUB64PbA0SBeUEfRvUGmwbLA7eEHwvxD5EGrI55FHogNDC0J2hz8I8wpiw
              /WGvw/3Dp4U3RFAR0REVEU2RppFpkasi70TZReVH7YjqjPaKnhLdEMOKiYtZHHMt1ipWErsttnOE
              z4hpI07E8eNS4lbF3Yt3jWfi60eSI0eMXDLyVoJjgjKhLhGJsYlLEm8nOSdNSPppFHtU0qiaUQ+T
              hyRPTT6VIkgZn7I95VVqWOrC1JtpLmmatMZ0o/Qx6dvSX2dEZFRltGYOzpyWeS7LIkuedSCbk52e
              vTm7a3Tk6GWj28Z4jZk75upY57GTxp4ZZzFOMe7weKPx4vF7c1g5GTnbcz6IE8UbxF25sbmrczsl
              4ZLlkqfSEOlSabssUFYle5QXmFeV9zg/MH9JfntBcEF1QYc8XL5K/rwwpnBd4euixKItRd2KDMXu
              Yr3inOKDSlNlkfJEiXXJpJIWlZtqrqp1gv+EZRM6mThmcylROrb0gFqoVqnPa1w0X2rulgWV1ZS9
              mZg+ce8kk0nKSecnu06eN/lReVT5d1PoKZIpjVNtp86aenda6LT104npudMbZ9jPmDOjbWb0zK2z
              eLOKZv0y22N21ew/vsj4on6O1ZyZc+5/Gf3ljrmGc5m5174K+Grd1/TX8q+b5g2dt3LepwppxdlK
              j8rqyg/zJfPPfjPkmxXfdC/IW9C00Hvh2kXsRcpFVxcHL95aZVJVXnV/ycgltUtFSyuW/rFs/LIz
              1cOq1y3nLdcsb10Rv+LASoeVi1Z+WFWw6kpNWM3u1Zar561+vUa65uLakLW71lmtq1z37lv5t9fX
              R6+v3eC0oXoje2PZxoeb0jed+s73u22bLTZXbv64RbmldWvy1hPbfLZt2265feEOcodmR/vOMTub
              v4/4/sAu913rd5vtrvwBP2h+ePJjzo9X98Ttadzru3fXPsd9q/cL9lfUErWTazvrCupaD2QdaDk4
              4mBjfUD9/p8G/bTlkO2hmsN9Di88wjsy50j30fKjXQ2qho5j+cfuN45vvHk88/jlE6NONJ2MO3n6
              56ifj58KPXX0dODpQ2f8zxw863u27pz3udrzXuf3/+L1y/4m76baCz4XDjT7Nde3DG85cjH44rFL
              EZd+vhx7+dyVhCstV9OuXr825lrrden1xzcUN57/Wvbr+5szb7FuVdw2vl19x/LOhv8M+M/uVu/W
              w3cj7p6/l3Lv5n3J/acPSh98aJvz0OBh9SObR9seez4+1B7V3vxk9JO2p6qn7zvm/mby2+pnLs/2
              /R7y+/nOzM6258zz7hfzX5q/3PLHsD8au5K67rwqfvX+dcUb8zdb3/q+PfUu492j9xM/cD6s+Djg
              Y/2nuE+3uou7u1ViRgwAoACQeXnAiy2AQRYgaAZ4o7W7GQCA0O6TgPY/yP+OtfsbAMAb2BICpM0E
              4huAtQ2A40yA3wAkAUgNATl0aO9Hd0rzhnpqtfgMwHrT3f3SCuDUAx+Z7u73a7q7P24CqBtAwwTt
              Tghod9BvBwFAc9uzf+xm/wUn93Ei44digAAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpg
              AAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAd3RF
              WHRSYXcgcHJvZmlsZSB0eXBlIDhiaW0ACjhiaW0KICAgICAgNDAKMzg0MjQ5NGQwNDA0MDAwMDAw
              MDAwMDAwMzg0MjQ5NGQwNDI1MDAwMDAwMDAwMDEwZDQxZDhjZDk4ZjAwYjIwNGU5ODAwOTk4CmVj
              Zjg0MjdlCqZTw44AAAAldEVYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAKaXB0YwogICAgICAgMArA
              1vxmAAADf0lEQVQ4ywXBSY8cNRgA0M/256VcVV3VPTM9mTAkQUhIOcApHBAnhMT/v+ZEcgiaSe+u
              xbvNe+SPfz4BlLZr7LIGtzLON8+D9/H85dT2HeHYd7uXr98p+kYjFen5/TvI8PLyYoxBkiotEGzJ
              uTadLjFdDsfJeQ6MM5ymOfjKVGGEN0Lo/cik8pdrq7lUG/bn37+zUk2wQ98v1kbvEKUSssSYUljX
              WXCqOy41pJpb/WDX+O/nz/McbAS2f9svwSPSpkEX1uiZIPTp/okJaWZfA5CSXIqMsgxwmg1CbVsp
              m347btnuhzHbSDkTA0GOjDESiRobOWw2cnj37sPxuwnOgOA1FT9PV3PFnhdWk6/s7lkXUhvZFgrW
              LoSJ7JxQOrgluKJ7VWWwbmEgnEupoGKUIJSazW0iv/31cw2FClETIS20nMusSk2ZkZroTBcGWYMG
              IJVR3crL8eLrqrtNtYkN+zbFpLUc3+43cpzNpDm/TlMpOQW/mFsC0vUypJRjYIRqpQXjkzGtbpDT
              9nY+DxsxoFqus7lY+oB62yIQzlBdaKwshlowmKtzp/nN473iKLFJBfDx7q4TnCLebe9ns+ihUb0G
              ulAmYgBbckoZTOZaNFpr5NHVUmqKvmTCfvn4E1BolM4kny+H1c82RhDtoLch1qEdJYLNYduP43hn
              fZCcEMlCSJxRerOTK4V18jrZyGvh4vj127bZS7nF2mArdvv7FuT1Mk+nE9ToEY6nUy0JiqMAFCUK
              hgwzyaiA7d//WKovZeaQgrE11KfnD4SHlBLjbPLXEOJkwm2i7OOnX8euBZo7LkchGRAuePSuQR6c
              N9djFlwqiCFH8MPuvh92w6g4ZxUrdkpQrOY62eCQSkXZ4uzxcBGRZRY9gbak19dDSpl3uwClVZg8
              gqgNVPbm7c4FezgersskG6aU7NoHJbp5WSrF8WHnnK3Vd8NWik2pkJO/Hm7LtCitEIVcnVVKE9Jk
              3lySa7JC1Uwvx61UWAmhEGOM1ga/atVEIH6tx8NSHGKp5OHpMcVbdBalNjN7tWY1Nw6sFjLIzaZn
              3/7zhSTAYnwIU5ZSvn98Oh3PKAcauS+Vh2QmE7hQrehkX3jKWcyuaGJj3w+362xmL5FRVoZWIeXm
              Ymhcw/n8vdIYE8l20YrkcFujhYHq7fawnl/NaV7cPLkwuVKgaeRc7H/HL91O/Q9HyzpLvu+gmgAA
              AGxlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQA
              AAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAKgAgAEAAAAAQAAABSgAwAEAAAAAQAAABQAAAAA
              2PcZ+wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNC0yM1QxMTozMDoyOSswODowMNNye5YAAAAl
              dEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDQtMjNUMTE6MzA6MjkrMDg6MDCiL8MqAAAAEnRFWHRleGlm
              OkV4aWZPZmZzZXQANzjJ1HsnAAAAF3RFWHRleGlmOlBpeGVsWERpbWVuc2lvbgAyMH+5N3oAAAAX
              dEVYdGV4aWY6UGl4ZWxZRGltZW5zaW9uADIwoi/u/wAAACh0RVh0aWNjOmNvcHlyaWdodABDb3B5
              cmlnaHQgQXBwbGUgSW5jLiwgMjAyMAq63rAAAAAXdEVYdGljYzpkZXNjcmlwdGlvbgBEaXNwbGF5
              FxuVuAAAAABJRU5ErkJggg=='
            />
          </pattern>
          <g id='cb-aspects-symbols'>
            <symbol width='24' height='24' id='LEFT_STRAIGHT_RIGHT_BACK' viewBox='0 0 1024 1024'>
              <path d='M518.276741 0L597.333333 408.187259h-51.607703L545.716148 546.133333l136.154074-120.272592V293.925926L758.518519 497.701926 681.860741 675.081481V557.653333L545.716148 673.943704V1014.518519h-1.34637v0.142222H483.555556V1014.518519h-0.12326v-2.740149h-3.811555V708.41837c-13.539556-19.560296-32.95763-29.345185-58.263704-29.345185-34.721185 0-50.669037 22.584889-47.853037 67.745185l0.208593 2.910815v49.464889h57.144888L348.16 1011.787852 265.481481 799.184593h57.154371V701.696c4.721778-13.293037 10.477037-24.841481 17.256296-34.645333L265.481481 494.838519l76.657778-203.776v131.925333l141.293037 124.823704V408.187259H436.148148L518.276741 0zM342.139259 554.780444v109.160297C361.035852 638.501926 387.441778 625.777778 421.357037 625.777778c1.336889 0 2.673778 0.018963 3.982222 0.06637l-83.2-71.063704z' />
            </symbol>
            <symbol id='NONE' width='40' fillOpacity='0'>
              <path d='M22.7663551,46.278417 L22.7663551,90 L22.3069868,90 L17.271028,90 L17.271028,46.278417 L6.34682724,34.7099459 L6.34682724,49.0104037 L0,25.4898044 L6.34682724,0 L6.34682724,15.127757 L20.0186916,30.101755 L33.6905559,15.127757 L33.6905559,0 L40.0373832,25.4898044 L33.6905559,49.0104037 L33.6905559,34.7099459 L22.7663551,46.278417 Z' />
            </symbol>
            <symbol width='24' height='24' id='STRAIGHT' viewBox='0 0 1024 1024'>
              <path d='M 478.38 412.002 H 430.654 L 513.55 0 L 593.346 412.002 h -52.09 V 1024 h -62.8755 Z' />
            </symbol>
            <symbol id='LEFT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M 450.608 0 L 373.234 290.022 l 77.3742 267.609 V 394.919 l 138.766 137.159 V 1024 H 650.766 V 376.727 L 450.608 172.118 Z' />
            </symbol>

            <symbol id='BACK' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 696.889 1024 V 125.819 C 660.414 41.9271 607.953 0 539.525 0 C 471.097 0 422.874 41.9366 394.875 125.819 v 212.158 H 327.111 l 99.5461 407.96 l 108.136 -407.96 h -69.5467 v -94.9096 c 4.95882 -62.0658 29.7244 -93.1081 74.2779 -93.1081 c 44.563 0 73.7185 31.0424 87.4667 93.1081 V 1024' />
            </symbol>
            <symbol id='RIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 571.277 0 L 645.981 290.022 l -74.7041 267.609 V 394.919 l -133.981 137.159 V 1024 H 378.019 V 376.727 l 193.258 -204.609 Z' />
            </symbol>
            <symbol id='STRAIGHT_RIGHT_BACK' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M512.176 0l77.52 413.104h-48.544v133.712l135.264-127.52V251.232L744 460.24l-67.584 209.008v-153.52l-135.264 128.16V1024h-56.272V718.032c-12.896-21.76-31.92-32.624-57.12-32.624-33.6 0-48.656 23.776-45.152 71.312v49.92h54.176l-78.4 214.608L280 806.656h54.176v-98.4c17.072-51.088 48.256-76.64 93.6-76.64 23.536 0 42.592 7.632 57.12 22.848l-0.016-241.36H434.672L512.16 0z' />
            </symbol>
            <symbol id='BACK_RIGHT' viewBox='0 0 1024 1024' width='22' height='22'>
              <path d='M674.452645 0L751.483871 287.331097 674.452645 552.464516v-161.197419l-138.173935 135.894709v487.357936h-61.109678V688.194065c-9.529806-38.730323-28.787613-58.103742-57.806451-58.103742-29.844645 0-46.426839 20.513032-49.763097 61.539096v62.728258h46.592L341.751742 1024 275.059613 754.357677h45.402839v-140.238451c18.745806-55.444645 51.051355-83.15871 96.900129-83.15871 21.652645 0 40.910452 6.177032 57.806451 18.547613V373.248l199.283613-202.718968V0z' />
            </symbol>
            <symbol id='STRAIGHT_RIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 405.36 1024 V 413.103 H 354.093 L 433.238 0 l 79.1351 413.103 h -49.5731 v 337.413 L 600.906 614.41 v -168.051 L 669.907 718.733 l -69.0004 258.699 V 823.928 L 462.81 952.09 V 1024 Z' />
            </symbol>
            {/* <symbol id='RIGHT_STRAIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 405.36 1024 V 413.103 H 354.093 L 433.238 0 l 79.1351 413.103 h -49.5731 v 337.413 L 600.906 614.41 v -168.051 L 669.907 718.733 l -69.0004 258.699 V 823.928 L 462.81 952.09 V 1024 Z' />
            </symbol> */}
            <symbol id='STRAIGHT_LEFT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
            </symbol>
            <symbol id='LEFT_STRAIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
            </symbol>
            <symbol id='LEFT_BACK' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />
            </symbol>
            <symbol id='LEFT_RIGHT_BACK' viewBox='0 0 1024 1024' width='20' height='20'>
              <path d='M478.504673 1024V580.368748c-14.068037-25.446879-32.289495-38.165533-54.673944-38.165533-29.810841 0-44.721047 22.56628-44.721047 67.708411V806.663178h53.640374l-77.613458 214.590205L277.53271 806.653607h53.640374V574.617121a238.63028 238.63028 0 0 1 10.24-30.557308L267.962617 290.021682 345.336822 0v206.101533L512 376.468336l166.663178-170.366803V0L756.037383 290.021682l-77.374205 267.608524V360.046056L545.495327 491.653981V1024h-66.990654zM345.336822 360.046056v175.285832c17.943925-37.179813 44.118131-55.764935 78.493907-55.764935 22.307888 0 40.538916 6.316262 54.683514 18.939215L478.504673 491.663551 345.336822 360.046056z' />
            </symbol>
            <symbol id='LEFT_STRAIGHT_BACK' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M587.824 0L664 413.104h-49.344V1024H559.36V714.784c-12.608-19.584-30.656-29.376-54.128-29.376-33.04 0-47.84 23.776-44.4 71.312v49.92H514.08L437.04 1021.264 360 806.656h53.248v-98.4c16.768-51.088 47.424-76.64 91.984-76.64 22.064 0 40.112 6.944 54.128 20.8v-8.528l-132.944-128.16v153.52L360 460.24l66.416-209.008v168.064l132.944 127.52v-133.712H511.648L587.808 0z' />
            </symbol>
            <symbol id='BACK_LEFT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />
            </symbol>
            {/* <symbol id='LEFT_RIGHT_STRAIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
            </symbol> */}
            <symbol id='LEFT_STRAIGHT_RIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
            </symbol>
            {/* <symbol id='RIGHT_STRAIGHT_LEFT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
            </symbol>
            <symbol id='RIGHT_LEFT_STRAIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
            </symbol>
            <symbol id='STRAIGHT_RIGHT_LEFT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
            </symbol>
            <symbol id='STRAIGHT_LEFT_RIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M483.146168 1024v-71.909682L349.22228 823.927626v153.504299L282.317757 718.761869 349.22228 446.349159v168.060411l133.923888 136.105869V413.102654h-48.070579L511.827738 0 512 0.957009l0.181832-0.957009 76.742579 413.102654h-48.070579v337.412785l133.923888-136.105869v-168.050841L741.682243 718.733159l-66.904523 258.698766V823.927626L540.853832 952.090318V1024z' />
            </symbol> */}
            {/* <symbol id='BACK_RIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />
            </symbol> */}
            <symbol id='RIGHT_BACK' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />
            </symbol>
            <symbol id='STRAIGHT_BACK' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M589.302519 0L663.703704 408.187259h-48.57363V1014.518519h-58.624V684.73363l-3.982222 6.893037c-8.590222-39.973926-26.548148-60.472889-53.883259-61.496889l-2.180741-0.047408c-28.558222 0-44.439704 20.517926-47.616 61.534815v62.738963h44.581926L424.106667 1024 360.296296 754.346667h43.434667V614.115556C421.679407 558.677333 452.589037 530.962963 496.459852 530.962963c22.784 0 42.799407 7.471407 60.055704 22.423704l-0.009482-145.199408H512L589.302519 0z' />
            </symbol>
            <symbol id='BACK_STRAIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M589.302519 0L663.703704 408.187259h-48.57363V1014.518519h-58.624V684.73363l-3.982222 6.893037c-8.590222-39.973926-26.548148-60.472889-53.883259-61.496889l-2.180741-0.047408c-28.558222 0-44.439704 20.517926-47.616 61.534815v62.738963h44.581926L424.106667 1024 360.296296 754.346667h43.434667V614.115556C421.679407 558.677333 452.589037 530.962963 496.459852 530.962963c22.784 0 42.799407 7.471407 60.055704 22.423704l-0.009482-145.199408H512L589.302519 0z' />
            </symbol>
            {/* <symbol id='RIGHT_LEFT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 478.505 1024 V 526.547 L 345.337 394.919 v 162.711 L 267.963 290.022 L 345.337 0 v 172.118 L 512 342.485 l 166.663 -170.367 V 0 L 756.037 290.022 l -77.3742 267.609 V 394.919 L 545.495 526.547 V 1024 h -66.9907 Z' />
            </symbol> */}
            <symbol id='LEFT_RIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 478.505 1024 V 526.547 L 345.337 394.919 v 162.711 L 267.963 290.022 L 345.337 0 v 172.118 L 512 342.485 l 166.663 -170.367 V 0 L 756.037 290.022 l -77.3742 267.609 V 394.919 L 545.495 526.547 V 1024 h -66.9907 Z' />
            </symbol>
            <symbol id='GANTRY' viewBox='0 0 1024 1024' version='1.1' width='24' height='24'>
              <path d='M256 159.288889l-130.844444 227.555555 540.444444 312.888889 130.844444-227.555555-540.444444-312.888889z m28.444444-56.888889l540.444445 312.888889c34.133333 17.066667 39.822222 56.888889 22.755555 91.022222l-130.844444 227.555556c-17.066667 34.133333-56.888889 39.822222-91.022222 22.755555L91.022222 443.733333c-34.133333-17.066667-45.511111-56.888889-22.755555-91.022222l130.844444-227.555555c17.066667-34.133333 56.888889-39.822222 85.333333-22.755556z m620.088889 455.111111c11.377778-17.066667 28.444444-22.755556 45.511111-11.377778 17.066667 11.377778 22.755556 28.444444 11.377778 45.511111l-113.777778 193.422223c-11.377778 17.066667-28.444444 22.755556-45.511111 11.377777-17.066667-11.377778-22.755556-28.444444-11.377777-45.511111l113.777777-193.422222zM227.555556 625.777778c11.377778-17.066667 28.444444-22.755556 45.511111-11.377778l290.133333 170.666667c17.066667 11.377778 22.755556 28.444444 11.377778 45.511111-5.688889 17.066667-28.444444 22.755556-39.822222 11.377778l-119.466667-68.266667-96.711111 164.977778H102.4c-17.066667 0-34.133333-17.066667-34.133333-34.133334s17.066667-34.133333 34.133333-34.133333H284.444444L358.4 739.555556l-119.466667-68.266667c-11.377778-5.688889-17.066667-22.755556-11.377777-45.511111z' />
            </symbol>
            <symbol id='CAMERA' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M728.177778 307.2v56.888889h-455.111111v-56.888889h455.111111zM881.777778 227.555556H130.844444v221.866666h750.933334V227.555556z m-375.466667 358.4c39.822222 0 68.266667 28.444444 68.266667 68.266666s-28.444444 68.266667-68.266667 68.266667-68.266667-28.444444-68.266667-68.266667c0-34.133333 28.444444-68.266667 68.266667-68.266666zM796.444444 506.311111H210.488889C210.488889 665.6 341.333333 796.444444 500.622222 796.444444S796.444444 665.6 796.444444 506.311111zM881.777778 170.666667c28.444444 0 56.888889 22.755556 56.888889 56.888889v221.866666c0 28.444444-22.755556 56.888889-56.888889 56.888889H853.333333c0 193.422222-153.6 347.022222-347.022222 347.022222s-347.022222-153.6-347.022222-347.022222h-28.444445c-28.444444 0-56.888889-22.755556-56.888888-56.888889V227.555556c0-28.444444 22.755556-56.888889 56.888888-56.888889h750.933334z' />
            </symbol>
            <symbol id='COIL' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M853.333333 170.666667H170.666667c-34.133333 0-56.888889 22.755556-56.888889 56.888889v568.888888c0 34.133333 22.755556 56.888889 56.888889 56.888889h682.666666c34.133333 0 56.888889-22.755556 56.888889-56.888889V227.555556c0-34.133333-22.755556-56.888889-56.888889-56.888889z m-284.444444 56.888889v56.888888H455.111111V227.555556h113.777778z m170.666667 113.777777v341.333334H284.444444V341.333333h455.111112zM170.666667 227.555556h227.555555v56.888888H267.377778c-22.755556 0-39.822222 17.066667-39.822222 39.822223V398.222222H170.666667V227.555556z m0 227.555555h56.888889v113.777778H170.666667V455.111111z m0 341.333333v-170.666666h56.888889v73.955555c0 22.755556 17.066667 39.822222 39.822222 39.822223H398.222222v56.888888H170.666667z m284.444444 0v-56.888888h113.777778v56.888888H455.111111z m398.222222 0h-227.555555v-56.888888h130.844444c22.755556 0 39.822222-17.066667 39.822222-39.822223V625.777778h56.888889v170.666666z m0-227.555555h-56.888889V455.111111h56.888889v113.777778z m0-170.666667h-56.888889V324.266667c0-22.755556-17.066667-39.822222-39.822222-39.822223H625.777778V227.555556h227.555555v170.666666z' />
            </symbol>
            <symbol id='DEVICE-FOUR' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M517.688889 204.8c39.822222 0 73.955556 22.755556 73.955555 45.511111s-34.133333 45.511111-73.955555 45.511111c-39.822222 0-73.955556-22.755556-73.955556-45.511111s34.133333-45.511111 73.955556-45.511111z m216.177778 91.022222c39.822222 0 73.955556 22.755556 73.955555 45.511111s-34.133333 45.511111-73.955555 45.511111-79.644444-17.066667-79.644445-45.511111 34.133333-45.511111 79.644445-45.511111z m-432.355556 0c39.822222 0 73.955556 22.755556 73.955556 45.511111s-28.444444 45.511111-73.955556 45.511111S227.555556 369.777778 227.555556 341.333333s34.133333-45.511111 73.955555-45.511111z m216.177778 62.577778c39.822222 0 73.955556 22.755556 73.955555 45.511111s-34.133333 45.511111-73.955555 45.511111c-39.822222 0-73.955556-22.755556-73.955556-45.511111s34.133333-45.511111 73.955556-45.511111z m0-182.044444c-216.177778 0-381.155556 79.644444-381.155556 170.666666s170.666667 170.666667 381.155556 170.666667 381.155556-79.644444 381.155555-170.666667-164.977778-170.666667-381.155555-170.666666z m0 398.222222c-159.288889 0-307.2-45.511111-381.155556-113.777778V512c0 85.333333 170.666667 170.666667 381.155556 170.666667 62.577778 0 125.155556-5.688889 176.355555-22.755556 5.688889 0 5.688889-5.688889 11.377778-5.688889 113.777778-28.444444 193.422222-85.333333 193.422222-147.911111V455.111111c-73.955556 73.955556-216.177778 119.466667-381.155555 119.466667z m381.155555 56.888889c-17.066667 17.066667-39.822222 28.444444-62.577777 39.822222v96.711111c39.822222-28.444444 62.577778-56.888889 62.577777-91.022222v-45.511111z m-119.466666 68.266666c-11.377778 5.688889-28.444444 11.377778-39.822222 11.377778v102.4c11.377778-5.688889 28.444444-11.377778 39.822222-17.066667v-96.711111zM136.533333 631.466667v51.2c0 85.333333 170.666667 170.666667 381.155556 170.666666 56.888889 0 113.777778-5.688889 159.288889-17.066666v-108.088889c-51.2 5.688889-102.4 11.377778-159.288889 11.377778-159.288889 0-307.2-39.822222-381.155556-108.088889zM517.688889 113.777778c238.933333 0 438.044444 91.022222 443.733333 221.866666V682.666667c0 68.266667-51.2 125.155556-130.844444 164.977777-5.688889 5.688889-17.066667 11.377778-22.755556 11.377778-79.644444 34.133333-182.044444 51.2-290.133333 51.2-244.622222 0-443.733333-96.711111-443.733333-227.555555V341.333333c0-130.844444 199.111111-227.555556 443.733333-227.555555z' />
            </symbol>
            <symbol id='COMPDETECTOR' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M876.088889 369.777778c17.066667 0 34.133333 17.066667 34.133333 34.133333 0 210.488889-170.666667 375.466667-375.466666 375.466667-17.066667 0-34.133333-17.066667-34.133334-34.133334s17.066667-34.133333 34.133334-34.133333c170.666667 0 307.2-136.533333 307.2-307.2 0-17.066667 17.066667-34.133333 34.133333-34.133333zM290.133333 130.844444c11.377778 0 17.066667 5.688889 22.755556 11.377778l102.4 102.4 68.266667-68.266666c17.066667-11.377778 34.133333-17.066667 45.511111-5.688889l5.688889 5.688889c11.377778 11.377778 11.377778 34.133333 0 51.2L352.711111 409.6c-11.377778 11.377778-34.133333 11.377778-51.2 0-11.377778-11.377778-11.377778-34.133333 0-51.2l68.266667-68.266667-91.022222-91.022222H199.111111v642.844445h182.044445c17.066667 0 34.133333 17.066667 34.133333 34.133333s-17.066667 34.133333-34.133333 34.133333H164.977778c-17.066667 0-34.133333-17.066667-34.133334-34.133333V164.977778c0-17.066667 17.066667-34.133333 34.133334-34.133334h125.155555z M739.555556 335.644444c17.066667 0 34.133333 17.066667 34.133333 34.133334 0 153.6-125.155556 273.066667-273.066667 273.066666-17.066667 0-34.133333-17.066667-34.133333-34.133333s17.066667-34.133333 34.133333-34.133333c113.777778 0 204.8-91.022222 204.8-204.8 0-17.066667 11.377778-34.133333 34.133334-34.133334z M603.022222 301.511111c17.066667 0 34.133333 17.066667 34.133334 34.133333 0 96.711111-79.644444 170.666667-170.666667 170.666667-17.066667 0-34.133333-17.066667-34.133333-34.133333s17.066667-34.133333 34.133333-34.133334c56.888889 0 102.4-45.511111 102.4-102.4v-5.688888c0-11.377778 17.066667-28.444444 34.133333-28.444445z' />
            </symbol>
            <symbol id='RADAR' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M256 347.022222c11.377778-5.688889 28.444444-5.688889 39.822222 0 11.377778 11.377778 11.377778 28.444444 0 39.822222C227.555556 455.111111 227.555556 563.2 295.822222 631.466667c11.377778 11.377778 11.377778 28.444444 0 39.822222-11.377778 11.377778-28.444444 11.377778-39.822222 0-91.022222-91.022222-91.022222-233.244444 0-324.266667z m483.555556 0c11.377778-11.377778 28.444444-11.377778 39.822222 0 91.022222 91.022222 91.022222 233.244444 0 324.266667-11.377778 11.377778-28.444444 11.377778-39.822222 0-11.377778-11.377778-11.377778-28.444444 0-39.822222 68.266667-68.266667 68.266667-176.355556 0-238.933334-11.377778-11.377778-11.377778-34.133333 0-45.511111zM620.088889 284.444444H420.977778v398.222223h199.111111V284.444444z m0-56.888888c34.133333 0 56.888889 22.755556 56.888889 56.888888v398.222223c0 34.133333-22.755556 56.888889-56.888889 56.888889H420.977778c-34.133333 0-56.888889-22.755556-56.888889-56.888889V284.444444c0-34.133333 22.755556-56.888889 56.888889-56.888888h199.111111zM176.355556 290.133333c5.688889-5.688889 28.444444-5.688889 39.822222 0 11.377778 11.377778 11.377778 34.133333 0 45.511111-102.4 96.711111-102.4 261.688889 0 358.4 11.377778 11.377778 11.377778 28.444444 0 39.822223-11.377778 11.377778-28.444444 11.377778-39.822222 0-125.155556-119.466667-125.155556-318.577778 0-443.733334z m654.222222 0c11.377778-11.377778 28.444444-11.377778 39.822222 0 119.466667 119.466667 119.466667 318.577778 0 443.733334-11.377778 11.377778-28.444444 11.377778-39.822222 0-11.377778-11.377778-11.377778-28.444444 0-39.822223 102.4-102.4 102.4-261.688889 0-364.088888-11.377778-5.688889-11.377778-28.444444 0-39.822223zM620.088889 796.444444c17.066667 0 28.444444 11.377778 28.444444 28.444445s-17.066667 28.444444-28.444444 28.444444H415.288889c-17.066667 0-28.444444-11.377778-28.444445-28.444444s11.377778-28.444444 28.444445-28.444445h204.8z' />
            </symbol>
            <symbol id='DEVEICE-BACKGROUND' width='60' height='60' viewBox='0 0 1024 1024'>
              <path d='M 0 0 L 480 0 L 480 480 L 0 480 L 0 0' />
            </symbol>
            <symbol id='CENTER-LIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path fill='#ffffff' d='M 773.689 273.067 H 267.378 c -108.089 0 -199.111 91.0222 -199.111 199.111 s 91.0222 199.111 199.111 199.111 h 506.311 c 108.089 0 199.111 -91.0222 199.111 -199.111 s -91.0222 -199.111 -199.111 -199.111 Z M 256 568.889 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 s 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z m 273.067 0 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 s 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z m 261.689 0 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 c 51.2 0 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z' />
            </symbol>
            <symbol viewBox='0 0 1024 1024' id='DELETE-DEVICES' width='16' height='16'>
              <path d='M61.44 382.016v-128h896v128zM541.44 382.016h128v448h-128z' fill='#737373' />
              <path d='M285.44 382.016v448h448v-448h-448z m-128-128h704v704h-704v-704z' fill='#737373' />
              <path d='M349.44 382.016h128v448h-128zM381.44 254.016h256v-64h-256v64z m384-192v320h-512v-320h512z' fill='#737373' />
            </symbol>
            <symbol id='BACKGROUNDRECT' viewBox='0 0 1024 1024' width='40' height='40'>
              <path d='M 0 0 L 480 0 L 480 480 L 0 480 L 0 0' />
            </symbol>
            <symbol id='LOGO' width='75px' height='14px' viewBox='0 0 75 14'>
              <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g transform='translate(-2435.000000, -663.000000)'>
                  <g transform='translate(2435.000000, 663.000000)'>
                    <rect fill='#B0B0B0' fillRule='evenodd' x='0' y='0' width='75' height='14' rx='2' />
                    <path d='M2,1 L13,1 L13,1 L13,13 L2,13 C1.44771525,13 1,12.5522847 1,12 L1,2 C1,1.44771525 1.44771525,1 2,1 Z' fill='#FFFFFF' fillRule='evenodd' />
                    <polygon fillOpacity='0.2' fill='#545454' fillRule='evenodd' points='12 2 12 12 2 12' />
                    <polygon fillOpacity='0.2' fill='#545454' fillRule='evenodd' transform='translate(7.000000, 7.000000) scale(-1, 1) translate(-7.000000, -7.000000) ' points='12 2 12 12 2 12' />
                    <text fontFamily='Helvetica' fontSize='10' fontWeight='normal' fill='#FFFFFF'>
                      <tspan x='16' y='11'>D3TRAFFIC</tspan>
                    </text>
                  </g>
                </g>
              </g>
            </symbol>
            <symbol viewBox='0 0 1024 1024' id='EDITED-BTN' width='24' height='16'>
              <circle fill='rgba(216, 216, 216, 0.1)' cx='480' cy='480' r='240' />
              <path d='M 240 40 L 240 440 M 40 240 L 440 240' name='editedAddDirection' stroke='rgba(216, 216, 216, 0.8)' fill='rgba(216, 216, 216, 0.8)' cursor='pointer' />
            </symbol>
          </g>
          <g className='svg-pan-zoom_viewport'>
            <g id='cb-aspects-draw'>
              <g id='cb-aspects-group' />
              <g id='cb-aspects-turn-directions' />
              <g id='cb-aspects-edited' />
              <g id='cb-aspects-dircections' />
              <g id='cb-aspects-dircections-bg' />
              <g id='cb-aspects-devices-bg' />
              <g id='cb-aspects-devices' />
              {/* 待行区 */}
              <g id='cb-aspects-wait-area' />
              <g id='cb-aspects-road-name' />
            </g>
                      {/* 增删车道按钮 */}
            {addBtnBool && this.addRoadBtnPlugin()} 
            {
              showLight &&
                <InnerCenterLight
                  coordinate={{ x: w * x + left - 25, y: h * y + top - 25 }}
                  isEdited={isEdited}
                  isSelect={isSelect}
                  handleSelected={(e) => {
                    this.setState({
                      isSelect: true
                    })
                    this.props.centerCallback(false, true)
                  }}
                  handleEditCenterBtn={(e) => {
                    this.setState({
                      isEdited: false
                    })
                    this.props.centerCallback(false, isSelect)
                  }}
                />
            }
            {
              showAddModal &&
                <InnerAddDevice
                  deviceClick={(e) => {
                    this.deviceClick(e)
                  }}
                  editRoadParams={editRoadParams}
                  showModals={showAddModal}
                  modalCoordinate={modalCoordinate}
                />
            }
            {
              showAddDirectionsModal &&
                <InnerAddDirections
                  handleSelectDirection={(e) => {
                    this.handleSelectDirectionClick(e)
                  }}
                  checked={checked}
                  areaLength={areaLength}
                  editRoadParams={editRoadParams}
                  showModals={showAddDirectionsModal}
                  closeAddDirectionsModal={this.closeAddDirectionsModal}
                  modalCoordinate={modalCoordinate}
                  handleWaitingArea={this.handleWaitingArea}
                />
            }
            {showTip && this.showTipFunc()}
            {/* 插件 */}
            {this.receivePlugin()}
          </g>
          <svg className='icon icon-logo' style={{ width: 75, height: 14 }} aria-hidden='true'>
            <use xlinkHref='#LOGO' transform={`translate(${w - 100} ${h - 30})`} />
          </svg>
        </svg>
      </div>
    )
  }

  closeAddDirectionsModal = ()=>{
    this.setState({showAddDirectionsModal: false})
  }

  showTipFunc () {
    // 展示tip显示内容 tipWords提示的内容
    const { tipWords, tipCoordinate: { x, y } } = this.state

    return (
      <foreignObject id='tip-msg' x={x - 50} y={y - 50} width={100} height={20}>
        <div className='tip-word'>{tipWords}</div>
      </foreignObject>
    )
  }
  initSvgPanZoom = () => {
    const { zoomEnabled, defaultZoom } = this.props
    this.svgPanZoom = svgPanZoom('#cb-aspects-svg', {
      viewportSelector: '.svg-pan-zoom_viewport',
      panEnabled: true,
      zoomEnabled: zoomEnabled,
      minZoom: 0.5,
      maxZoom: 2,
      onZoom: this.handleChangeZoom
    })
    if (defaultZoom !== 1) {
      this.svgPanZoom.zoomBy(defaultZoom)
    }
  }

  handleChangeZoom = () => {
    const { changeZoom } = this.props
    if (changeZoom && this.svgPanZoom) {
      const zoom = this.svgPanZoom.getZoom()
      this.props.changeZoom(zoom)
    }
  }

  componentWillUnmount () {
    // 组件卸载， 同时也卸载 svgPanZoom 插件
    this.svgPanZoom.destroy()
  }

  componentDidMount () {
    const { data: propData, background, contentScale } = this.props
    const { w, h } = this.state
    const aspectData = propData || mock
    const width = document.getElementById('cb-aspects-container') ? document.getElementById('cb-aspects-container').offsetWidth : w
    const height = document.getElementById('cb-aspects-container') ? document.getElementById('cb-aspects-container').offsetHeight : h
    const { data, svg, coord } = this.drawSVG(aspectData, width, height)
    const originData = originDataInfos(aspectData)
    const streetInfos = caclStreetInfos(aspectData, width)
    this.initSvgPanZoom()
    this.setState({
      ...this.initialState,
      background,
      originData,
      data,
      center: aspectData.center,
      contentScale,
      svg,
      coord,
      showRoadName: propData.showRoadName,
      showWaitingArea: propData.showWaitingArea,
      isEdit: propData.isEdit,
      isEditOut: propData.isEditOut,
      isDrawLaneDividers: propData.isDrawLaneDividers,
      prevModalWidth: propData.prevModalWidth,
      w: width,
      h: height,
      isTurnDirections: propData.isTurnDirections,
      isEdited: propData.showCenterLight,
      isSelect: propData.centerColor,
      streetInfos
    }, this.allFunc)
  }

  turnDirections () {
    const { streetInfos, coord } = this.state
    streetInfos.forEach((items, laneIndex) => {
      const { angle, laneWidth, queueIns } = items
      const { start, end, ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(laneIndex)
      const insStartPoint = coord.math2svg(splitPoint(inflectionStart, inflectionEnd, outs / (ins.length + outs)))
      const insStartPoint1 = coord.math2svg(splitPoint(start, end, outs / (ins.length + outs)))
      const insEnd = coord.math2svg(inflectionEnd)
      const insEnd1 = coord.math2svg(end)
      const filtersIns = queueIns.filter(items => items.choose)
      filtersIns.forEach((obj, insIndex) => {
        const trid = obj.trid
        const tridObj = streetInfos.find(item => item.reverseRids && Object.keys(item.reverseRids).indexOf(trid) > -1)
        if (!tridObj) return
        const { start: nextStart, end: nextEnd, ins: nextIns, outs: nextOuts, inflectionStart: nextInflectionStart, inflectionEnd: nextInflectionEnd, angle: nextAngle } = this.concatCurPrePoint(tridObj.tabs)
        const nextInsStartPoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, nextOuts * 0.5 / (nextIns.length + nextOuts)))
        const nextInsStartPoint1 = coord.math2svg(splitPoint(nextStart, nextEnd, nextOuts * 0.5 / (nextIns.length + nextOuts)))
        const inflectionLen = pointLenth(nextInflectionStart, nextInflectionEnd)
        const inflectionSingleLen = nextIns.length + nextOuts === 0 ? laneWidth : inflectionLen / (nextIns.length + nextOuts)
        const laneLen = pointLenth(nextInsStartPoint1, nextInsStartPoint)
        // const laneWidthLen = 50 / inflectionLen
        // const laneWidthPoint = 20 / inflectionLen

        const laneWidthLen = 10
        const laneWidthPoint = 4

        const angleTip = splitPoint(nextInsStartPoint1, nextInsStartPoint, (laneLen - 20) / laneLen)
        const angleLeft = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 + laneWidthLen) / inflectionLen))
        const angleRight = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 - laneWidthLen) / inflectionLen))

        const angleLeftPoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 + laneWidthPoint) / inflectionLen))
        const angleRightPoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 - laneWidthPoint) / inflectionLen))

        let curStartPoint = {}
        let curEndPoint = {}
        let d = ''
        if (obj.turnDur === 4 || tridObj.tabs === laneIndex) {
          const backWidth = 30 / pointLenth(nextInflectionStart, nextInflectionEnd)
          const angleLeftPointBack = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (nextOuts * 0.5 + backWidth) / (nextIns.length + nextOuts)))
          const angleRightPointBack = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (nextOuts * 0.5) / (nextIns.length + nextOuts)))

          const angleLeftPointBack1 = coord.math2svg(splitPoint(nextStart, nextEnd, (nextOuts * 0.5 + backWidth) / (nextIns.length + nextOuts)))
          const angleRightPointBack1 = coord.math2svg(splitPoint(nextStart, nextEnd, (nextOuts * 0.5) / (nextIns.length + nextOuts)))
          curStartPoint = splitPoint(angleLeftPointBack1, angleLeftPointBack, 1.1)
          curEndPoint = splitPoint(angleRightPointBack1, angleRightPointBack, 1.13)
        } else if (obj.turnDur === 2 || (Math.abs(angle.from - nextAngle.from) >= 160 && Math.abs(angle.from - nextAngle.from) <= 200)) {
          const startAngleLeftPoint = splitPoint(insStartPoint, insEnd, (pointLenth(insStartPoint, insEnd) * 0.5 - 10) / pointLenth(insStartPoint, insEnd))
          const endAngleRightPoint = splitPoint(insEnd, insStartPoint, (pointLenth(insStartPoint, insEnd) * 0.5 - 10) / pointLenth(insStartPoint, insEnd))
          curStartPoint = splitPoint(startAngleLeftPoint, angleLeftPoint, 0.5)
          curEndPoint = splitPoint(endAngleRightPoint, angleRightPoint, 0.5)
        } else if (obj.turnDur === 1) {
          const splitLinePoint = coord.math2svg(splitPoint(nextStart, nextEnd, nextOuts / (nextIns.length + nextOuts)))
          const splitSafeLinePoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, nextOuts / (nextIns.length + nextOuts)))

          let jointX = 0
          let jointY = 0
          if (pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            const { k: k2, b: b2 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = (b2 - b1) / (k1 - k2)
            jointY = (b1 * k2 - b2 * k1) / (k2 - k1)
          } else if (!pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = insStartPoint.x
            jointY = k1 * insStartPoint.x + b1
          } else if (pointOblique(insStartPoint, insStartPoint1, angle.from) && !pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            jointX = insStartPoint.x
            jointY = k1 * splitLinePoint.x + b1
          }
          curStartPoint = { x: jointX, y: jointY }
          curEndPoint = splitPoint(splitSafeLinePoint, curStartPoint, 1.1)
        } else if (obj.turnDur === 3) {
          const splitLinePoint = coord.math2svg(splitPoint(nextStart, nextEnd, nextOuts / (nextIns.length + nextOuts)))
          const splitSafeLinePoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, nextOuts / (nextIns.length + nextOuts)))

          let jointX = 0
          let jointY = 0
          if (pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            const { k: k2, b: b2 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = (b2 - b1) / (k1 - k2)
            jointY = (b1 * k2 - b2 * k1) / (k2 - k1)
          } else if (!pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = insStartPoint.x
            jointY = k1 * insStartPoint.x + b1
          } else if (pointOblique(insStartPoint, insStartPoint1, angle.from) && !pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            jointX = insStartPoint.x
            jointY = k1 * splitLinePoint.x + b1
          }
          // d = `M ${insEnd1.x} ${insEnd1.y} L ${jointX} ${jointY} L ${splitSafeLinePoint.x} ${splitSafeLinePoint.y}`
          curEndPoint = { x: jointX, y: jointY }
          curStartPoint = splitPoint(splitSafeLinePoint, curEndPoint, 1.1)
          // curEndPoint = { x: jointX, y: jointY }
        }
        d = `M ${insStartPoint1.x} ${insStartPoint1.y} L ${insStartPoint.x} ${insStartPoint.y} Q 
          ${curStartPoint.x} ${curStartPoint.y} ${angleLeftPoint.x} ${angleLeftPoint.y} L ${angleLeft.x} ${angleLeft.y} L
          ${angleTip.x} ${angleTip.y} L
          ${angleRight.x} ${angleRight.y} L ${angleRightPoint.x} ${angleRightPoint.y} Q
          ${curEndPoint.x} ${curEndPoint.y} ${insEnd.x} ${insEnd.y} L ${insEnd1.x} ${insEnd1.y} L
          ${insStartPoint1.x} ${insStartPoint1.y}`
        d3.select('#cb-aspects-turn-directions')
          .append('path')
          .attr('fill-opacity', '0.5')
          // .attr('fill', 'none')
          // .attr('stroke', 'red')
          .attr('fill', `url(#Gradient${trid},${obj.frid})`)
          .attr('d', d)
      })
    })
  }

  turnDirections1 () {
    const { selectTableLaneRows } = this.props
    const { streetInfos, coord } = this.state
    if (selectTableLaneRows.length === 0) return
    streetInfos.forEach((items, laneIndex) => {
      const { angle, laneWidth, queueIns } = items
      const { start, end, ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(laneIndex)
      const filtersIns = queueIns.filter(items => items.choose)
      filtersIns.forEach((obj, insIndex) => {
        const insMsg = selectTableLaneRows.find(o => o.frid === obj.frid)
        if (!insMsg) return
        const insMsgIndex = obj.laneIds.split(';').indexOf(insMsg.laneId)
        const insStartPoint = coord.math2svg(splitPoint(inflectionStart, inflectionEnd, (outs + insMsgIndex) / (ins.length + outs)))
        const insStartPoint1 = coord.math2svg(splitPoint(start, end, (outs + insMsgIndex) / (ins.length + outs)))
        const insEnd = coord.math2svg(splitPoint(inflectionStart, inflectionEnd, (outs + insMsgIndex + 1) / (ins.length + outs)))
        const insEnd1 = coord.math2svg(splitPoint(start, end, (outs + insMsgIndex + 1) / (ins.length + outs)))
        const trid = obj.trid
        const tridObj = streetInfos.find(item => item.reverseRids && Object.keys(item.reverseRids).indexOf(trid) > -1)
        if (!tridObj) return
        const { start: nextStart, end: nextEnd, ins: nextIns, outs: nextOuts, inflectionStart: nextInflectionStart, inflectionEnd: nextInflectionEnd, angle: nextAngle } = this.concatCurPrePoint(tridObj.tabs)
        const nextInsStartPoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, nextOuts * 0.5 / (nextIns.length + nextOuts)))
        const nextInsStartPoint1 = coord.math2svg(splitPoint(nextStart, nextEnd, nextOuts * 0.5 / (nextIns.length + nextOuts)))
        const inflectionLen = pointLenth(nextInflectionStart, nextInflectionEnd)
        const inflectionSingleLen = nextIns.length + nextOuts === 0 ? laneWidth : inflectionLen / (nextIns.length + nextOuts)
        const laneLen = pointLenth(nextInsStartPoint1, nextInsStartPoint)

        const laneWidthLen = 10
        const laneWidthPoint = 4

        const angleTip = splitPoint(nextInsStartPoint1, nextInsStartPoint, (laneLen - 20) / laneLen)
        const angleLeft = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 + laneWidthLen) / inflectionLen))
        const angleRight = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 - laneWidthLen) / inflectionLen))

        const angleLeftPoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 + laneWidthPoint) / inflectionLen))
        const angleRightPoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (inflectionSingleLen * nextOuts * 0.5 - laneWidthPoint) / inflectionLen))

        let curStartPoint = {}
        let curEndPoint = {}
        let d = ''
        if (obj.turnDur === 4 || tridObj.tabs === laneIndex) {
          const backWidth = 30 / pointLenth(nextInflectionStart, nextInflectionEnd)
          const angleLeftPointBack = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (nextOuts * 0.5 + backWidth) / (nextIns.length + nextOuts)))
          const angleRightPointBack = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, (nextOuts * 0.5) / (nextIns.length + nextOuts)))

          const angleLeftPointBack1 = coord.math2svg(splitPoint(nextStart, nextEnd, (nextOuts * 0.5 + backWidth) / (nextIns.length + nextOuts)))
          const angleRightPointBack1 = coord.math2svg(splitPoint(nextStart, nextEnd, (nextOuts * 0.5) / (nextIns.length + nextOuts)))
          curStartPoint = splitPoint(angleLeftPointBack1, angleLeftPointBack, 1.1)
          curEndPoint = splitPoint(angleRightPointBack1, angleRightPointBack, 1.13)
        } else if (obj.turnDur === 2 || (Math.abs(angle.from - nextAngle.from) >= 160 && Math.abs(angle.from - nextAngle.from) <= 200)) {
          const startAngleLeftPoint = splitPoint(insStartPoint, insEnd, (pointLenth(insStartPoint, insEnd) * 0.5 - 10) / pointLenth(insStartPoint, insEnd))
          const endAngleRightPoint = splitPoint(insEnd, insStartPoint, (pointLenth(insStartPoint, insEnd) * 0.5 - 10) / pointLenth(insStartPoint, insEnd))
          curStartPoint = splitPoint(startAngleLeftPoint, angleLeftPoint, 0.5)
          curEndPoint = splitPoint(endAngleRightPoint, angleRightPoint, 0.5)
        } else if (obj.turnDur === 1) {
          const splitLinePoint = coord.math2svg(splitPoint(nextStart, nextEnd, nextOuts / (nextIns.length + nextOuts)))
          const splitSafeLinePoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, nextOuts / (nextIns.length + nextOuts)))

          let jointX = 0
          let jointY = 0
          if (pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            const { k: k2, b: b2 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = (b2 - b1) / (k1 - k2)
            jointY = (b1 * k2 - b2 * k1) / (k2 - k1)
          } else if (!pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = insStartPoint.x
            jointY = k1 * insStartPoint.x + b1
          } else if (pointOblique(insStartPoint, insStartPoint1, angle.from) && !pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            jointX = insStartPoint.x
            jointY = k1 * splitLinePoint.x + b1
          }
          curStartPoint = { x: jointX, y: jointY }
          curEndPoint = splitPoint(splitSafeLinePoint, curStartPoint, 1.1)
        } else if (obj.turnDur === 3) {
          const splitLinePoint = coord.math2svg(splitPoint(nextStart, nextEnd, nextOuts / (nextIns.length + nextOuts)))
          const splitSafeLinePoint = coord.math2svg(splitPoint(nextInflectionStart, nextInflectionEnd, nextOuts / (nextIns.length + nextOuts)))

          let jointX = 0
          let jointY = 0
          if (pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            const { k: k2, b: b2 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = (b2 - b1) / (k1 - k2)
            jointY = (b1 * k2 - b2 * k1) / (k2 - k1)
          } else if (!pointOblique(insStartPoint, insStartPoint1, angle.from) && pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)
            jointX = insStartPoint.x
            jointY = k1 * insStartPoint.x + b1
          } else if (pointOblique(insStartPoint, insStartPoint1, angle.from) && !pointOblique(splitLinePoint, splitSafeLinePoint, tridObj.angle.from)) {
            const { k: k1, b: b1 } = pointOblique(insStartPoint, insStartPoint1, angle.from)
            jointX = insStartPoint.x
            jointY = k1 * splitLinePoint.x + b1
          }
          // d = `M ${insEnd1.x} ${insEnd1.y} L ${jointX} ${jointY} L ${splitSafeLinePoint.x} ${splitSafeLinePoint.y}`
          curEndPoint = { x: jointX, y: jointY }
          curStartPoint = splitPoint(splitSafeLinePoint, curEndPoint, 1.1)
          // curEndPoint = { x: jointX, y: jointY }
        }
        d = `M ${insStartPoint1.x} ${insStartPoint1.y} L ${insStartPoint.x} ${insStartPoint.y} Q 
          ${curStartPoint.x} ${curStartPoint.y} ${angleLeftPoint.x} ${angleLeftPoint.y} L ${angleLeft.x} ${angleLeft.y} L
          ${angleTip.x} ${angleTip.y} L
          ${angleRight.x} ${angleRight.y} L ${angleRightPoint.x} ${angleRightPoint.y} Q
          ${curEndPoint.x} ${curEndPoint.y} ${insEnd.x} ${insEnd.y} L ${insEnd1.x} ${insEnd1.y} L
          ${insStartPoint1.x} ${insStartPoint1.y}`
        const insterDisrection = {
          1: 'LEFT',
          2: 'STRAIGHT',
          3: 'RIGHT',
          4: 'BACK'
        }
        d3.select('#cb-aspects-turn-directions')
          .append('path')
          .attr('fill-opacity', '0.5')
          // .attr('fill', 'none')
          // .attr('stroke', 'red')
          .attr('fill', `${this.props.colorData.length > 0 ? `url(#GradientLane${insterDisrection[obj.turnDur]},${obj.frid})` : '#388544'}`)
          .attr('d', d)
      })
    })
  }

  handleWaitingArea = (checked, areaLength, choose = false)=>{
    const { editRoadParams, streetInfos } = this.state
    const [infoIndex, insIndex, deviceIndex] = editRoadParams.split('_')
    
    const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
    const callTab = changeStreetInfo[infoIndex].ins[insIndex].tabs

    // console.log('changeStreetInfo',changeStreetInfo)
    changeStreetInfo[infoIndex].ins[insIndex].showWaitingArea = checked;
    changeStreetInfo[infoIndex].ins[insIndex].areaLength = areaLength;

    this.setState({
      streetInfos: changeStreetInfo,
      showAddDirectionsModal: !choose,
      areaLength
    }, () => {
      this.allFunc()
    })
    this.originDataCallBack({ option: checked ? 'add' : 'delete', content: 'waiting-area' }, changeStreetInfo, callTab)
  }

  handleSelectDirectionClick (e) {
    const { editRoadParams, streetInfos } = this.state
    // console.log('e----->', e)
    let callbackType = '' // 操作类型 'delete', 'add', 'modify' // 删除， 增加， 修改
    let index = ''
    const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
    const [infoIndex, insIndex, deviceIndex] = editRoadParams.split('_')
    const callTab = changeStreetInfo[infoIndex].ins[insIndex].tabs
    const insTab = changeStreetInfo[infoIndex].ins[insIndex].insTab
    if (!deviceIndex) {
      callbackType = 'add'
      index = `${callTab}_${insTab}_${e}`
      changeStreetInfo[infoIndex].ins[insIndex].directions = [e]
    } else if (e === 'DELETE') {
      callbackType = 'delete'
      index = `${callTab}_${insTab}_${e}`
      changeStreetInfo[infoIndex].ins[insIndex].directions = []
    } else {
      callbackType = 'modify'
      index = `${callTab}_${insTab}_${e}`
      changeStreetInfo[infoIndex].ins[insIndex].directions = [e]
    }
    this.setState({
      streetInfos: changeStreetInfo,
      showAddDirectionsModal: false
    }, () => {
      this.allFunc()
    })
    this.originDataCallBack({ option: callbackType, content: 'directions', index }, changeStreetInfo, callTab, e.split('_'))
  }
  
  addLaneOption (index, option) { // 增加或删除车道按钮的点击事件
    const { streetInfos, w } = this.state
    const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
    const { ins, outs, out } = changeStreetInfo[index]
    let resizePointInfo = ''
    if (option === 'insDelete') { // 减少进口道
      changeStreetInfo[index].ins.splice(0, 1)
      resizePointInfo = reSizeWidthInfo(changeStreetInfo, w)
    } else if (option === 'insAdd') { // 增加进口道
      ins.splice(0, 0, {
        directions: [],
        device: [],
        tabs: changeStreetInfo[index].tabs,
        rid: changeStreetInfo[index].ins.length > 0 ? changeStreetInfo[index].ins[0].rid : 0
      })
      resizePointInfo = reSizeWidthInfo(changeStreetInfo, w)
    } else if (option === 'outDelete') { // 减少出口道
      typeof changeStreetInfo[index].out === 'object' && changeStreetInfo[index].out.splice(0, 1)
      changeStreetInfo[index].outs = outs - 1 >= 0 ? outs - 1 : 0
      resizePointInfo = reSizeWidthInfo(changeStreetInfo, w)
    } else { // 增加出口道
      out && out.splice(0, 0, {
        tabs: changeStreetInfo[index].tabs,
        rid: changeStreetInfo[index].out.length > 0 ? changeStreetInfo[index].out[0].rid : 0
      })
      changeStreetInfo[index].outs = outs + 1
      resizePointInfo = reSizeWidthInfo(changeStreetInfo, w)
    }

    this.setState({
      streetInfos: resizePointInfo
    }, () => {
      this.allFunc()
      this.originDataCallBack({ option: option, content: 'lanebtn', index: changeStreetInfo[index].tabs }, resizePointInfo, changeStreetInfo[index].tabs)
    })
  }

  originDataCallBack (params, resizePointInfo, callTab) {
    const { originData } = this.state // 没有经过处理的props传入的元数据
    const streetsClone = JSON.parse(JSON.stringify(originData))
    // 遍历元数据 找到合并的进口道和出口道进行重新赋值使得他们在原来车道的数目进行变化
    originData.forEach((items, index) => {
      const goalData = resizePointInfo[callTab]
      if (goalData && index === callTab) {
        streetsClone[callTab].ins = goalData.ins.filter(item => item.tabs === callTab)
        streetsClone[callTab].outs = goalData.outs
      }
    })
    // 组件的回调函数  options操作内容， 操作元素， 操作的下标lane, ins, deviceIndex， 重组之后的元数据
    this.props.optionFunc(params.option, params.content, params.index, streetsClone)
  }


  deviceClick (e) {
    const { editRoadParams, streetInfos } = this.state
    let callbackType = '' // 操作类型 'delete', 'add', 'modify' // 删除， 增加， 修改
    let index = ''
    const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
    const [infoIndex, insIndex, deviceIndex] = editRoadParams.split('_')
    const callTab = changeStreetInfo[infoIndex].ins[insIndex].tabs
    const insTab = changeStreetInfo[infoIndex].ins[insIndex].insTab
    if (e === 'DELETE-DEVICES') {
      changeStreetInfo[infoIndex].ins[insIndex].device.splice(deviceIndex, 1)
      index = `${callTab}_${insTab}_${deviceIndex}`
      callbackType = 'delete'
    } else if (!deviceIndex) {
      callbackType = 'add'
      index = `${callTab}_${insTab}_${changeStreetInfo[infoIndex].ins[insIndex].device.length}`
      changeStreetInfo[infoIndex].ins[insIndex].device.push({
        type: e
      })
    } else {
      callbackType = 'modify'
      index = `${callTab}_${insTab}_${deviceIndex}`
      changeStreetInfo[infoIndex].ins[insIndex].device[deviceIndex].type = e
    }
    this.setState({
      streetInfos: changeStreetInfo
    }, () => {
      this.allFunc()
    })
    this.originDataCallBack({ option: callbackType, content: 'device', index }, changeStreetInfo, callTab)
  }

  componentDidUpdate (prevProps) {
    const { data: propData, background, contentScale, width, height, isEdit, isEditOut, changeLaneMsg, selectTableLaneRows } = this.props
    const { center, top, left } = this.state
    if (selectTableLaneRows !== prevProps.selectTableLaneRows || propData !== prevProps.data || prevProps.width !== width || prevProps.height !== height || prevProps.contentScale.x !== contentScale.x || prevProps.contentScale.y !== contentScale.y || isEdit !== prevProps.isEdit || isEditOut !== prevProps.isEditOut || changeLaneMsg !== prevProps.changeLaneMsg) {
      const w = document.getElementById('cb-aspects-container') ? document.getElementById('cb-aspects-container').offsetWidth : parseInt(width)
      const h = document.getElementById('cb-aspects-container') ? document.getElementById('cb-aspects-container').offsetHeight : parseInt(height)
      const aspectData = propData || mock
      const { data, svg } = this.drawSVG(aspectData, w, h)
      const { x, y } = center
      const coord = new SVGCoord({ x: 0, y: 0 }, { x: x * w + left, y: y * h + top })
      const originData = originDataInfos(aspectData)
      const streetInfos = caclStreetInfos(aspectData, w)
      this.setState({
        ...this.initialState,
        showAddModal: this.state.showAddModal,
        showAddDirectionsModal: this.state.showAddDirectionsModal,
        modalCoordinate: this.state.modalCoordinate,
        editRoadParams: this.state.editRoadParams,
        background,
        data,
        svg,
        coord,
        w,
        h,
        contentScale,
        center,
        top,
        left,
        originData,
        isEdit: propData.isEdit,
        isEditOut: propData.isEditOut,
        isDrawLaneDividers: propData.isDrawLaneDividers,
        streetInfos,
        isTurnDirections: propData.isTurnDirections,
        showRoadName: propData.showRoadName,
        showWaitingArea: propData.showWaitingArea,
        isEdited: propData.showCenterLight,
        isSelect: propData.centerColor
      }, this.allFunc)
    }
  }

  clearAllSvg () {
    d3.select('#cb-aspects-edited').selectAll('*').remove()
    d3.select('#cb-aspects-group').selectAll('*').remove()
    d3.select('#cb-aspects-road-name').selectAll('*').remove()
    d3.select('#cb-aspects-dircections').selectAll('*').remove()
    d3.select('#cb-aspects-dircections-bg').selectAll('*').remove()
    d3.select('#cb-aspects-devices').selectAll('*').remove()
    d3.select('#cb-aspects-wait-area').selectAll('*').remove()
    d3.select('#cb-aspects-devices-bg').selectAll('*').remove()
    d3.select('#cb-aspects-turn-directions').selectAll('*').remove()
  }

  guidesPointsData () {
    const { coord, streetInfos } = this.state
    const guidesPoints = streetInfos.reduce((p, c, i, a) => {
      const laneIndex = i
      const { ins, outs, angle, width, inflectionStart, inflectionEnd } = this.concatCurPrePoint(i)
      const { tabs, laneWidth, turnNo } = c
      const laneNum = ins.length + outs
      if (laneNum === 0) {
        return [
          ...p
        ]
      }
      const index = i
      const { x: xCurveStart, y: yCurveStart } = coord.math2svg(inflectionStart)
      const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(inflectionEnd)
      const stopPoints = segmentDividePoints({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, laneNum * 2)
      const laneMidPoints = stopPoints.reduce((p, c, i) => {
        let result
        if (i % 2 !== 0) {
          result = p
        } else {
          const laneIdx = Math.floor(i / 2)
          const isOut = laneIdx < outs
          const insIdx = laneIdx - outs
          const { directions } = insIdx >= 0 ? ins[insIdx] : { directions: [] }
          const editDirectionColor = insIdx >= 0 ? ins[insIdx].editDirectionColor : '#FF9000'
          const chooseDirection = insIdx >= 0 ? ins[insIdx].chooseDirection : false
          result = [...p, { ...c, turnNo, angle, isOut, directions, index, insIdx, inflectionStart, inflectionEnd, laneWidth, width, ins, outs, laneIdx, tabs, laneIndex, editDirectionColor, chooseDirection }]
        }
        return result
      }, [])
      return [
        ...p,
        ...laneMidPoints
      ]
    }, [])
    return guidesPoints
  }

  drawDevicePlugin () {
    const { streetInfos, coord } = this.state
    streetInfos.forEach((items, laneIndex) => {
      const { turnNo, angle } = items
      const { inflectionStart, inflectionEnd } = this.concatCurPrePoint(laneIndex)
      if (items.ins.length > 0) {
        items.ins.forEach((item, insIndex) => {
          const newJg = 82
          const activeReviceInsIndex = items.ins.length - 1 - insIndex
          if (!item.device) return
          if (item.device.length > 0) {
            item.device.forEach((obj, deviceIndex) => {
              const fillColor = obj.deviceColor ? '#ee4e4e' : '#1B98FF'
              const devicesAngle = obj.type === 'GANTRY' ? angle.from + 180 : angle.from
              const deviceWidth = obj.type === 'GANTRY' ? 20 : 23
              const deviceHeight = obj.type === 'GANTRY' ? 20 : 23
              const deviceGap = obj.type === 'GANTRY' ? 26 : 30
              const deviceMiddleScale = obj.type === 'GANTRY' ? 0.5 : 0.4
              const bgLines = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, (activeReviceInsIndex + 0.5) / turnNo))
              const centerLines = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, (activeReviceInsIndex + deviceMiddleScale) / turnNo))
              d3.select('#cb-aspects-devices-bg')
                .append('use')
                .attr('width', 30)
                .attr('height', 30)
                .attr('xlink:href', '#DEVEICE-BACKGROUND')
                .attr('name', 'editedAddDevice')
                .attr('cursor', 'pointer')
                .attr('fill', fillColor)
                .attr('transform', function () {
                  const devicesOpt = deviceIndex * 29
                  const dx = (newJg + devicesOpt) * Math.sin(ang2rad(angle.from))
                  const dy = (newJg + devicesOpt) * Math.cos(ang2rad(angle.from))
                  const x = bgLines.x + dx
                  const y = bgLines.y - dy
                  const height = this.getBBox().height / 2
                  const width = this.getBBox().width / 2
                  return `translate(${x - height} ${y - width}) rotate(${angle.from} ${height} ${width})`
                })
                .on('mouseover', () => {
                  this.props.deviceCallBack(laneIndex, activeReviceInsIndex, obj, angle.from)
                })
                .on('mouseout', () => {
                  this.props.deviceCallBack(null)
                })
              d3.select('#cb-aspects-devices')
                .append('use')
                .attr('name', 'editedAddDevice')
                .attr('width', deviceWidth / 2)
                .attr('height', deviceHeight / 2)
                .attr('xlink:href', `#${obj.type}`)
                .attr('cursor', 'pointer')
                .attr('transform', function () {
                  const devicesOpt = deviceIndex * deviceGap
                  const deviceStart = obj.type === 'GANTRY' && deviceIndex === 0 ? 84 : 86
                  const dx = (deviceStart + devicesOpt - 3) * Math.sin(ang2rad(angle.from))
                  const dy = (deviceStart + devicesOpt - 3) * Math.cos(ang2rad(angle.from))
                  const x = centerLines.x + dx
                  const y = centerLines.y - dy
                  const height = this.getBBox().height / 2
                  const width = this.getBBox().width / 2
                  return `translate(${x - height} ${y - width}) rotate(${devicesAngle} ${height} ${width})`
                })
                .attr('fill', '#ffffff')
                .attr('cursor', 'pointer')
                .on('mouseover', () => {
                  this.props.deviceCallBack(laneIndex, activeReviceInsIndex, obj, angle.from)
                })
                .on('mouseout', () => {
                  this.props.deviceCallBack(null)
                })
              // .on('mouseOver', () => {
              //   this.props.deviceCallBack(laneIndex, deviceIndex, obj)
              // })
              // .on('mouseLeave', () => {
              //   this.props.deviceCallBack(null)
              // })
            })
          }
        })
      }
    })
  }

  borderTestPoint (point, x, y) {
    const { w, h } = this.state
    let activeX = null
    let activeY = null
    if (point.x - x < 0) {
      activeX = x
    } else if (point.x - x > w) {
      activeX = w - x
    } else {
      activeX = point.x - x
    }
    if (point.y - y < 0) {
      activeY = y
    } else if (point.y - y > h) {
      activeY = h - y
    } else {
      activeY = point.y - y
    }

    return {
      x: activeX,
      y: activeY
    }
  }

  drawWaitingAreaDirections(guidesPoints){
    // const guidesPoints = this.guidesWaitingAreaDirectionPointsData(start, end)
    d3.select('#cb-aspects-dircections')
    .selectAll('use')
    .data(guidesPoints)
    .enter()
    .append('use')
    .attr('name', 'editedAddDirection')
    .attr('cursor', 'pointer')
    .attr('xlink:href', (v, i) => {
      const { directions } = v
      if (!directions) {
        return '#NONE'
      } else {
        const direList = v.isOut || directions.length === 0 ? ['NONE'] : directions
        const symbolStr = directions2Id(direList)
        return symbolStr
      }
    })
    .attr('transform', (v, i) => {
      const directions = v.directions && v.directions.length > 0 ? v.directions : []
      if (v.directions && directions.length > 0 && !v.isOut) {
        const { x: x1, y: y1, angle, isOut } = v
        const direList = directions.length > 2 ? ['STRAIGHT', 'RIGHT'] : directions
        const revist = JSON.parse(JSON.stringify(direList))
        const symbolStr = directions2Id(direList)
        const symbolStrRer = directions2Id(revist.reverse())
        // console.log('2', d3.select(symbolStrRer).attr)
        const symbolWidth = d3.select(symbolStr)._groups[0][0] !== null ? d3.select(symbolStr).attr('width') / 2 : d3.select(symbolStrRer).attr('width') / 2
        // const laneWidth = width / (ins.length + outs)
        const s = 1.4
        const opt = 1.4
        const scales = 1
        const w = symbolWidth
        const h = 90
        const { x: x0, y: y0 } = { x: w * scales, y: isOut ? h * 0.43 : h * -0.08 }
        const { from } = angle
        const signAngle = from + (isOut ? 0 : 180)
        const result = `translate(${x1 - x0} ${y1 - y0}) rotate(${signAngle} ${x0} ${y0}) translate(${x0 * (1 - opt)} ${y0 * (1 - opt)}) scale(${s}) `
        return result
      } else {
        return ''
      }
    })
    .attr('stroke', 'none')
    .attr('fill', (v, i) => {
      const editRoadColor = v.editDirectionColor ? v.editDirectionColor : '#FF9000'
      const isChoose = v.chooseDirection ? editRoadColor : '#fff'
      return isChoose
    })
  }

  drawDirections () {
    const { coord, streetInfos } = this.state
    const guidesPoints = this.guidesPointsData()
    // guidesPoints = guidesPoints.filter(items => items.directions.length !== 0)
    d3.select('#cb-aspects-dircections-bg')
      .selectAll('use')
      .data(guidesPoints)
      .enter()
      .append('use')
      .attr('xlink:href', '#DEVEICE-BACKGROUND')
      .attr('cursor', 'pointer')
      .attr('name', 'editedAddDirection')
      .attr('fill', 'transparent')
      .attr('transform', (v, i) => {
        const directions = v.directions && v.directions.length > 0 ? v.directions : []
        if (directions.length > 0 && !v.isOut) {
          const { x: x1, y: y1, angle, isOut } = v
          const s = 1.5
          const opt = 0.7
          const scales = 1
          const w = 15
          const h = 90
          const { x: x0, y: y0 } = { x: w * scales, y: isOut ? h * 0.43 : h * -0.08 }
          const { from } = angle
          const signAngle = from + (isOut ? 0 : 180)
          const result = `translate(${x1 - x0} ${y1 - y0}) rotate(${signAngle} ${x0} ${y0}) translate(${x0 * (1 - opt)} ${y0 * (1 - opt)}) scale(${s}) `
          return result
        } else if (directions.length === 0 && !v.isOut) {
          return ''
        } else {
          return ''
        }
      })
      .on('click', (v, i) => {
        // debugger
        const { x: x1, y: y1, editDirectionColor, insIdx, laneIndex } = v
        const callTab = streetInfos[laneIndex].ins[insIdx].tabs
        const insTab = streetInfos[laneIndex].ins[insIdx].insTab
        if (editDirectionColor) {
          streetInfos[laneIndex].ins[v.insIdx].chooseDirection = !streetInfos[laneIndex].ins[insIdx].chooseDirection
          this.setState({
            streetInfos
          }, this.allFunc)
          this.originDataCallBack({ option: 'editroadDirection', content: 'editroadDirection', index: `${callTab}_${insTab}` }, streetInfos, streetInfos[laneIndex].tabs)
        } else if (this.props.showDirectionsModal) {
          const w = 12
          const h = 90
          const { x: x0, y: y0 } = { x: w, y: h * -0.08 }
          const directions = v.directions && v.directions.length > 0 ? v.directions : []
          const { x, y } = this.borderTestPoint({ x: x1 - x0, y: y1 - y0 }, 105, 170)
          // console.log('v', v.ins[insIdx])
          this.setState({
            checked: v.ins && v.ins[insIdx] && v.ins[insIdx].showWaitingArea,
            areaLength: v.ins && v.ins[insIdx] && v.ins[insIdx].areaLength ? v.ins && v.ins[insIdx] && v.ins[insIdx].areaLength  : 0,
            showAddDirectionsModal: true,
            editRoadParams: `${v.laneIndex}_${v.insIdx}_${directions}`,
            modalCoordinate: {
              x,
              y
            }
          })
        }
      })
    d3.select('#cb-aspects-dircections')
      .selectAll('use')
      .data(guidesPoints)
      .enter()
      .append('use')
      .attr('name', 'editedAddDirection')
      .attr('cursor', 'pointer')
      .attr('xlink:href', (v, i) => {
        const { directions } = v
        if (!directions) {
          return '#NONE'
        } else {
          const direList = v.isOut || directions.length === 0 ? ['NONE'] : directions
          const symbolStr = directions2Id(direList)
          return symbolStr
        }
      })
      .attr('transform', (v, i) => {
        try{

          const directions = v.directions && v.directions.length > 0 ? v.directions : []

          if (v.directions && directions.length > 0 && !v.isOut) {
            // console.log('v.directions',v.directions)

            const { x: x1, y: y1, angle, isOut } = v
            // console.log('1')
            const direList = directions.length > 2 ? ['STRAIGHT', 'RIGHT'] : directions
            const revist = JSON.parse(JSON.stringify(direList))
            const symbolStr = directions2Id(direList)
            const symbolStrRer = directions2Id(revist.reverse())

            // console.log('symbolStr',symbolStr)
            // console.log('symbolStrRer',symbolStrRer)
            // console.log('width', d3.select(symbolStr).attr('width') / 2)
  
            // console.log('11--->'. d3.select(symbolStr)._groups[0][0])

            const symbolWidth = d3.select(symbolStr)._groups[0][0] !== null ? d3.select(symbolStr).attr('width') / 2 : d3.select(symbolStrRer).attr('width') / 2
            // const laneWidth = width / (ins.length + outs)
            const s = 1.4
            const opt = 1.4
            const scales = 1
            const w = symbolWidth
            const h = 90
            const { x: x0, y: y0 } = { x: w * scales, y: isOut ? h * 0.43 : h * -0.08 }
            const { from } = angle
            const signAngle = from + (isOut ? 0 : 180)
            const result = `translate(${x1 - x0} ${y1 - y0}) rotate(${signAngle} ${x0} ${y0}) translate(${x0 * (1 - opt)} ${y0 * (1 - opt)}) scale(${s}) `
  
            return result
          } else if (v.directions && directions.length === 0 && !v.isOut) {
            const { ins, laneWidth, laneIndex, x: x1, y: y1, insIdx, turnNo, inflectionEnd, inflectionStart } = v
            const insLine1 = coord.math2svg(splitPoint(inflectionStart, inflectionEnd, (ins.length - insIdx - 1) / turnNo))
            const insLine3 = coord.math2svg(splitPoint(inflectionStart, inflectionEnd, (ins.length - insIdx) / turnNo))
            const centerCircle = this.complateOptY(laneIndex, ins.length - insIdx - 1, 1, pointLenth(insLine1, insLine3) / 2, 50)
            const laneBtnR = laneWidth <= 30 ? 10 : laneWidth / 2 - 10
            const pathLen = laneWidth <= 30 ? 5 : (laneWidth / 2 - 10) / 2
            const w = 12
            const h = 90
            const { x: x0, y: y0 } = { x: w, y: h * -0.08 }
            d3.select('#cb-aspects-dircections')
              .append('circle')
              .attr('name', 'editedAddDirection')
              .attr('fill', 'rgba(216, 216, 216, 0.1)')
              .attr('cx', `${centerCircle.x}`)
              .attr('cy', `${centerCircle.y}`)
              .attr('r', laneBtnR)
              .attr('cursor', 'pointer')
              .on('click', () => {
                const { x, y } = this.borderTestPoint({ x: x1 - x0, y: y1 - y0 }, 105, 170)
                this.setState({
                  showAddDirectionsModal: true,
                  editRoadParams: `${laneIndex}_${insIdx}`,
                  modalCoordinate: {
                    x,
                    y
                  }
                })
              })
              .on('mouseover', () => {
                this.setState({
                  showTip: true,
                  tipWords: '添加方向按钮',
                  tipCoordinate: { x: centerCircle.x, y: centerCircle.y }
                })
              })
              .on('mouseout', () => {
                this.setState({
                  showTip: false
                })
              })
            d3.select('#cb-aspects-dircections')
              .append('path')
              .attr('name', 'editedAddDirection')
              .attr('stroke', 'rgba(216, 216, 216, 0.8)')
              .attr('fill', 'rgba(216, 216, 216, 0.8)')
              .attr('cursor', 'pointer')
              .attr('d', `M ${centerCircle.x + pathLen} ${centerCircle.y} L ${centerCircle.x - pathLen} ${centerCircle.y} M ${centerCircle.x} ${centerCircle.y + pathLen} L ${centerCircle.x} ${centerCircle.y - pathLen} `)
              .on('click', () => {
                d3.event.stopPropagation()
                d3.event.preventDefault()
                const { x, y } = this.borderTestPoint({ x: x1 - x0, y: y1 - y0 }, 105, 170)
                this.setState({
                  showAddDirectionsModal: true,
                  editRoadParams: `${laneIndex}_${insIdx}`,
                  modalCoordinate: {
                    x,
                    y
                  }
                })
              })
              .on('mouseover', () => {
                this.setState({
                  showTip: true,
                  tipWords: '添加方向按钮',
                  tipCoordinate: { x: centerCircle.x, y: centerCircle.y }
                })
              })
              .on('mouseout', () => {
                this.setState({
                  showTip: false
                })
              })
            return ''
          } else {
            return ''
          }
        }
        catch(e){
          return ''
        }
      })
      .attr('stroke', 'none')
      .attr('fill', (v, i) => {
        const editRoadColor = v.editDirectionColor ? v.editDirectionColor : '#FF9000'
        const isChoose = v.chooseDirection ? editRoadColor : '#fff'
        return isChoose
      })
  }

  complateOptY (laneIndex, insIndex, insScale, lenY, coordinateY) {
    const { streetInfos, coord } = this.state
    let streetInfosObj = {}
    if (!streetInfos[laneIndex]) {
      streetInfosObj = streetInfos.find((item, index) => item.tabs === laneIndex)
    } else {
      streetInfosObj = streetInfos[laneIndex]
    }
    const { turnNo, start } = streetInfosObj
    const { inflectionEnd, inflectionStart } = this.concatCurPrePoint(laneIndex)
    const vprev = streetInfos[(laneIndex - 1 + streetInfos.length) % streetInfos.length]
    const { end } = vprev
    const insLine1 = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, insIndex / turnNo))
    const insLine2 = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, (insIndex + insScale) / turnNo))
    const insLineEnd1 = coord.math2svg(splitPoint(end, start, insIndex / turnNo))
    const insLineEnd2 = coord.math2svg(splitPoint(inflectionEnd, inflectionStart, (insIndex + 1) / turnNo))
    const len = pointLenth(insLine1, insLine2)
    const jgY1 = splitPoint(insLine1, insLine2, lenY / len)
    const jgY2 = splitPoint(insLineEnd1, insLineEnd2, lenY / len)
    const length = pointLenth(jgY1, jgY2)
    return splitPoint(jgY1, jgY2, coordinateY / length)
  }

  receivePlugin () {
    if (this.props.children) {
      const { data: propData, width, height } = this.props
      const { svg, coord, streetInfos } = this.state
      return React.Children.map(this.props.children, (plugin, index) => {
        return React.cloneElement(plugin, {
          propData: propData,
          width,
          height,
          svg,
          coord,
          streetInfos,
          index
        })
      }).sort((a, b) => {
        return a.props.zIndex > b.props.zIndex
      })
    }
  }

  allFunc () {
    const { isEdit, isDrawLaneDividers, isEditOut, showRoadName, showWaitingArea, isTurnDirections } = this.state
    this.clearAllSvg()
    // // 绘制背景色
    this.roadBg()
    // 绘制svg中心点
    // // 绘制每条道路的虚线
    isDrawLaneDividers && this.drawLaneDividers()
    // // 绘制进口道的方向
    // // 绘制停止线
    this.drawCenterRect()
    // // 绘制双黄分割线
    this.drawsplitLine()

    isEdit && this.editRoad()
    isEditOut && this.editOuts()
    // // 绘制人行道
    this.crossWalkRoad()
    // // svg点击取消编辑状态
    this.svgHandleFunc()

    this.drawDirections()

    this.drawGreenDividers()

    // this.drawDevices()
    this.drawDevicePlugin()

    //待行区
    showWaitingArea && this.drawWaitingArea()

    isTurnDirections && this.turnDirections()
    isTurnDirections && this.turnDirections1()
    showRoadName && this.roadName()
    this.props.isShowStatus && this.drawCenterRectLine()
  }

  roadName () {
    const { coord, streetInfos } = this.state
    const self = this
    d3.select('#cb-aspects-road-name')
      .selectAll('text')
      .data(streetInfos)
      .enter()
      .append('text')
      .attr('fill', '#666666')
      .attr('font-size', 12)
      .attr('cursor', 'pointer')
      .text((v, i) => {
        return v.name || ''
      })
      .attr('x', function () {
        return 0
      })
      .attr('y', function () {
        return this.getBBox().height
      })
      .attr('transform', function (d, laneIndex) {
        const { turnNo, angle } = d
        const { inflectionEnd, inflectionStart } = self.concatCurPrePoint(laneIndex)
        const endTurnNo = turnNo === 0 ? 0.4 : angle.from > 180 ? (turnNo + 0.4) / turnNo : (turnNo + 0.9) / turnNo
        const insLine = coord.math2svg(splitPoint(inflectionStart, inflectionEnd, endTurnNo))
        const dx = 0 * Math.sin(ang2rad(angle.from))
        const dy = 0 * Math.cos(ang2rad(angle.from))
        const x = insLine.x + dx
        const y = insLine.y - dy
        const angleName = angle.from > 180 ? angle.from - 270 : angle.from + 270
        return `translate(${x - this.getBBox().width / 2} ${y - this.getBBox().height / 2}) rotate(${angleName} ${this.getBBox().width / 2} ${this.getBBox().height / 2})`
      })
      .on('click', function (v, i) {
        self.props.roadNameCallback(v)
      })
  }

  drawWaitingArea(){
    const { coord, streetInfos } = this.state
    // console.log('streetInfos',streetInfos)
    streetInfos.forEach((obj, laneIndex)=>{
      if(!obj.ins || obj.ins.length === 0){
        return;
      }
      const { ins, outs, inflectionStart, inflectionEnd, angle, start, end } = this.concatCurPrePoint(laneIndex)
      // console.log('obj', obj)
      // const { x: xCurveStart, y: yCurveStart } = coord.math2svg(inflectionStart)
      // const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(inflectionEnd)

      // const newNextJoint = normalMovePoint(angle.from - 90, { x: inflectionStart.x, y: inflectionStart.y }, crosswalkLen, false)
      // const newJoint = normalMovePoint(angleNext.to - 90, { x: inflectionEnd.x, y: inflectionEnd.y }, crosswalkLen, false)

      const laneNum = ins.length + outs
      // console.log('ins.length', ins.length)
      // console.log('outs.length', outs)
      const stopPoints = segmentDividePoints(inflectionStart, inflectionEnd, laneNum);
      // console.log('brfore-stopPoints', stopPoints)
      stopPoints.unshift(inflectionStart)
      stopPoints.push(inflectionEnd)
      stopPoints.splice(0,outs)
      // console.log('stopPoints',stopPoints)

      if(stopPoints.length <= 1){
        return;
      }
      const centerPoinst = [];
      stopPoints.forEach((point,i)=>{
        if(!obj.ins[i] || !obj.ins[i].showWaitingArea){
          return;
        }

        let insLineEnd=null;
        let nextLineEnd=null;
        let insCenterPoint=null;
        let nextInsCenterPoint=null;
        let offset = 0;
        // obj.sortFrid[i].turnDur
        // turnDur 1 左转， 2，直行，3，右转，4.掉头

        if(obj.ins[i].directions && obj.ins[i].directions.length > 0 && obj.ins[i].directions.indexOf("LEFT") >= 0){
          offset=10;
          const insLineEndPoint = normalMovePoint(angle.from-90, {x:point.x, y: point.y}, 60, false);
          insCenterPoint =  coord.math2svg(splitPoint(insLineEndPoint, point, 0.5));
          insLineEnd = coord.math2svg(normalMovePoint(angle.from, insLineEndPoint, -10, false))
          if(stopPoints[i+1]){
            const nextLineEndPoint = normalMovePoint(angle.from-90, {x:stopPoints[i+1].x, y:stopPoints[i+1].y}, 60, false);
            nextLineEnd = coord.math2svg(normalMovePoint(angle.from, nextLineEndPoint, -10, false))

          }
        }
        // if(stopPoints[i+1]){
        // centerPoinst.push(splitPoint(x, stopPoints[i+1], 0.5))
        insLineEnd = insLineEnd || coord.math2svg(normalMovePoint(angle.from-90, {x:point.x, y: point.y}, 60, false))
        const insLineStart =coord.math2svg(point)
        let line1 = `M ${insLineStart.x} ${insLineStart.y} L ${insLineEnd.x} ${insLineEnd.y}`
        if(insCenterPoint){
          line1 = `M ${insLineStart.x} ${insLineStart.y} Q ${insCenterPoint.x} ${insCenterPoint.y} ${insLineEnd.x} ${insLineEnd.y}`
        }
        //待行区竖线
        d3.select('#cb-aspects-wait-area').append('path')
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 255, 255, 1)')
          .attr('stroke-dasharray', '5,5')
          // .attr('stroke-width', `${this.flowCount(flowItem.sumFlow)}`)
          .attr('stroke-width', 1)
          .attr('key', (d, i) => `rectlightborder${laneIndex}`)
          .attr('d', line1)
        // }

        if(stopPoints[i+1]){
          nextLineEnd = nextLineEnd || coord.math2svg(normalMovePoint(angle.from-90, {x:stopPoints[i+1].x, y:stopPoints[i+1].y}, 60, false))
          const nextLineStart = coord.math2svg(stopPoints[i+1])
          nextInsCenterPoint = coord.math2svg(splitPoint(normalMovePoint(angle.from-90, {x:stopPoints[i+1].x, y:stopPoints[i+1].y}, 60, false), stopPoints[i+1], 0.5));
          const centerLine = splitPoint(insLineEnd, nextLineEnd, 0.5);

          //待行区横线
          d3.select('#cb-aspects-wait-area').append('path')
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 255, 255, 1)')
          .attr('stroke-dasharray', '5,5')
          // .attr('stroke-width', `${this.flowCount(flowItem.sumFlow)}`)
          .attr('stroke-width', 1)
          .attr('key', (d, i) => `rectlightborder${laneIndex}`)
          .attr('d', `M ${insLineEnd.x} ${insLineEnd.y} L ${nextLineEnd.x} ${nextLineEnd.y}`)

          let line2 = `M ${nextLineStart.x} ${nextLineStart.y} L ${nextLineEnd.x} ${nextLineEnd.y}`;
          if(nextInsCenterPoint){
            line2 = `M ${nextLineStart.x} ${nextLineStart.y} Q ${nextInsCenterPoint.x} ${nextInsCenterPoint.y} ${nextLineEnd.x} ${nextLineEnd.y}`;
          }
          //待行区竖线
          d3.select('#cb-aspects-wait-area').append('path')
          .attr('fill', 'none')
          .attr('stroke', 'rgba(255, 255, 255, 1)')
          .attr('stroke-dasharray', '5,5')
          // .attr('stroke-width', `${this.flowCount(flowItem.sumFlow)}`)
          .attr('stroke-width', 1)
          .attr('key', (d, i) => `rectlightborder${laneIndex}`)
          .attr('d', line2)

          // this.drawWaitingAreaDirections()
          //转向
          if(!obj.ins[i] || !obj.ins[i].length === 0){
            return;
          }

          const { x: x1, y: y1} = centerLine

          // const direList = obj.sortFrid[i].directions.length === 0 ? ['NONE'] : obj.sortFrid[i].directions
          const directions = obj.ins[i].directions;
          const direList = directions.length > 2 ? ['STRAIGHT', 'RIGHT'] : directions
          const symbolStr = directions2Id(direList)
          const revist = JSON.parse(JSON.stringify(direList))
          const symbolStrRer = directions2Id(revist.reverse())
          const symbolWidth = d3.select(symbolStr)._groups[0][0] !== null ? d3.select(symbolStr).attr('width') / 2 : d3.select(symbolStrRer).attr('width') / 2
          // const laneWidth = width / (ins.length + outs)
          const s = 1.4
          const opt = 1.4
          const scales = 1
          const w = symbolWidth
          const h = 90
          const { x: x0, y: y0 } = { x: w * scales, y: h * -0.08 }
          const { from } = angle
          // const signAngle = from + (isOut ? 0 : 180)
          const signAngle = from + 180-offset
          const result = `translate(${x1 - x0} ${y1 - y0}) rotate(${signAngle} ${x0} ${y0}) translate(${x0 * (1 - opt)} ${y0 * (1 - opt)}) scale(${s}) `
          // console.log('result',result)
          d3.select('#cb-aspects-dircections')
            .append('use')
            .attr('name', 'editedAddDirection')
            .attr('cursor', 'pointer')
            .attr('xlink:href', symbolStr)
            .attr('transform', result)
            .attr('stroke', 'none')
            .attr('fill', '#fff')
          }
      })
      // return;
      

      // const insLine = splitPoint(inflectionStart, inflectionEnd, (ins.length / 2 + outs) / (outs + ins.length))

      if(centerPoinst.length <= 1){
        return;
      }
      const { x: s1, y: e1 } = centerPoinst[0]
      const { x: s2, y: e2 } = centerPoinst[1]


      d3.select('#cb-aspects-wait-area').append('path')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 1)')
        // .attr('stroke-width', `${this.flowCount(flowItem.sumFlow)}`)
        .attr('stroke-width', 4)
        .attr('key', (d, i) => `rectlightborder${laneIndex}`)
        .attr('d', `M ${s1} ${e1} L ${s2} ${e2}`)

    })
    // const conTurn = document.getElementById('svg-connect-turn')
    // let filterArr = streetInfos.map((items, laneIndex) => {
    //   // laneIndex为道路的id， angle为每个道路的角度，laneWidth是每个道路中的车道的宽度
    //   const { inflectionStart, inflectionEnd, angle } = this.concatCurPrePoint(laneIndex)
    //   const obj = flowData && flowData.find(flow => flow.angle === items.angle.from)
    //   // 道路名称渲染
    //   const roadPoint = splitPoint(inflectionStart, inflectionEnd, 0.2)
    //   const add = coord.math2svg(normalMovePoint(angle.from - 90, { x: roadPoint.x, y: roadPoint.y }, -80, false))
    //   this.refDom.select('#svg-road-name').append('text')
    //     .attr('fill', '#666')
    //     .attr('font-size', 12)
    //     .text(items.name)
    //     .attr('transform', function (d, laneIndex) {
    //       return `translate(${add.x} ${add.y}) rotate(${angle.from - 180})`
    //     })
    //   return obj
    // })
    // filterArr = filterArr.filter(Boolean)
    // filterArr.forEach((obj, laneIndex) => {
    //   const { ins, outs, inflectionStart, inflectionEnd, angle } = this.concatCurPrePoint(laneIndex)
    //   const insLine = splitPoint(inflectionStart, inflectionEnd, (ins.length / 2 + outs) / (outs + ins.length))
    //   const insLineEnd = coord.math2svg(normalMovePoint(angle.from - 90, { x: insLine.x, y: insLine.y }, -60, false))
    //   let insLineStart = coord.math2svg(insLine)
    //   if (obj) {
    //     const initialValue = null
    //     const sum = obj.frids && obj.frids.reduce((accumulator, currentValue) => { // 获取进口道流量总和数, 进口道累加
    //       return accumulator + currentValue.sumFlow
    //     }, initialValue)
    //     // 进口道渲染 和 转向到目标没有 关系
    //     if (ins && ins.length > 0) { // 进口到渲染
    //       this.refDom.select('#svg-road-ins').append('path')
    //         .attr('fill', 'none')
    //         .attr('stroke', this.handleColor(COLOR_LIST, laneIndex, this.handleGetFlowDataNum(sum)))
    //         .attr('stroke-width', obj.flowWidth)
    //         .attr('key', (d, i) => `rectlightborder${i}`)
    //         .attr('d', `M ${insLineStart.x} ${insLineStart.y} L ${insLineEnd.x} ${insLineEnd.y}`)
    //       const textPoint = splitPoint(insLineStart, insLineEnd, 0.25)
    //       this.refDom.select('#svg-flow-num').append('text')
    //         .attr('fill', '#666')
    //         .attr('font-size', 10)
    //         .text(this.handleGetFlowDataNum(sum))
    //         .attr('transform', function (d, laneIndex) {
    //           return `translate(${textPoint.x} ${textPoint.y}) rotate(${angle.from - 90})`
    //         })
    //     }
    //     obj.frids && obj.frids.forEach(flowItem => {
    //       // outs为出口道的数目ins为进口道的数组ins.length为进口道的数目，加起来是整个车道的数目
    //       // 出口道数目比上整个道路数目得到的比值 车道两边的两个点的连线inflectionStart, inflectionEnd splitPoint计算两个点直接的比例点，第三个参数为0.5为中点
    //       // 得到进口道和出口口道的连接点的比例为outs / (ins.length + outs) 从而得到相应的点 insStartPoint
    //       // insStartPoint1为车道顶部出口道和进口道的中的连接点
    //       const streetInfo = streetInfos.find(item => item.angle.from === flowItem.tangle) // streetInfo 表示目标信息
    //       if (streetInfo) {
    //         const {
    //           ins: nextIns, outs: nextOuts,
    //           inflectionStart: nextInflectionStart, inflectionEnd: nextInflectionEnd,
    //           angle: nextAngle
    //         } = this.concatCurPrePoint(streetInfo.tabs)
    //         const toLine = splitPoint(nextInflectionStart, nextInflectionEnd, (nextOuts / 2) / (nextOuts + nextIns.length))
    //         const insLineStart1 = coord.math2svg(normalMovePoint(nextAngle.from - 90, { x: insLine.x, y: insLine.y }, 0, false))
    //         // let toLineStart = coord.math2svg(normalMovePoint(nextAngle.from - 90, { x: toLine.x, y: toLine.y }, -5, false))
    //         let curStartPoint = {}
    //         const FlowDataNum = this.handleGetFlowDataNum(flowItem.sumFlow)
    //         const outFlowWidth = obj.outKeys[flowItem.tangle];
    //         const curOut = obj.outsFlowInfo[flowItem.tangle].filter((f)=>{ return f.from === angle.from})[0]
    //         insLineStart = coord.math2svg(normalMovePoint(angle.from, {x: insLine.x, y: insLine.y},  flowItem.offset - obj.flowWidth/2 , false))
    //         const toLineStart = coord.math2svg(normalMovePoint(nextAngle.from, { x: toLine.x, y: toLine.y }, outFlowWidth/2 - curOut.offset , false))

    //         // turnDirNo 1 左转， 2，直行，3，右转，4.掉头
    //         if (flowItem.turnDirNo === 4) {
    //           const insAngleStart = coord.math2svg(normalMovePoint(angle.from - 90, { x: insLine.x, y: insLine.y }, 80, false))
    //           const outAngleStart = coord.math2svg(normalMovePoint(nextAngle.from - 90, { x: toLine.x, y: toLine.y }, 80, false))
    //           curStartPoint = splitPoint(insAngleStart, outAngleStart, 0.6)
    //           // 流量线的值
    //           const centerPoint = splitPoint(toLine, insLine, 0.5)
    //           const connectPoint = coord.math2svg(normalMovePoint(nextAngle.from - 180, { x: centerPoint.x, y: centerPoint.y }, 10, false))
    //           this.refDom.select('#svg-flow-num').append('text')
    //             .attr('fill', '#666')
    //             .attr('font-size', 10)
    //             .attr('text-shadow', '5px 5px 3px rgb(213,213,213)')
    //             .text(FlowDataNum)
    //             .attr('transform', function (d, laneIndex) {
    //               return `translate(${connectPoint.x} ${connectPoint.y}) rotate(${angle.from + 180})`
    //             })
    //         } else if (flowItem.turnDirNo === 2) { // 直行
    //           curStartPoint = splitPoint(insLineStart1, toLineStart, 0.5)
    //           // 流量线的值
    //           const centerPoint = splitPoint(insLineStart1, toLineStart, 0.7)
    //           this.refDom.select('#svg-flow-num').append('text')
    //             .attr('fill', '#666')
    //             .attr('font-size', 10)
    //             .text(FlowDataNum)
    //             .attr('text-shadow', '0.1em 0.1em #333')
    //             .attr('transform', function (d, laneIndex) {
    //               return `translate(${centerPoint.x} ${centerPoint.y}) rotate(${nextAngle.from + 90})`
    //             })
    //         } else if (flowItem.turnDirNo === 1 || flowItem.turnDirNo === 3) {
    //           const { a: a1, b: b1, c: c1 } = lineAnglePoint(angle.from, { x: insLine.x, y: insLine.y })
    //           const { a: a2, b: b2, c: c2 } = lineAnglePoint(nextAngle.from, { x: toLine.x, y: toLine.y })
    //           const joint = intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    //           const jointStart = coord.math2svg(joint)
    //           curStartPoint = {
    //             x: jointStart.x,
    //             y: jointStart.y
    //           }
    //           // 流量线的值
    //           if (flowItem.turnDirNo === 1) {
    //             // const connectPoint = coord.math2svg(normalMovePoint(nextAngle.from - 90, { x: joint.x, y: joint.y }, 20, false))
    //             const { pathDom, pathLength } = this.getPathInfo(`${insLineStart.x} ${insLineStart.y} Q ${curStartPoint.x} ${curStartPoint.y} ${toLineStart.x} ${toLineStart.y}`)
    //             const { x, y } = pathDom.getPointAtLength(pathLength / 2)
    //             this.refDom.select('#svg-flow-num').append('text')
    //               .attr('fill', '#666')
    //               .attr('font-size', 10)
    //               .text(FlowDataNum)
    //               .attr('transform', function (d, laneIndex) {
    //                 return `translate(${x} ${y}) rotate(${nextAngle.from + 110})`
    //               })
    //           } else if (flowItem.turnDirNo === 3) {
    //             const { pathDom, pathLength } = this.getPathInfo(`${insLineStart.x} ${insLineStart.y} Q ${curStartPoint.x} ${curStartPoint.y} ${toLineStart.x} ${toLineStart.y}`)
    //             const { x, y } = pathDom.getPointAtLength(pathLength / 2)
    //             this.refDom.select('#svg-flow-num').append('text')
    //               .attr('fill', '#666')
    //               .attr('font-size', 10)
    //               .text(FlowDataNum)
    //               .attr('transform', function (d, laneIndex) {
    //                 return `translate(${x} ${y}) rotate(${nextAngle.from - 110})`
    //               })
    //           }
    //         }
    //         if (nextOuts && nextOuts > 0) {
    //           const toOutsInfo = filterArr.find(item => nextAngle.from === item.angle)
    //           const toOutsSum = toOutsInfo && Object.values(toOutsInfo.reverseRids) && Object.values(toOutsInfo.reverseRids)[0]
    //           const toLine = splitPoint(nextInflectionStart, nextInflectionEnd, (nextOuts / 2) / (nextOuts + nextIns.length))
    //           const tOutLineStart = coord.math2svg(normalMovePoint(nextAngle.from - 90, { x: toLine.x, y: toLine.y }, 0, false))
    //           const tOutLineEnd = coord.math2svg(normalMovePoint(nextAngle.from + 90, { x: toLine.x, y: toLine.y }, 50, false))
    //           if (!this.refDom.select(`.outs-${streetInfo.tabs}-checked`).node() && flowItem.turnDirNo === 2) {
    //             this.addMarker(this.handleColor(COLOR_LIST, laneIndex, this.handleGetFlowDataNum(toOutsSum)).replace('#', ''))
    //             this.refDom.select('#svg-road-outs').append('path')
    //               .attr('fill', 'none')
    //               .attr('class', `outs-${streetInfo.tabs}-checked`)
    //               .attr('marker-end', `url(#arrow-${this.handleColor(COLOR_LIST, laneIndex).replace('#', '')})`)
    //               .attr('stroke', this.handleColor(COLOR_LIST, laneIndex, this.handleGetFlowDataNum(toOutsSum)))
    //               .attr('stroke-width', obj.outKeys[toOutsInfo.angle])
    //               .attr('key', (d, i) => `rectlightborder${i}`)
    //               .attr('d', `M ${tOutLineStart.x} ${tOutLineStart.y} L ${tOutLineEnd.x} ${tOutLineEnd.y}`)
    //             const outpoint = splitPoint(tOutLineStart, tOutLineEnd, 0.25)
    //             this.refDom.select('#svg-flow-num').append('text')
    //               .attr('fill', '#666')
    //               .attr('font-size', 10)
    //               .text(this.handleGetFlowDataNum(toOutsSum))
    //               .attr('transform', function (d, laneIndex) {
    //                 return `translate(${outpoint.x} ${outpoint.y}) rotate(${nextAngle.from - 90})`
    //               })
    //           }
    //           const turnArr = this.getTurnNo(filterArr, nextAngle.from)
    //           if (turnArr.length > 0 && !turnArr.includes(2) && !this.refDom.select(`.outs-${streetInfo.tabs}-checked`).node()) {
    //             this.addMarker(this.handleColor(COLOR_LIST, streetInfo.tabs, this.handleGetFlowDataNum(toOutsSum)).replace('#', ''))
    //             const outLineEnd = coord.math2svg(normalMovePoint(nextAngle.from - 90, { x: toLine.x, y: toLine.y }, -60, false))
    //             const outLineStart = coord.math2svg(toLine)
    //             this.refDom.select('#svg-road-outs').append('path')
    //               .attr('fill', 'none')
    //               .attr('class', `outs-${streetInfo.tabs}-checked`)
    //               .attr('marker-end', `url(#arrow-${this.handleColor(COLOR_LIST, streetInfo.tabs, this.handleGetFlowDataNum(toOutsSum)).replace('#', '')})`)
    //               .attr('stroke', this.handleColor(COLOR_LIST, streetInfo.tabs, this.handleGetFlowDataNum(toOutsSum)))
    //               .attr('stroke-width', obj.outKeys[toOutsInfo.angle])
    //               .attr('key', (d, i) => `rectlightborder${i}`)
    //               .attr('d', `M ${outLineStart.x} ${outLineStart.y} L ${outLineEnd.x} ${outLineEnd.y}`)
    //             const outpoint = splitPoint(outLineStart, outLineEnd, 0.25)
    //             this.refDom.select('#svg-flow-num').append('text')
    //               .attr('fill', '#666')
    //               .attr('font-size', 10)
    //               .text(this.handleGetFlowDataNum(toOutsSum))
    //               .attr('transform', function (d, laneIndex) {
    //                 return `translate(${outpoint.x} ${outpoint.y}) rotate(${angle.from - 90})`
    //               })
    //           }
    //         }
    //         if (!conTurn.querySelector('svg-connect-turn')) { // 连接线渲染
    //           this.refDom.select('#svg-connect-turn').append('path')
    //             .attr('fill', 'none')
    //             .attr('stroke', this.handleColor(COLOR_LIST, laneIndex, this.handleGetFlowDataNum(flowItem.sumFlow)))
    //             // .attr('stroke-width', `${this.flowCount(flowItem.sumFlow)}`)
    //             .attr('stroke-width', flowItem.strokeWidth)
    //             .attr('key', (d, i) => `rectlightborder${i}`)
    //             .attr('d', `M ${insLineStart.x} ${insLineStart.y} Q ${curStartPoint.x} ${curStartPoint.y} ${toLineStart.x} ${toLineStart.y}`)
    //         }
    //       }
    //     })
    //   }
    // })
  }

  uniteClickAndMove (dx, dy) {
    const { w, h, center } = this.state
    const { x, y } = center
    const coord = new SVGCoord({ x: 0, y: 0 }, { x: x * w + dx, y: y * h + dy })
    this.setState({
      coord,
      left: dx,
      top: dy
    }, () => {
      this.allFunc()
    })
  }

  svgHandleFunc () {
    const self = this
    d3.select('#cb-aspects-svg')
      .attr('cursor', 'grab')
      .on('mousedown', function () {
        self.isDrawer = false
        self.flag = true
        self.x = d3.event.clientX
        self.y = d3.event.clientY
        d3.select('#cb-aspects-svg')
          .attr('cursor', 'grabbing')
      })
      .on('mousemove', function () {
        if (
          self.isEnter &&
          self.flag &&
          d3.event.clientY - self.y !== 0 &&
          d3.event.clientX - self.x !== 0 &&
          d3.event.offsetX > 0 &&
          d3.event.offsetY < self.state.w
        ) {
          self.isDrawer = true
          const x = self.left + d3.event.clientX - self.x
          const y = self.top + d3.event.clientY - self.y
          self.uniteClickAndMove(x, y)
        }
        self.props.deviceCallBack(null)
      })
      .on('mouseup', function () {
        self.flag = false
        if (self.isDrawer) {
          self.isDrawer = false
          self.left = self.left + d3.event.clientX - self.x
          self.top = self.top + d3.event.clientY - self.y
        }
        d3.select('#cb-aspects-svg')
          .attr('cursor', 'grab')
      })
      .on('mouseenter', function () {
        self.isEnter = true
      })
      .on('mouseleave', function () {
        if (self.isDrawer) {
          self.isDrawer = false
          self.isEnter = false
          self.flag = false
          self.left = self.left + d3.event.clientX - self.x
          self.top = self.top + d3.event.clientY - self.y
        }
      })
      .on('click', function () {
        if (self.state.isSelect) {
          self.setState({
            isSelect: false
          })
        }
      })
  }

  crossWalkRoad () {
    const { crossWolkWidth, crossWolkHeight, crossJianJu } = this.props.data
    const { svg, coord, streetInfos } = this.state
    svg.append('g')
      .attr('id', 'cb-human-line')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        const { inflectionStart, inflectionEnd, angle, nextAngle: angleNext } = this.concatCurPrePoint(i)
        const startDistance = crossWolkWidth || CROSS_WALK_WIDTH // 人行道的宽度
        const crosswalkLen = crossWolkHeight || startDistance * CROSS_SCALE_WALK_WIDTH // 人形道的长度

        const newNextJoint = normalMovePoint(angle.from - 90, { x: inflectionStart.x, y: inflectionStart.y }, crosswalkLen, false)
        const newJoint = normalMovePoint(angleNext.to - 90, { x: inflectionEnd.x, y: inflectionEnd.y }, crosswalkLen, false)
        const newSaftEnd = inflectionEnd
        const newSaftStart = inflectionStart
        const newSaftEndLine = splitPoint(newSaftEnd, newJoint, 0.1)
        const newSaftStartLine = splitPoint(newSaftStart, newNextJoint, 0.1)
        const fristLen = pointLenth(newSaftEndLine, newJoint)
        const secondLen = pointLenth(newSaftStartLine, newNextJoint)
        const lengScales = crosswalkLen / fristLen
        const { x: crosswolkStartx, y: crosswolkStarty } = splitPoint(newSaftEndLine, newJoint, 4 / fristLen)
        const { x: crosswolkJoinEndx, y: crosswolkJoinEndy } = splitPoint(newSaftEndLine, newJoint, lengScales)
        const { x: crosswolkEndx, y: crosswolkEndy } = splitPoint(newSaftStartLine, newNextJoint, 4 / secondLen)
        const { x: crosswolkJoinStartx, y: crosswolkJoinStarty } = splitPoint(newSaftStartLine, newNextJoint, lengScales)
        // new joint
        const jointConectLen = pointLenth({ x: crosswolkStartx, y: crosswolkStarty }, { x: crosswolkEndx, y: crosswolkEndy })
        const numb = Math.floor(jointConectLen / (startDistance))
        let result = ''
        for (let i = 0; i < numb + 1; i++) {
          const jianju = crossJianJu || 4
          if (i * jianju * startDistance < jointConectLen) {
            const end = i * jianju * startDistance + (startDistance) > jointConectLen ? jointConectLen : (i * startDistance * jianju) + (startDistance)
            const { x: x1, y: y1 } = coord.math2svg(splitPoint({ x: crosswolkStartx, y: crosswolkStarty }, { x: crosswolkEndx, y: crosswolkEndy }, (i * startDistance * jianju) / jointConectLen))
            const { x: x2, y: y2 } = coord.math2svg(splitPoint({ x: crosswolkStartx, y: crosswolkStarty }, { x: crosswolkEndx, y: crosswolkEndy }, end / jointConectLen))
            const { x: x3, y: y3 } = coord.math2svg(splitPoint({ x: crosswolkJoinEndx, y: crosswolkJoinEndy }, { x: crosswolkJoinStartx, y: crosswolkJoinStarty }, (i * startDistance * jianju) / jointConectLen))
            const { x: x4, y: y4 } = coord.math2svg(splitPoint({ x: crosswolkJoinEndx, y: crosswolkJoinEndy }, { x: crosswolkJoinStartx, y: crosswolkJoinStarty }, end / jointConectLen))
            result += `M ${x1} ${y1} L ${x3} ${y3} L ${x4} ${y4} L ${x2} ${y2} L ${x1} ${y1} `
          } else {
            break
          }
        }
        return result
      })
      .attr('stroke', '#b7b7b7')
      .attr('fill', '#b7b7b7')
  }

  roadBg () {
    const { svg, coord, streetInfos } = this.state
    const streetStr = streetInfos.reduce((p, d, i, arr) => {
      let [bodyStr, tailStr] = p
      const { safeStart, angle } = this.concatCurPrePoint(i)
      const { curveEnd, curveStart, start, end, joint, safeEnd } = d

      const { x: xCurveStart1, y: yCurveStart1 } = coord.math2svg(safeStart)

      const { x: xCurveEnd2, y: yCurveEnd2 } = coord.math2svg(safeEnd)

      const { x: xCurveStart, y: yCurveStart } = coord.math2svg(curveStart)
      const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(curveEnd)
      const { x: xStart, y: yStart } = coord.math2svg(start)
      const { x: xEnd, y: yEnd } = coord.math2svg(end)
      const { x: xJoint, y: yJoint } = coord.math2svg(joint)
      if (i === 0) {
        tailStr = `L ${xStart} ${yStart}`
      }

      if (Math.abs(angle.to - angle.from) > 170 && Math.abs(angle.to - angle.from) <= 190) {
        bodyStr = bodyStr.concat(`${i === 0 ? 'M' : 'L'} ${xStart} ${yStart}  L ${xCurveStart1} ${yCurveStart1} L ${xCurveEnd2} ${yCurveEnd2} L ${xEnd} ${yEnd}`)
      } else {
        bodyStr = bodyStr.concat(`${i === 0 ? 'M' : 'L'} ${xStart} ${yStart} ${`L ${xCurveStart} ${yCurveStart} Q ${xJoint} ${yJoint} ${xCurveEnd} ${yCurveEnd}`} L ${xEnd} ${yEnd}`)
      }

      return [bodyStr, tailStr]
    }, ['', ''])
    svg.append('g')
      .attr('id', 'draw-road-bg')
      .append('path')
      .attr('d', streetStr.join(''))
      .attr('fill', '#444446')
      .attr('key', (d, i) => `drawroadbg${i}`)
  }

  drawSVG (aspectData, w, h) {
    const { center } = aspectData
    const { x, y } = center
    const svg =
      d3.select('#cb-aspects-group')
    const coord = new SVGCoord({ x: 0, y: 0 }, { x: x * w, y: y * h })
    return { data: aspectData, svg, coord }
  }

  concatCurPoint (index) {
    const { streetInfos } = this.state
    let { joint, safeEnd, angle, end, width, inflectionEnd } = streetInfos[index]
    let { joint: nextJoint, safeStart, inflectionStart, start: startNext, angle: angleNext, outs, ins } = index === streetInfos.length - 1 ? streetInfos[0] : streetInfos[index + 1]
    if (Math.abs(angleNext.to - angleNext.from) > 140 && Math.abs(angleNext.to - angleNext.from) <= 200 && streetInfos.length === 3) {
      nextJoint = correctPoint(angle.to, angleNext.from, safeEnd, joint, startNext).joint
      safeStart = correctPoint(angle.to, angleNext.from, safeEnd, joint, startNext).safe
      inflectionStart = correctPoint(angle.to, angleNext.from, inflectionEnd, joint, startNext).safe
    }
    if (Math.abs(angle.to - angle.from) > 140 && Math.abs(angle.to - angle.from) <= 200 && streetInfos.length === 3) {
      joint = correctPoint(angleNext.from, angle.to, safeStart, nextJoint, end).joint
      safeEnd = correctPoint(angleNext.from, angle.to, safeStart, nextJoint, end).safe
      inflectionEnd = correctPoint(angleNext.from, angle.to, inflectionStart, nextJoint, end).safe
    }
    return {
      nextJoint,
      safeStart,
      safeEnd,
      joint,
      outs,
      ins,
      inflectionEnd,
      inflectionStart,
      startNext,
      end,
      angle,
      width
    }
  }

  editOuts () {
    const self = this
    const { state } = self
    const { coord, streetInfos } = state
    streetInfos.forEach((v, i) => {
      const { start, end, ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(i)
      const { x: xCurveStart, y: yCurveStart } = coord.math2svg(inflectionStart)
      const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(inflectionEnd)
      const { x: xStart, y: yStart } = coord.math2svg(start)
      const { x: xEnd, y: yEnd } = coord.math2svg(end)
      const laneNum = ins.length + outs
      for (let x = 0; x < outs; x++) {
        const { x: splitSaftPointX, y: splitSafePointY } = splitPoint({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, x / laneNum)
        const { x: splitStartPointX, y: splitStartPointY } = splitPoint({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, x / laneNum)
        const { x: splitSaftPointX1, y: splitSafePointY1 } = splitPoint({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, (x + 1) / laneNum)
        const { x: splitStartPointX1, y: splitStartPointY1 } = splitPoint({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, (x + 1) / laneNum)
        const editRoadColor = streetInfos[i].editRoadColor ? streetInfos[i].editRoadColor : '#fff'
        const isChoose = streetInfos[i].chooseOut === x + 1 ? editRoadColor : 'transparent'
        d3.select('#cb-aspects-edited').append('path')
          .attr('d', `M ${splitSaftPointX} ${splitSafePointY} L ${splitStartPointX} ${splitStartPointY} L ${splitStartPointX1} ${splitStartPointY1} L ${splitSaftPointX1} ${splitSafePointY1} L ${splitSaftPointX} ${splitSafePointY} `)
          .attr('stroke', 'none')
          .attr('fill', isChoose)
          .attr('key', (d, i) => `safe-start-line${i}`)
          .attr('fill-opacity', '0.7')
          .style('cursor', 'pointer')
      }
    })
  }

  editRoad () {
    const self = this
    const { state } = self
    const { coord, streetInfos } = state
    streetInfos.forEach((v, i) => {
      const { start, end, ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(i)
      const { x: xCurveStart, y: yCurveStart } = coord.math2svg(inflectionStart)
      const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(inflectionEnd)
      const { x: xStart, y: yStart } = coord.math2svg(start)
      const { x: xEnd, y: yEnd } = coord.math2svg(end)
      const laneNum = ins.length + outs
      for (let x = outs; x < laneNum; x++) {
        const { x: splitSaftPointX, y: splitSafePointY } = splitPoint({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, x / laneNum)
        const { x: splitStartPointX, y: splitStartPointY } = splitPoint({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, x / laneNum)
        const { x: splitSaftPointX1, y: splitSafePointY1 } = splitPoint({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, (x + 1) / laneNum)
        const { x: splitStartPointX1, y: splitStartPointY1 } = splitPoint({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, (x + 1) / laneNum)
        const editRoadColor = streetInfos[i].ins[x - outs].editRoadColor ? streetInfos[i].ins[x - outs].editRoadColor : '#D8D8D8'
        const isChoose = streetInfos[i].ins[x - outs].choose ? editRoadColor : 'transparent'
        d3.select('#cb-aspects-edited').append('path')
          .attr('d', `M ${splitSaftPointX} ${splitSafePointY} L ${splitStartPointX} ${splitStartPointY} L ${splitStartPointX1} ${splitStartPointY1} L ${splitSaftPointX1} ${splitSafePointY1} L ${splitSaftPointX} ${splitSafePointY} `)
          .attr('stroke', 'none')
          .attr('fill', isChoose)
          .attr('key', (d, i) => `safe-start-line${i}`)
          .attr('fill-opacity', '0.3')
          .style('cursor', 'pointer')
          .on('click', () => {
            const callTab = streetInfos[i].ins[x - outs].tabs
            const insTab = streetInfos[i].ins[x - outs].insTab
            streetInfos[i].ins[x - outs].choose = !streetInfos[i].ins[x - outs].choose
            self.setState({
              streetInfos
            }, this.allFunc)
            this.originDataCallBack({ option: 'editroad', content: 'editroad', index: `${callTab}_${insTab}` }, streetInfos, i)
          })
      }
    })
  }

  concatCurPrePoint (index) {
    const { crossWolkWidth, crossWolkHeight } = this.props.data
    const { streetInfos } = this.state
    const { angle, start, safeStart, ins, outs, width, inflectionStart, joint } = streetInfos[index]
    const len = streetInfos.length
    const vprev = streetInfos[(index - 1 + len) % len]
    const { safeEnd, end, inflectionEnd, joint: nextJoint, angle: nextAngle } = vprev
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
      safeStart: safeStart,
      safeEnd: safeEnd,
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

  drawsplitLine () {
    const { svg, coord, streetInfos } = this.state
    svg.append('g')
      .attr('id', 'draw-split-line')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        const { end, start, ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(i)

        if (outs + ins.length && outs !== 0 && ins.length !== 0) {
          const scales = ins.length / (outs + ins.length)
          const { x: splitStartx, y: splitStarty } = splitPoint(end, start, scales)
          const { x: splitEndx, y: splitEndy } = splitPoint(inflectionEnd, inflectionStart, scales)
          const { x: xStart, y: yStart } = coord.math2svg({ x: splitStartx, y: splitStarty })
          const { x: xEnd, y: yEnd } = coord.math2svg({ x: splitEndx, y: splitEndy })
          const result = `M ${xStart} ${yStart} L ${xEnd} ${yEnd}`
          return result
        }
        return ''
      })
      .attr('stroke', '#fad507')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('key', (d, i) => `splitLine${i}`)
  }

  drawStreetBorders () {
    const { svg, coord, streetInfos } = this.state
    const borderPath = pipe(map(coord.math2svg.bind(coord)), streetBorderPath)
    svg.append('g')
      .attr('id', 'cb-aspects-street-borders')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', borderPath)
      .attr('stroke', '#ffffff')
      .attr('fill', 'none')
      .attr('key', (d, i) => `border${i}`)
  }

  drawLaneDividers () {
    const { svg, coord, streetInfos } = this.state
    svg.append('g')
      .attr('id', 'cb-aspects-curve-start-lines')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (v, i) => {
        const { start, end, ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(i)
        const { x: xCurveStart, y: yCurveStart } = coord.math2svg(inflectionStart)
        const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(inflectionEnd)
        const { x: xStart, y: yStart } = coord.math2svg(start)
        const { x: xEnd, y: yEnd } = coord.math2svg(end)
        const laneNum = ins.length + outs
        if (laneNum === 0) {
          return ''
        }
        const stopPoints = segmentDividePoints({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, laneNum)
        // console.log('stopPoints---->', stopPoints)
        const terminalPoints = segmentDividePoints({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, laneNum)
        // console.log('terminalPoints---->', terminalPoints)

        const result = zip(stopPoints, terminalPoints).reduce((p, v, i) => {
          const { x: x0, y: y0 } = v[0]
          const { x: xCenter, y: yCenter } = splitPoint(v[0], v[1], 115 / pointLenth(v[0], v[1]))
          const splitV = splitPoint(v[1], v[0], 0.5)
          const insLen = pointLenth(v[0], splitV)
          const num = insLen / 11
          let strs = i < outs ? '' : `M ${x0} ${y0} L ${xCenter} ${yCenter} `

          for (let x = 0; x < num - 1; x++) {
            if (x % 2 === 0) {
              const { x: splitStartx, y: splitStarty } = splitPoint(v[0], v[1], x * 11 / insLen)
              const { x: splitStartx1, y: splitStarty1 } = splitPoint(v[0], v[1], (x + 1) * 11 / insLen)
              strs += `M ${splitStartx} ${splitStarty} L ${splitStartx1} ${splitStarty1} `
            }
          }
          return p.concat(strs)
        }, '')
        return result
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('key', (d, i) => `curve-start-line${i}`)
  }

  drawGreenDividers () {
    const { svg, coord, streetInfos } = this.state
    svg.append('g')
      .attr('id', 'cb-aspects-curve-start-green-lines')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (v, i) => {
        const { out } = v
        const { start, end, ins, outs, inflectionEnd, inflectionStart } = this.concatCurPrePoint(i)
        const { x: xCurveStart, y: yCurveStart } = coord.math2svg(inflectionStart)
        const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(inflectionEnd)
        const { x: xStart, y: yStart } = coord.math2svg(start)
        const { x: xEnd, y: yEnd } = coord.math2svg(end)
        const laneNum = ins.length + outs
        let insRid = ''
        let outRid = ''
        let outsNum = 0
        const ridArr = []
        ins.forEach((items, index) => {
          if (index === 0) {
            insRid = items.rid
          }
          if (items.rid !== insRid) {
            insRid = items.rid
            ridArr.push(index + outs - 1)
          }
        })
        out && typeof out === 'object' && out.forEach((items, index) => {
          if (index === 0) {
            outRid = items.rid
          }
          if (items.rid !== outRid) {
            outRid = items.rid
            ridArr.push(outsNum - 1)
          }
          outsNum = outsNum + items.out
        })
        if (laneNum === 0) {
          return ''
        }
        const stopPoints = segmentDividePoints({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, laneNum)
        const terminalPoints = segmentDividePoints({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, laneNum)
        const result = zip(stopPoints, terminalPoints).reduce((p, v, i) => {
          if (ridArr && ridArr.indexOf(i) > -1) {
            const { x: x0, y: y0 } = v[0]
            const { x: x1, y: y1 } = v[1]
            const strs = `M ${x0} ${y0} L ${x1} ${y1} `
            return p.concat(strs)
          } else {
            return p
          }
        }, '')
        return result
      })
      .attr('fill', 'none')
      .attr('stroke-width', 5)
      .attr('stroke', '#4E7C39')
      .attr('key', (d, i) => `curve-start-line${i}`)
  }

  drawCenterRectLine () {
    const { svg, coord, streetInfos } = this.state
    streetInfos.forEach((items, laneIndex) => {
      const { ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(laneIndex)
      items.ins.forEach((obj, insIndex) => {
        const insLine1 = splitPoint(coord.math2svg(inflectionStart), coord.math2svg(inflectionEnd), (insIndex + outs) / (outs + ins.length))
        const insLine2 = splitPoint(coord.math2svg(inflectionStart), coord.math2svg(inflectionEnd), (insIndex + outs + 1) / (outs + ins.length))
        const color = obj.defaultColor ? (obj.lightColor ? obj.lightColor : '#FF0404') : (obj.directions.length === 1 && obj.directions.indexOf('RIGHT') > -1) ? 'transparent' : (obj.lightColor ? obj.lightColor : '#FF0404')
        svg.append('g')
          .attr('id', 'cb-aspects-street-ract-light-center')
          .append('path')
          .attr('d', `M ${insLine1.x} ${insLine1.y} L ${insLine2.x} ${insLine2.y}`)
          .attr('stroke', color)
          .attr('fill', 'none')
          .attr('stroke-width', 4)
          .attr('key', (d, i) => `rectlightborder${i}`)
      })
    })
  }

  drawCenterRect () {
    const { svg, coord, streetInfos } = this.state
    svg.append('g')
      .attr('id', 'cb-aspects-street-ract-center')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        const { ins, outs, inflectionStart, inflectionEnd } = this.concatCurPrePoint(i)
        // console.log('ins', ins)
        // console.log('streetInfos',streetInfos)

        const { x: xJoint, y: yJoint } = inflectionEnd
        const { x: xNextJoint, y: yNextJoint } = inflectionStart
        if (outs + ins.length) {
          const scales = ins.length / (outs + ins.length)
          const { x: xNextJoint$, y: yNextJoint$ } = coord.math2svg({ x: xNextJoint, y: yNextJoint })
          const { x: xJoint$, y: yJoint$ } = coord.math2svg({ x: xJoint, y: yJoint })
          const { x: xNextJoint$$, y: yNextJoint$$ } = splitPoint({ x: xJoint$, y: yJoint$ }, { x: xNextJoint$, y: yNextJoint$ }, scales)
          const result = `M ${xJoint$} ${yJoint$} L ${xNextJoint$$} ${yNextJoint$$}`
          return result
        } else {
          return ''
        }
      })
      .attr('stroke', '#ffffff')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('key', (d, i) => `rectborder${i}`)
  }
}
Aspects.defaultProps = {
  centerCallback: (e, v) => { },
  optionFunc: () => { },
  addBtnBool: true,
  showCenterLight: true,
  centerColor: false,
  prevModalWidth: 180,
  contentScale: { x: 1, y: 1 },
  isDrawLaneDividers: true,
  showLight: true,
  isEdit: true,
  showDirectionsModal: true,
  isEditOut: false,
  zoomEnabled: true,
  defaultZoom: 1,
  roadNameCallback: () => { },
  changeZoom: () => {}
}

Aspects.Plugin = Plugin
Aspects.CenterLight = CenterLight
Aspects.AddDevice = AddDevice
Aspects.AddDirection = AddDirection
Aspects.TrafficFlow = TrafficFlow
Aspects.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object]), // 渲染道路数据
  isEdit: PropTypes.oneOfType([PropTypes.bool]), // 是否开启编辑道路模式
  contentScale: PropTypes.oneOfType([PropTypes.object]),
  background: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  centerCallback: PropTypes.oneOfType([PropTypes.func]),
  optionFunc: PropTypes.oneOfType([PropTypes.func]),
  addBtnBool: PropTypes.oneOfType([PropTypes.bool]),
  showCenterLight: PropTypes.oneOfType([PropTypes.bool]),
  centerColor: PropTypes.oneOfType([PropTypes.bool]),
  prevModalWidth: PropTypes.oneOfType([PropTypes.number]),
  isDrawLaneDividers: PropTypes.oneOfType([PropTypes.bool]), // 是否显示分割线
  crossWolkWidth: PropTypes.oneOfType([PropTypes.number]),
  crossWolkHeight: PropTypes.oneOfType([PropTypes.number]),
  crossJianJu: PropTypes.oneOfType([PropTypes.number]),
  showLight: PropTypes.oneOfType([PropTypes.bool]), // 是否显示信号灯
  showDirectionsModal: PropTypes.oneOfType([PropTypes.bool]),
  isEditOut: PropTypes.oneOfType([PropTypes.bool]), // 是否可以编辑出口道
  roadNameCallback: PropTypes.oneOfType([PropTypes.func]) // 点击姓名的回调函数
}
export default Aspects
