import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import * as d3 from 'd3'
import domtoimage from 'dom-to-image'
import PlainDraggable from './plain-draggable.min'
import uniq from 'ramda/src/uniq'
import append from 'ramda/src/append'
import remove from 'ramda/src/remove'
import mergeRight from 'ramda/src/mergeRight'
import clone from 'ramda/src/clone'
// import concat from 'ramda/src/concat'
import {
  svgDefault,
  roadNameDefault,
  hereDefault,
  directionLable,
  colorLable,
  textsDefault,
  roadDefaultWidth,
  roadDefaultVisible,
  roadNameIsVisible,
  flowIsVisible
} from './defaultState'
import { polygonTransRect, computeLineIntersect, splitRoadName, computedRoadAngle, computedSlopeRoadNamePoi } from './utils'
import './Induction.less'
import message from 'antd/lib/message/index.js'
import 'antd/lib/message/style/index.less'
let xScale = ''
let yScale = ''
let MinLng = ''
let MaxLng = ''
let MinLat = ''
let MaxLat = ''

class Induction extends Component {
  currentTextId = ''
  currentRouteId = ''
  currentImageId = ''
  currentDomType = ''
  roadNames = {}
  svgFlag = Math.random()
  dragDatas = []
  constructor (props) {
    super(props)
    this.latlngPointScale(props.data.polygon, props.mapWidth, props.mapHeight)
    this.state = {
      preview: props.preview, // 预览状态
      textsDefault: props.textsDefault,
      screenWidth: props.screenWidth,
      screenHeight: props.screenHeight,
      mapWidth: props.mapWidth,
      mapHeight: props.mapHeight,
      scaleMode: props.scaleMode,
      toggleClick: false,
      addRouteOpen: false,
      routeIsAdd: false,
      mousePathRoutes: {},
      mousePathEye: {},
      viewData: {
        roadNameIsVisible,
        flowIsVisible,
        ...props.data,
        markers: props.data.markers ? props.data.markers : [],
        routes: props.data.routes ? props.data.routes : [],
        roads: props.data.roads ? this.roadSort(props.data.roads) : [],
        texts: props.data.texts ? props.data.texts.map(item => {
          item = { ...textsDefault, ...item }
          return item
        }) : []
      }
    }
  }

  latlngPointScale = (lanlng, mapWidth, mapHeight) => {
    if (polygonTransRect(lanlng)) {
      const [minLng, maxLng, minLat, maxLat] = polygonTransRect(lanlng)
      MinLng = minLng
      MaxLng = maxLng
      MaxLat = maxLat
      MinLat = minLat
      this.line = [
        [[minLng, maxLat], [maxLng, maxLat]],
        [[maxLng, maxLat], [maxLng, minLat]],
        [[maxLng, minLat], [minLng, minLat]],
        [[minLng, minLat], [minLng, maxLat]]
      ]
      xScale = d3.scaleLinear()
        .domain([minLng, maxLng])
        .range([0, mapWidth])
      yScale = d3.scaleLinear()
        .domain([maxLat, minLat])
        .range([0, mapHeight])
    }
  }

  // datav组件需要resize，updateOptions，getThemableConfig，destroy
  resize (width, height) { }

  updateOptions (options) { }

  getThemableConfig (themeConfig) { }

  destroy () { }

  getTextDefaultStyle = () => {
    return this.state.textsDefault
  }

  setResize = (key, value) => {
    this.setState({ [key]: value }, () => {
      this.setMarginAuto()
    })
  }

  setScreenWidth = (screenWidth) => {
    this.setResize('screenWidth', screenWidth)
  }

  setScreenHeight = (screenHeight) => {
    this.setResize('screenHeight', screenHeight)
  }

  setMapWidth = (mapWidth) => {
    this.setResize('mapWidth', mapWidth)
  }

  setMapHeight = (mapHeight) => {
    this.setResize('mapHeight', mapHeight)
  }

  setScaleMode = (scaleMode) => {
    this.setResize('scaleMode', scaleMode)
  }

  setPreview = (preview) => {
    this.setState({ preview }, () => {
      this.openDraggable()
    })
  }

  getCurrentTextId = () => {
    return this.currentTextId
  }

  getInductionData = () => {
    const data = clone(this.state.viewData)
    data.texts.forEach(item => {
      if (item.newX || item.newX === 0) {
        item.x = item.newX
        delete item.newX
      }
      if ((item.newY || item.newY === 0)) {
        item.y = item.newY
        delete item.newY
      }
    })
    data.roads.forEach(road => {
      road.sections.forEach(section => {
        const { start, end } = section
        start[0] = xScale.invert(start[0])
        start[1] = yScale.invert(start[1])
        end[0] = xScale.invert(end[0])
        end[1] = yScale.invert(end[1])
        if (section.newPosition) {
          section.position = section.newPosition
          delete section.newPosition
        }
      })
      road.name.newTexts.forEach(text => {
        const { rid, sectionId, idx } = text
        text.x = this.roadNames[rid][sectionId][idx].x
        text.y = this.roadNames[rid][sectionId][idx].y
        text.fontSize = this.roadNames[rid][sectionId][idx].fontSize
      })
    })
    data.markers.forEach(marker => {
      if (marker.newPositions) {
        marker.positions = marker.newPositions
        delete marker.newPositions
      }
    })
    if (data.direction && data.direction.newPosition) {
      data.direction.position = data.direction.newPosition
      delete data.direction.newPosition
    }
    data.routes.forEach(route => {
      if (route.newArrow && Object.keys(route.newArrow).length) {
        route.arrow = mergeRight(route.arrow, route.newArrow)
        delete route.newArrow
      }
    })
    this.props.getAllData && this.props.getAllData(data)
    return data
  }

  setInductionData = (nextProps) => {
    this.svgFlag = Math.random()
    this.latlngPointScale(nextProps.data.polygon, this.state.mapWidth, this.state.mapHeight)
    this.currentTextId = ''
    this.currentRouteId = ''
    this.currentImageId = ''
    this.currentDomType = ''
    this.roadNames = {}
    this.dragDatas = []
    this.setState({
      toggleClick: false,
      addRouteOpen: false,
      routeIsAdd: false,
      mousePathRoutes: {},
      mousePathEye: {},
      viewData: {
        roadNameIsVisible,
        flowIsVisible,
        ...nextProps.data,
        markers: nextProps.data.markers ? nextProps.data.markers : [],
        routes: nextProps.data.routes ? nextProps.data.routes : [],
        roads: nextProps.data.roads ? this.roadSort(nextProps.data.roads) : [],
        texts: nextProps.data.texts ? nextProps.data.texts.map(item => {
          item = { ...textsDefault, ...item }
          return item
        }) : []
      }
    }, () => {
      this.initEvent()
      this.setForeignStyle()
      this.setMarginAuto()
      this.openDraggable()
    })
  }

  addRoute = ({ open }) => {
    if (!this.state.preview) {
      this.refD3.select('#svgView')
        .attr('cursor', null)
        .on('click', null)
      if (open) {
        const { routes } = this.state.viewData
        this.currentRouteId = Date.now()
        const newRoutes = append({
          id: this.currentRouteId,
          path: [],
          name: '',
          visible: true
        }, routes)
        this.state.viewData.routes = newRoutes
      }
      this.setState({
        addRouteOpen: open,
        routeIsAdd: open,
        viewData: this.state.viewData
      })
    }
  }

  getCurrentRouteId = () => {
    return this.currentRouteId
  }

  getRouteData = ({ routeId }) => {
    if (!this.state.preview) {
      this.currentRouteId = ''
      this.setState({
        addRouteOpen: false,
        routeIsAdd: false
      })
      if (routeId) {
        return this.state.viewData.routes.filter(item => +item.id === +routeId)
      }
      return this.state.viewData.routes
    }
  }

  setEditRouteId = ({ routeId }) => {
    if (!this.state.preview) {
      this.currentRouteId = routeId
      this.refD3.select('#svgView')
        .attr('cursor', null)
        .on('click', null)
      this.setState({
        addRouteOpen: true,
        routeIsAdd: false,
        textEditOpen: false
      })
    }
  }

  delRoute = ({ routeId, pathId }) => {
    const { routes, texts, roads } = this.state.viewData
    if (!this.state.preview) {
      // this.currentRouteId = routeId
      if (pathId) { // 单个path删除
        const findRouteObj = routes.find(item => +item.id === +routeId)
        if (findRouteObj) {
          findRouteObj.path = findRouteObj.path.filter(id => id !== pathId)
          const { path } = findRouteObj
          const sections = roads.map(item => item.sections).flat()
          const findPathObj = sections.find(item => item.sectionId === path[path.length - 1])
          const { start, end } = findPathObj
          findRouteObj.x = start[0] + (end[0] - start[0]) / 2 - (16 / 2)
          findRouteObj.y = start[1] + (end[1] - start[1]) / 2 - (16 / 2)
        }
      } else {
        // this.currentRouteId = ''
        this.state.viewData.routes = routes.filter(item => +item.id !== +routeId)
        this.state.viewData.texts = texts.filter(item => +item.routeId !== +routeId)
      }
      this.setState({
        viewData: this.state.viewData
        // routeIsAdd: false
      })
    }
  }

  setRouteVisible = ({ routeId, visible }) => {
    const { routes, texts } = this.state.viewData
    if (!this.state.preview) {
      const newRoutes = clone(routes)
      const newTexts = clone(texts)
      const routeObj = newRoutes.find(item => +item.id === +routeId)
      const textObj = newTexts.find(item => +item.routeId === +routeId)
      routeObj && (routeObj.visible = visible)
      textObj && (textObj.visible = visible)
      // this.currentRouteId = routeId
      this.state.viewData.routes = newRoutes
      this.state.viewData.texts = newTexts
      this.setState({
        viewData: this.state.viewData
      })
    }
  }

  roadSort (datas) {
    const data = clone(datas)
    const arr = []
    const zIndexArr = uniq(data.sort((a, b) => { // zIndex从小到大排序，去重
      return a.zIndex > b.zIndex ? 1 : -1
    }).map(item => {
      return item.zIndex
    }))
    zIndexArr.forEach(zIndex => {
      arr.push(data.filter(item => {
        return item.zIndex === zIndex
      }).sort((a, b) => { // zIndex相同，level从大到小
        return a.level < b.level ? 1 : -1
      }))
    })
    arr.flat().forEach(item => {
      const { sections } = item
      item.name = { ...roadNameDefault, ...item.name } // roadName有默认配置项
      item.width === undefined && (item.width = roadDefaultWidth)
      if (sections.length > 0) {
        sections.forEach(item => { // visible有默认配置项
          item.visible === undefined && (item.visible = roadDefaultVisible)
          item.start = [+item.start[0], +item.start[1]] // string => number
          item.end = [+item.end[0], +item.end[1]]
          const { start, end } = item
          if (xScale && yScale) {
            const intersect = this.line.map(line => { // 与矩形交点
              return computeLineIntersect([start, end], line)
            }).find(item => { return item.length > 0 })
            if (!(start[0] >= MinLng && start[0] <= MaxLng && start[1] >= MinLat && start[1] <= MaxLat)) { // start不在内
              if (intersect && intersect.length) {
                start[0] = intersect[0]
                start[1] = intersect[1]
              }
            }
            if (!(end[0] >= MinLng && end[0] <= MaxLng && end[1] >= MinLat && end[1] <= MaxLat)) { // end不在内
              if (intersect && intersect.length) {
                end[0] = intersect[0]
                end[1] = intersect[1]
              }
            }
            start[0] = xScale(start[0])
            start[1] = yScale(start[1])
            end[0] = xScale(end[0])
            end[1] = yScale(end[1])
          }
          item.angle = computedRoadAngle(end[0], end[1], start[0], start[1])
        })
      }
      if (!item.name.newTexts) {
        item.name.newTexts = this.computedRoadNamePoi(item)
      } else {
        item.name.newTexts.forEach(text => {
          this.copyRoadNames(text)
        })
      }
    })
    return arr.flat()
  }

  getCurrentRoutePathExist = (sectionId, routeId) => {
    const { routes } = this.state.viewData
    if (routes && routes.length) {
      return routes.some(route => {
        return route.path.some(pathId => {
          if (routeId) {
            if (+routeId === +route.id && pathId === sectionId && route.visible) {
              return true
            }
          } else {
            if (pathId === sectionId && route.visible) {
              return true
            }
          }
        })
      })
    }
    return false
  }

  renderRoad () {
    const { addRouteOpen, routeIsAdd, viewData: { roads, flowIsVisible, routes } } = this.state
    return roads && roads.length && roads.map(item => {
      const { rid, width, sections } = item
      return sections.length > 0 && sections.map((section) => {
        const p = d3.path()
        const { sectionId, start, end, flow, visible } = section
        p.moveTo(start[0], start[1])
        p.lineTo(end[0], end[1])
        const x = start[0] + (end[0] - start[0]) / 2 - (16 / 2)
        const y = start[1] + (end[1] - start[1]) / 2 - (16 / 2)
        const currentRoutePathExist = this.getCurrentRoutePathExist(sectionId)
        return (
          <g
            name='road-path'
            key={`road-${sectionId}`}
          >
            <path
              opacity={visible ? 1 : 0.5}
              stroke={currentRoutePathExist ? '#0094FF' : (flowIsVisible && colorLable[flow]) ? colorLable[flow] : colorLable.E}
              strokeWidth={width}
              fill='none'
              d={p.toString()}
              id={rid}
              name='path-rid'
              onDoubleClick={(road) => {
              }}
              onClick={(e) => {
                if (addRouteOpen && visible) {
                  const currentRoutePathExist = this.getCurrentRoutePathExist(sectionId, this.currentRouteId)
                  if (currentRoutePathExist) {
                    message.error('该path已存在当前路线中或者其余路线中，请重新选择')
                  } else {
                    const { routes } = this.state.viewData
                    const findObj = routes.find(item => +item.id === +this.currentRouteId)
                    if (findObj) {
                      findObj.path = append(sectionId, findObj.path)
                      findObj.x = x
                      findObj.y = y
                      if (routeIsAdd && findObj.path.length === 1) {
                        this.props.getAddRouteData && this.props.getAddRouteData(findObj)
                      }
                      this.setState({
                        viewData: this.state.viewData
                      })
                    }
                  }
                }
              }}
              onMouseOver={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (addRouteOpen) {
                  let flag = false
                  if (this.currentRouteId) {
                    const currentEditRoute = routes.find(route => route.id === this.currentRouteId)
                    flag = currentEditRoute.path.includes(sectionId)
                  }
                  if (visible && !flag) {
                    this.setState({
                      mousePathRoutes: {
                        x: this.mousePoi[0] + 15,
                        y: this.mousePoi[1] - 10,
                        tips: '添加诱导路段'
                      }
                    })
                  }
                }
              }}
              onMouseMove={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (addRouteOpen) {
                  let flag = false
                  if (this.currentRouteId) {
                    const currentEditRoute = routes.find(route => route.id === this.currentRouteId)
                    flag = currentEditRoute.path.includes(sectionId)
                  }
                  if (visible && !flag) {
                    this.setState({
                      mousePathRoutes: {
                        x: this.mousePoi[0] + 15,
                        y: this.mousePoi[1] - 10,
                        tips: '添加诱导路段'
                      }
                    })
                  }
                }
              }}
              onMouseOut={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (addRouteOpen) {
                  this.setState({
                    mousePathRoutes: {}
                  })
                }
              }}
            />
            {
              !this.state.preview && (
                <foreignObject x={x} y={y} style={{ overflow: 'visible' }}>
                  {
                    currentRoutePathExist
                      ? this.renderMousePathDelIcon(sectionId)
                      : this.renderMousePathEye(rid, sectionId, visible)
                  }
                </foreignObject>
              )
            }
          </g>
        )
      })
    }).flat()
  }

  renderMousePathDelIcon (sectionId) {
    if (this.state.addRouteOpen && this.getCurrentRoutePathExist(sectionId, this.currentRouteId)) {
      return (
        <div
          className='path-eye-action'
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            const { addRouteOpen } = this.state
            if (addRouteOpen) { // 编辑态打开
              this.delRoute({ routeId: this.currentRouteId, pathId: sectionId })
            } else { // 编辑态未打开
              console.log('del 编辑态未打开')
            }
          }}
          onMouseEnter={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (this.state.addRouteOpen) {
              this.setState({
                mousePathRoutes: {
                  x: this.mousePoi[0] + 15,
                  y: this.mousePoi[1] - 10,
                  tips: '删除诱导路段'
                }
              })
            }
          }}
          onMouseLeave={(e) => {
            e.stopPropagation()
            e.preventDefault()
            if (this.state.addRouteOpen) {
              this.setState({
                mousePathRoutes: {}
              })
            }
          }}
        >
          <svg viewBox='0 0 1024 1024' width='16' height='16'>
            <path d='M341.312 85.312l64-85.312h213.376l64 85.312H960v85.376H64V85.312h277.312zM170.688 256h682.624v768H170.688V256z m298.624 170.688H384v426.624h85.312V426.688z m170.688 0H554.688v426.624H640V426.688z' fill='#fff' />
          </svg>
        </div>
      )
    }
  }

  renderMousePathEye (rid, sectionId, visible) {
    const { mousePathEye } = this.state
    return (
      <div
        className='path-eye-action'
        onClick={(e) => {
          this.setPathIsVisible(rid, sectionId, !visible)
        }}
        onMouseEnter={(e) => {
          e.stopPropagation()
          e.preventDefault()
          this.setState({
            mousePathEye: {
              rid,
              sectionId,
              hover: true
            }
          })
        }}
        onMouseLeave={(e) => {
          e.stopPropagation()
          e.preventDefault()
          this.setState({
            mousePathEye: {
              rid,
              sectionId,
              hover: false
            }
          })
        }}
      >
        {
          visible
            ? (
              <svg viewBox='0 0 1024 1024' width='16' height='16'>
                <path d='M246.4 258.304l-83.84-83.84 46.464-46.4L309.12 228.288A543.04 543.04 0 0 1 512 190.72c211.968 0 382.592 107.136 512 321.28-58.688 98.56-126.464 174.464-203.456 227.648l109.888 109.888-46.4 46.4-121.408-121.408a517.504 517.504 0 0 1-1.088 0.576l-68.224-68.224 1.216-0.512-117.312-117.312-0.896 0.832L435.2 448.832l0.768-0.96L313.6 325.376a435.968 435.968 0 0 0-1.152 0.576L245.376 258.944l1.088-0.64z m509.248 416.448c60.8-37.76 115.456-91.712 164.48-162.432-108.736-155.136-242.88-229.76-408.128-229.76-46.08 0-89.728 5.76-131.072 17.472l112.32 112.32c6.144-1.28 12.48-1.92 19.008-1.92 54.272 0 98.368 45.696 98.368 102.016 0 5.44-0.448 10.816-1.28 16l146.304 146.304z m-566.4-379.2L253.44 359.808c-54.592 37.12-104.32 87.808-149.632 152.512 107.2 154.688 241.28 229.12 408.128 229.12 38.72 0 75.712-3.968 111.04-12.096l73.6 73.6A553.984 553.984 0 0 1 512 833.28c-213.888 0-384.512-107.136-512-321.28 55.488-91.84 118.592-163.968 189.248-216.448zM508.032 614.4L414.144 520.448c3.84 51.2 44.096 91.776 93.888 93.952z' fill='#ffffff' />
              </svg>
            )
            : (
              <svg viewBox='0 0 1024 1024' width='16' height='16'>
                <path d='M512 283.456c-165.248 0-299.392 74.304-408.128 228.864 107.2 154.112 241.28 228.224 408.128 228.224 166.848 0 300.928-74.112 408.128-228.224C811.392 357.76 677.248 283.52 512 283.52zM512 832c-213.888 0-384.512-106.688-512-320 129.408-213.312 300.032-320 512-320 211.968 0 382.592 106.688 512 320-127.488 213.312-298.112 320-512 320z m0-137.152a182.848 182.848 0 1 0 0-365.696 182.848 182.848 0 0 0 0 365.696zM512 576a64 64 0 1 1 0-128 64 64 0 0 1 0 128z' fill='#fff' />
              </svg>
            )
        }
        {
          mousePathEye.hover && mousePathEye.rid === rid && mousePathEye.sectionId === sectionId &&
          (
            <div className='path-eye-tips-content'>
              <p className='path-eye-tips'>{visible ? '点击隐藏，诱导屏中不显示此道路' : '点击显示，诱导屏中将显示此道路'}</p>
              <p className='path-eye-tips-arrow' />
            </div>
          )
        }
      </div>
    )
  }

  renderMousePoiTips () {
    const { x, y, tips } = this.state.mousePathRoutes
    return x && y && (
      <foreignObject x={x} y={y} style={{ overflow: 'visible' }}>
        <div className='path-routes-action'>{tips}</div>
      </foreignObject>
    )
  }

  setPathIsVisible (rid, sectionId, visible) {
    const { roads } = this.state.viewData
    if (!this.state.preview) {
      const newRoads = clone(roads)
      const index = newRoads.findIndex(item => item.rid === rid)
      const findObj = newRoads[index].sections.find(section => section.sectionId === sectionId)
      findObj && (findObj.visible = visible)
      this.state.viewData.roads = newRoads
      this.setState({
        viewData: this.state.viewData
      })
    }
  }

  pathSplitText = (allText, pathLength) => {
    const int = parseInt(allText.length / pathLength)
    const flot = allText.length % pathLength
    const texts = []
    let count = 0
    for (let i = 0; i < pathLength; i++) {
      if (flot === 0) {
        texts.push(allText.slice(i * int, (i + 1) * int))
      } else {
        if (i < flot) {
          texts.push(allText.slice(count, count + (int + 1)))
          count = count + (int + 1)
        } else {
          texts.push(allText.slice(count, count + int))
          count = count + int + 1
        }
      }
    }
    return texts
  }

  computedRoadNamePoi = (road) => {
    const { rid, sections, width, name: { text, fontSize, letterSpacing } } = road
    const pathLength = sections.length
    return sections.map((section, secIdx) => {
      const { start, end, sectionId, angle } = section
      const dx = end[0] - start[0]
      const dy = end[1] - start[1]
      const dist = Math.sqrt(dx * dx + dy * dy)
      const allText = splitRoadName(text)
      // if (angle === 180 || angle === 270) { // 路名反转
      //   allText = this.splitRoadName(text).reverse()
      // }
      if (pathLength === 1) { // 一个path显示所有文本
        const textLength = allText.length * fontSize - (allText.length - 1) * letterSpacing
        const half = (dist - textLength) / 2
        return allText.length && allText.map((str, idx) => {
          let x = 0
          let y = 0
          if (dx === 0) { // y方向
            x = dy > 0 ? start[0] : end[0]
            const t = dy > 0 ? start[1] : end[1]
            y = t + half + idx * (fontSize + letterSpacing) + fontSize / 2
          } else if (dy === 0) { // x方向
            const t = dx > 0 ? start[0] : end[0]
            x = t + half + idx * (fontSize + letterSpacing) + fontSize / 2
            y = dx > 0 ? start[1] : end[1]
          } else { // k
            const poi = computedSlopeRoadNamePoi({ start, end, half, angle, idx, textLength, fontSize, letterSpacing })
            x = poi.x
            y = poi.y
          }
          x = x - Math.sin(Math.PI / 180 * angle) * width
          y = y + Math.cos(Math.PI / 180 * angle) * width
          this.copyRoadNames({ rid, sectionId, idx, x, y, str, fontSize })
          return { rid, sectionId, idx, x, y, str }
        }).flat()
      } else if (pathLength >= allText.length) { // 一个path显示一个文本，多余path不显示
        const half = (dist - 1 * fontSize) / 2
        if (allText[secIdx]) {
          let x = 0
          let y = 0
          if (dx === 0) { // y方向
            x = dy > 0 ? start[0] : end[0]
            y = dy > 0 ? start[1] + half : end[1] + half
          } else if (dy === 0) { // x方向
            x = dx > 0 ? start[0] + half : end[0] + half
            y = dx > 0 ? start[1] : end[1]
          } else { // k
            const scale = half / dist
            x = angle >= 0 && angle < 180
              ? start[0] + scale * dx
              : end[0] + scale * dx
            y = angle >= 0 && angle < 180
              ? start[1] + scale * dy
              : end[1] + scale * dy
          }
          x = x - Math.sin(Math.PI / 180 * angle) * width
          y = y - Math.cos(Math.PI / 180 * angle) * width
          this.copyRoadNames({ rid, sectionId, idx: 0, x, y, str: allText[secIdx], fontSize })
          return { rid, sectionId, idx: 0, x, y, str: allText[secIdx] }
        }
        return null
      } else { // 一个path显示多个文本，其余文本显示在另外的path上
        const newAllText = this.pathSplitText(allText, pathLength)
        const textLength = newAllText[secIdx].length
        return newAllText[secIdx] && newAllText[secIdx].map((str, idx) => {
          let x = 0
          let y = 0
          const half = (dist - newAllText[secIdx].length * fontSize - (newAllText[secIdx].length - 1) * letterSpacing) / 2
          if (dx === 0) { // y方向
            x = dy > 0 ? start[0] : end[0]
            const t = dy > 0 ? start[1] : end[1]
            y = t + half + idx * (fontSize + letterSpacing) + fontSize / 2
          } else if (dy === 0) { // x方向
            const t = dx > 0 ? start[0] : end[0]
            x = t + half + idx * (fontSize + letterSpacing) + fontSize / 2
            y = dx > 0 ? start[1] : end[1]
          } else { // k
            const poi = computedSlopeRoadNamePoi({ start, end, half, angle, idx, textLength, fontSize, letterSpacing })
            x = poi.x
            y = poi.y
          }
          x = x + Math.sin(Math.PI / 180 * angle) * width
          y = y - Math.cos(Math.PI / 180 * angle) * width
          this.copyRoadNames({ rid, sectionId, idx, x, y, str, fontSize })
          return { rid, sectionId, idx, x, y, str }
        }).flat()
      }
    }).flat()
  }

  copyRoadNames = ({ rid, sectionId, idx, x, y, str, fontSize }) => {
    if (this.roadNames[rid]) {
      if (this.roadNames[rid][sectionId]) {
        this.roadNames[rid][sectionId][idx] = { x, y, str, fontSize }
      } else {
        this.roadNames[rid][sectionId] = {}
        this.roadNames[rid][sectionId][idx] = { x, y, str, fontSize }
      }
    } else {
      this.roadNames[rid] = {}
      this.roadNames[rid][sectionId] = {}
      this.roadNames[rid][sectionId][idx] = { x, y, str, fontSize }
    }
  }

  renderRoadName () {
    const { roadNameIsVisible, roads } = this.state.viewData
    return roads.map(road => {
      const { name: { newTexts, color, fontSize, fontFamily, letterSpacing }, sections, rid } = road
      return sections.map((section, idx) => {
        const { sectionId, visible, position = [0, 0] } = section
        const nameVisible = roadNameIsVisible && visible ? 'block' : 'none'
        return (
          <g
            data-draggable
            name='road-name'
            key={`roadName_${rid}_${sectionId}_${idx}`}
            id={`roadName_${rid}_${sectionId}_${idx}`}
            transform={`translate(${position[0]} ${position[1]})`}
            style={{ display: nameVisible }}
          >
            <text
              name='road-name-text'
              style={{
                fill: color,
                fontSize,
                fontFamily,
                letterSpacing,
                textAnchor: 'middle',
                dominantBaseline: 'middle'
              }}
            >
              {
                newTexts.length && newTexts.filter(item => item.sectionId === sectionId).map(text => {
                  const { rid, sectionId, idx, x, y, str } = text
                  return (
                    <tspan
                      x={x}
                      y={y}
                      name='road-name-tspan'
                      key={`roadName_${rid}_${sectionId}_${idx}`}
                    >
                      {str}
                    </tspan>
                  )
                })
              }
            </text>
          </g>
        )
      })
    }).flat()
  }

  renderRouteArrow () {
    const { routes, roads } = this.state.viewData
    const sections = roads.map(item => { return item.sections }).flat()
    return routes.map(item => {
      const { id, path, visible, arrow } = item
      return path.map((pathId, pathIdx) => {
        const findObj = sections.find(section => section.sectionId === pathId)
        const { start, end, angle } = findObj
        const x = start[0] + (end[0] - start[0]) / 2
        const y = start[1] + (end[1] - start[1]) / 2
        let transform = {}
        if (arrow && arrow[pathId]) {
          transform = { transform: `translate(${arrow[pathId][0]} ${arrow[pathId][1]})` }
        }
        return (
          <g
            data-draggable
            {...transform}
            name='route-arrow'
            key={`route_${id}_${pathId}`}
            id={`${id}_${pathId}`}
            style={{ display: visible ? 'block' : 'none' }}
          >
            <use xlinkHref='#arrow' x={x - 10} y={y} width={20} height={32} name='routeArrow' transform={`rotate(${angle} ${x} ${y})`} />
          </g>
        )
      })
    }).flat()
  }

  renderLocation () { // 当前所在地理位置
    const { markers } = this.state.viewData
    const hereMarker = (markers && markers.length) ? markers.find(item => item.type === 'HERE') : {}
    const currentObj = { ...hereDefault, ...hereMarker }
    if (currentObj && currentObj.positions) {
      const { positions, color, fontSize, fontFamily, letterSpacing, text, type } = currentObj
      return (
        <g data-draggable name='marker-group' id={`marker-${type}`} transform={`translate(${positions[0]} ${positions[1]})`}>
          <use xlinkHref='#here' x={0} y={0} name='here' />
          <text
            x={0}
            y={50}
            style={{
              fill: color,
              fontSize,
              fontFamily,
              letterSpacing
            }}
            name='here'
          >
            {text}
          </text>
        </g>
      )
    }
  }

  renderDirection () {
    const { direction } = this.state.viewData
    if (direction && direction.position) {
      const { name, position } = direction
      return (
        <g data-draggable name='direction-group' transform={`translate(${position[0]} ${position[1]})`}>
          <use xlinkHref='#direction' x={-14} y={8} name='direction' />
          <text style={{ fill: 'gold', transform: 'translate(3px, 18px)' }} name='direction'>
            {directionLable[name]}
          </text>
        </g>
      )
    }
  }

  renderTexts () {
    const { texts } = this.state.viewData
    return texts && texts.length && texts.map((item, index) => {
      const { id, x, y, text, color, fontSize, fontFamily, letterSpacing, backgroundColor, contentEditable, canDelete, visible } = item
      const borderColor = +this.currentTextId === +id ? '#999' : 'transparent'
      return (
        <foreignObject data-draggable key={id} name='text-group' transform={`translate(${x} ${y})`} id={`text-group-foreign-${id}`} style={{ overflow: 'visible' }}>
          <div
            id={`text-plugin-${id}`}
            name='texts'
            candelete={canDelete.toString()}
            suppressContentEditableWarning
            contentEditable={contentEditable}
            tabIndex='0'
            style={{
              display: visible ? 'block' : 'none',
              width: 'max-content',
              minWidth: 24,
              minHeight: 20,
              color,
              fontSize,
              fontFamily,
              letterSpacing,
              outline: 'none',
              padding: '2px 2px',
              border: `dashed 1px ${borderColor}`,
              backgroundColor
            }}
            dangerouslySetInnerHTML={{ __html: text }}
            onFocus={e => {
              if (!this.state.preview) {
                this.props.getTextStyle && this.props.getTextStyle(this.state.viewData.texts[index])
              }
            }}
            onInput={e => {
              const { width, height } = document.getElementById(`text-plugin-${id}`).getBoundingClientRect()
              document.getElementById(`text-group-foreign-${id}`).setAttribute('width', width)
              document.getElementById(`text-group-foreign-${id}`).setAttribute('height', height)
            }}
            onBlur={(e) => {
              const { texts } = this.state.viewData
              const textHtml = document.getElementById(`text-plugin-${id}`).innerHTML
              const index = texts.findIndex(item => item.id === id)
              this.currentTextId = ''
              if (textHtml) {
                this.state.viewData.texts[index].text = textHtml
                this.state.viewData.texts[index].contentEditable = false
                this.openDraggable()
              } else {
                this.delText(id)
              }
              this.props.resetAddText && this.props.resetAddText()
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              const findObj = this.state.viewData.texts.find(item => item.id === id)
              if (!this.state.preview && findObj.canEdit) { // 非预览状态+可编辑
                findObj.contentEditable = true
                this.domSelection(document.getElementById(`text-plugin-${id}`))
                this.setState({
                  toggleClick: false
                })
              }
            }}
          />
        </foreignObject>
      )
    })
  }

  renderImages () {
    const { images = [] } = this.state.viewData
    return images.reduce((p, c, i, a) => {
      const { src: href, size: [width, height], position: [x, y] } = c
      p.push(
        <image
          key={`image${i}`}
          {...{ href, width, height, x, y }}
          onClick={() => {
            this.currentImageId = `image-${i}`
            this.currentDomType = 'images'
          }}
        />
      )
      return p
    }, [])
  }

  addImage ({ src, size, position }) {
    if (!this.state.preview) {
      const { images = [] } = this.state.viewData
      const newImages = append({ src, size, position }, images)
      this.state.viewData.images = newImages
      this.setState({
        viewData: this.state.viewData
      })
    }
  }

  removeImage (idx) {
    if (!this.state.preview) {
      const { images = [] } = this.state.viewData
      const newImages = remove(idx, 1, images)
      this.state.viewData.images = newImages
      this.currentImageId = ''
      this.setState({
        viewData: this.state.viewData
      })
    }
  }

  setMarginAuto () {
    const { screenWidth, screenHeight, mapWidth, mapHeight, scaleMode, viewData: { translates } } = this.state
    this.refD3.select('#svgView')
      .attr('transform', null)
    this.refD3.select('#mapView')
      .attr('transform', null)
    if (scaleMode === 'SHOW_ALL') {
      this.refD3.select('#svgView')
        .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`)
        .attr('preserveAspectRatio', 'none')
      const rootSVGSize = this.refD3.select('#svgView').node().getBoundingClientRect()
      const mapViewSize = this.refD3.select('#mapView').node().getBoundingClientRect()
      const widthScale = mapWidth / mapViewSize.width
      const heightScale = mapHeight / mapViewSize.height
      const x = translates ? translates[0] : (rootSVGSize.width - mapViewSize.width) / 2 * widthScale
      const y = translates ? translates[1] : (rootSVGSize.height - mapViewSize.height) / 2 * heightScale
      this.refD3.select('#mapView')
        .attr('transform', `translate(${x}, ${y})`)
    } else if (scaleMode === 'EXACT_FIT') {
      this.refD3.select('#svgView')
        .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
      const widthScale = screenWidth / mapHeight
      const heightScale = screenHeight / mapHeight
      const minScale = widthScale > heightScale ? heightScale : widthScale
      const rootSVGSize = this.refD3.select('#svgView').node().getBoundingClientRect()
      const mapViewSize = this.refD3.select('#mapView').node().getBoundingClientRect()
      const x = translates ? translates[0] : (rootSVGSize.width - mapViewSize.width) / 2 / minScale
      const y = translates ? translates[1] : (rootSVGSize.height - mapViewSize.height) / 2 / minScale
      this.refD3.select('#mapView')
        .attr('transform', `translate(${x}, ${y})`)
    } else {
      const rootSVGSize = this.refD3.select('#svgView').node().getBoundingClientRect()
      const mapViewSize = this.refD3.select('#mapView').node().getBoundingClientRect()
      const x = translates ? translates[0] : (rootSVGSize.width - mapViewSize.width) / 2
      const y = translates ? translates[1] : (rootSVGSize.height - mapViewSize.height) / 2
      this.refD3.select('#mapView')
        .attr('transform', `translate(${x}, ${y})`)
    }
  }

  setForeignStyle = () => {
    const self = this
    this.refD3.selectAll('[name=texts]').each(function () {
      const { width, height } = this.getBoundingClientRect()
      const id = this.id.replace('plugin', 'group-foreign')
      self.refD3.select(`#${id}`)
        .attr('width', width)
        .attr('height', height)
    })
  }

  componentDidMount () {
    this.refD3 = d3.select(this.containerRef)
    this.setForeignStyle()
    this.setMarginAuto()
    this.openDraggable()
    this.initEvent()
    document.addEventListener('keydown', this.onDeleteKeyDown)
    window.addEventListener('click', this.setToggleClick.bind(this))
  }

  initEvent () {
    const self = this
    this.refD3.select('#svgView')
      .on('mousemove', function () {
        self.mousePoi = d3.mouse(this)
      })
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.onDeleteKeyDown, false)
    window.removeEventListener('click', this.setToggleClick, false)
    this.addText({ open: false })
  }

  getTranslateAll = (string) => {
    const reg = /translate\((.*?)\)/g
    const translateList = string.match(reg)
    let x = 0
    let y = 0
    translateList.forEach(item => {
      item = item.replace(/\s+/g, ' ').trim()
      const leftIndex = item.indexOf('(') + 1
      const rightIndex = item.indexOf(')')
      const translate = item.substring(leftIndex, rightIndex).split(' ')
      x += parseFloat(translate[0])
      y += parseFloat(translate[1])
    })
    return { x, y }
  }

  openDraggable () {
    const self = this
    if (!this.state.preview) { // 非预览状态
      this.dragDatas = []
      this.refD3.selectAll('[data-draggable]').each(function () {
        const dragItem = new PlainDraggable(this)
        self.dragDatas.push(dragItem)
        dragItem.onDragStart = function () {
          const dragType = dragItem.handle.getAttribute('name')
          const dragId = dragItem.handle.getAttribute('id')
          if (dragType === 'text-group') {
            const { texts } = self.state.viewData
            const index = texts.findIndex(item => item.id === +(dragId.split('-').pop()))
            if (index > -1 && texts[index].contentEditable) { // 编辑状态，禁止拖拽
              self.currentTextId = +(dragId.split('-').pop())
              return false
            } else {
              texts.forEach(item => {
                if (item.id !== +(dragId.split('-').pop())) {
                  item.contentEditable = false
                  document.getElementById(`text-plugin-${item.id}`).blur()
                }
              })
              self.currentTextId = +(dragId.split('-').pop())
              self.setState({
                viewData: self.state.viewData
              })
              self.props.getTextStyle && self.props.getTextStyle(self.state.viewData.texts[index])
            }
          } else { // 清空所有文本状态
            self.resetAllTextStatus()
          }
        }
        dragItem.onDragEnd = function (newPosition) {
          const dragType = dragItem.handle.getAttribute('name')
          const dragId = dragItem.handle.getAttribute('id')
          if (dragType === 'text-group') {
            const { texts } = self.state.viewData
            const index = texts.findIndex(item => item.id === +(dragId.split('-').pop()))
            if (index > -1) {
              self.state.viewData.texts[index].contentEditable = false
              const translates = dragItem.handle.getAttribute('transform')
              const translateAll = self.getTranslateAll(translates)
              self.state.viewData.texts[index].newX = translateAll.x
              self.state.viewData.texts[index].newY = translateAll.y
              self.currentTextId = +(dragId.split('-').pop())
              self.currentDomType = 'text-group'
            }
          } else if (dragType === 'direction-group') {
            const translates = dragItem.handle.getAttribute('transform')
            const translateAll = self.getTranslateAll(translates)
            self.state.viewData.direction.newPosition = [translateAll.x, translateAll.y]
          } else if (dragType === 'mapView') {
            const translates = dragItem.handle.getAttribute('transform')
            const translateAll = self.getTranslateAll(translates)
            self.state.viewData.translates = [translateAll.x, translateAll.y]
          } else if (dragType === 'road-name') {
            const ids = dragId.split('_')
            const { roads } = self.state.viewData
            const ridIndex = roads.findIndex(road => road.rid === ids[1])
            const sectionIndex = roads[ridIndex].sections.findIndex(section => section.sectionId === ids[2])
            const translates = dragItem.handle.getAttribute('transform')
            const translateAll = self.getTranslateAll(translates)
            self.state.viewData.roads[ridIndex].sections[sectionIndex].newPosition = [translateAll.x, translateAll.y]
          } else if (dragType === 'marker-group') {
            const { markers } = self.state.viewData
            const index = markers.findIndex(item => item.type === dragId.split('-').pop())
            const translates = dragItem.handle.getAttribute('transform')
            const translateAll = self.getTranslateAll(translates)
            self.state.viewData.markers[index].newPositions = [translateAll.x, translateAll.y]
          } else if (dragType === 'route-arrow') {
            const { routes } = self.state.viewData
            const [routeId, pathId] = dragId.split('_')
            const findObj = routes.find(item => item.id === +routeId)
            if (findObj) {
              const translates = dragItem.handle.getAttribute('transform')
              const translateAll = self.getTranslateAll(translates)
              !findObj.newArrow && (findObj.newArrow = {})
              findObj.newArrow[pathId] = [translateAll.x, translateAll.y]
            }
          }
        }
      })
    } else { // 移除拖拽事件,但位置不更新
      this.dragDatas.forEach(dragItem => {
        dragItem.remove()
      })
    }
  }

  onDeleteKeyDown = (e) => {
    if (!this.state.preview) {
      if (e.keyCode === 8 || e.keyCode === 46) { // backspace或者delete键
        if (this.currentDomType === 'text-group') {
          const dom = this.refD3.select(`#text-plugin-${this.currentTextId}`).node()
          if (dom && JSON.parse(dom.getAttribute('candelete'))) { // 'true'转true, 可删除
            const contentEditable = dom.getAttribute('contentEditable')
            if (!JSON.parse(contentEditable)) { // 'false'转false,非编辑态可删除
              const { texts } = this.state.viewData
              this.props.onDeleteKeyDown && this.props.onDeleteKeyDown(texts.find(item => +item.id === +this.currentTextId))
              this.delText(this.currentTextId)
              this.currentDomType = ''
            }
          }
        } else if (this.currentDomType === 'images') {
          this.currentImageId && this.removeImage(this.currentImageId.split('-')[1])
          this.currentDomType = ''
        }
      }
    }
  }

  handleSaveJpg = () => {
    domtoimage.toJpeg(document.getElementById('vis'), { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement('a')
        link.download = 'my-image-name.jpeg'
        link.href = dataUrl
        link.click()
      })
  }

  setToggleClick () {
    this.setState({
      toggleClick: true
    })
  }

  resetAllTextStatus = () => {
    const { texts } = this.state.viewData
    texts.length && texts.forEach(item => {
      item.contentEditable = false
      const dom = document.getElementById(`text-plugin-${item.id}`)
      dom && (dom.blur())
    })
    this.setState({
      toggleClick: true,
      viewData: this.state.viewData
    })
  }

  setRoadNameVisible = ({ visible }) => {
    if (!this.state.preview) {
      this.state.viewData.roadNameIsVisible = visible
      this.setState({
        viewData: this.state.viewData
      })
    }
  }

  setFlowVisible = ({ visible }) => {
    if (!this.state.preview) {
      this.state.viewData.flowIsVisible = visible
      this.setState({
        viewData: this.state.viewData
      })
    }
  }

  addText = ({ open }) => {
    if (!this.state.preview) {
      this.setState({
        textEditOpen: open,
        toggleClick: true,
        addRouteOpen: false
      })
      if (open) {
        this.editText()
      } else {
        this.refD3.select('#svgView')
          .attr('cursor', null)
          .on('click', null)
      }
    }
  }

  setTextStyle = ({ id, style }) => {
    if (!this.state.preview) {
      if (id) {
        const { texts } = this.state.viewData
        const index = texts.findIndex(item => +item.id === +id)
        texts[index] = { ...texts[index], ...style }
        this.setState({
          viewData: this.state.viewData,
          textsDefault: { ...this.state.textsDefault, ...style }
        })
      }
    }
  }

  setTextsDefaultStyle = (style) => {
    this.setState({
      textsDefault: mergeRight(this.state.textsDefault, style)
    })
  }

  domSelection = (dom) => {
    dom.focus()
    const range = document.createRange()
    range.selectNodeContents(dom)
    range.collapse(false)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }

  editText = () => {
    const self = this
    this.refD3.select('#svgView')
      .attr('cursor', 'crosshair')
      .on('click', function () {
        const { textEditOpen, toggleClick, viewData: { texts } } = self.state
        if (textEditOpen) { // 文本编辑打开
          d3.event.stopPropagation()
          d3.event.preventDefault()
          const { target } = d3.event
          const id = Date.now()
          const targetType = target.getAttribute('name')
          const targetId = target.getAttribute('id')
          if (targetType === 'svgView') { // 空白地方
            if (toggleClick) { // 插入
              if (!texts.find(item => item.id === +(targetId.split('-').pop()))) {
                self.currentTextId = id
                self.state.viewData.texts.push({
                  id,
                  text: '',
                  x: d3.mouse(this)[0],
                  y: d3.mouse(this)[1],
                  ...self.state.textsDefault,
                  contentEditable: true,
                  canDelete: true,
                  canEdit: true
                })
                self.setState({
                  viewData: self.state.viewData,
                  toggleClick: false
                }, () => {
                  document.getElementById(`text-plugin-${id}`).focus()
                })
              }
            } else { // 不插入
              self.setState({
                toggleClick: true
              })
            }
          }
        }
      })
  }

  delText = (id) => {
    const { texts } = this.state.viewData
    if (!this.state.preview) {
      this.state.viewData.texts = texts.filter(item => item.id !== id)
      this.currentTextId = ''
      this.setState({
        viewData: this.state.viewData
      }, () => {
        this.openDraggable()
      })
    }
  }

  insertText = (data) => {
    const { texts } = this.state.viewData
    if (!this.state.preview) {
      const findObj = texts.find(item => +item.routeId === +data.routeId)
      if (findObj) { // 更新
        findObj.text = data.text
      } else { // 插入
        this.state.viewData.texts = append(data, texts)
      }
      this.setState({
        viewData: this.state.viewData
      }, () => {
        this.openDraggable()
      })
    }
  }

  render () {
    const { screenWidth, screenHeight, mapWidth, mapHeight, scaleMode } = this.state
    return (
      <div ref={el => { this.containerRef = el }}>
        <div id='vis' key={this.svgFlag} style={{ background: this.props.background, width: screenWidth, height: screenHeight, float: 'left' }}>
          <svg id='svgView' width={screenWidth} height={screenHeight} name='svgView'>
            <g name='mapView' id='mapView' data-draggable>
              {this.renderRoad()}
              {this.renderLocation()}
              {this.renderRouteArrow()}
              {this.renderRoadName()}
            </g>
            {this.renderMousePoiTips()}
            {this.renderDirection()}
            {this.renderTexts()}
            <g id='images' name='images'>
              {this.renderImages()}
            </g>
            <symbol id='here' viewBox='0 0 3036 3036' width='165' height='155'>
              <path d='M512 384l-256 256h512z' fill='#ffffff' />
            </symbol>
            <symbol id='direction' viewBox='0 0 4048 4048' width='200' height='200'>
              <path d='M508.4 450.1l1.8-1.8-1.8 1.8zM508.2 448.1l2.2 2.2c-0.7-0.8-1.4-1.5-2.2-2.2zM511.1 411l1.8 1.8-1.8-1.8z' fill='#90ee90' />
              <path d='M510.9 413l2.2-2.2c-0.8 0.7-1.5 1.4-2.2 2.2z' fill='#90ee90' />
              <path d='M544 374.7v336c0 17.6-14.4 32-32 32s-32-14.4-32-32v-336c0-17.6 14.4-32 32-32s32 14.4 32 32z' fill='#90ee90' />
              <path d='M511.9 281.3c-8.3 0-15.8 3.1-21.5 8.3l-2.2 2.2-21.5 21.5L291 489c-12.4 12.4-12.4 32.8 0 45.3 12.4 12.4 32.8 12.4 45.3 0L512 358.5l175.8 175.7c12.4 12.4 32.8 12.4 45.3 0 12.4-12.4 12.4-32.8-0.1-45.2L557.3 313.3l-21.8-21.8-1.8-1.8c-5.7-5.3-13.4-8.5-21.8-8.4z' fill='#90ee90' />
            </symbol>
            <symbol id='arrow' viewBox='0 0 1024 1024' width='32' height='32'>
              <path d='M6.71115421 489.90890885l662.73273745-1e-8L669.44389165 551.27305136 6.71115421 551.27305136l2e-8-61.36414251z' fill='#56FF03' />
              <path d='M665.71307852 306.28092891L1022.56779958 515.86227332l-356.85472106 215.24570478 0-424.82704919z' fill='#56FF03' />
            </symbol>
          </svg>
        </div>
        {
          this.props.debug && (
            <div>
              <div>screenWidth: {screenWidth}, screenHeight: {screenHeight}</div>
              <div>contentWidth: {mapWidth},  contentHeight: {mapHeight}</div>
              <div>
                svg设置:
                {
                  scaleMode === 'SHOW_ALL'
                    ? `viewBox='0 0 ${mapWidth} ${mapHeight}' preserveAspectRatio='none'`
                    : scaleMode === 'EXACT_FIT'
                      ? `viewBox='0 0 ${mapWidth} ${mapHeight}' preserveAspectRatio='xMidYMid meet'`
                      : '无viewBox preserveAspectRatio'
                }
              </div>
              <div onClick={() => { this.addRoute({ open: true }) }}>添加路线</div>
              <div
                onClick={() => {
                  console.log('当前路径信息为===>', this.getRouteData({ routeId: this.getCurrentRouteId() }))
                  this.getRouteData({ routeId: this.getCurrentRouteId() })
                }}
              >
                保存正在添加或绘制的路线信息
              </div>
              <div onClick={() => { this.addText({ open: true }) }}>添加文本</div>
              <div
                onClick={() => {
                  this.setTextStyle({ id: this.getCurrentTextId(), style: { letterSpacing: 6 } })
                }}
              >
                更改字体间距为6
              </div>
              <div
                onClick={() => {
                  this.setTextStyle({ id: this.getCurrentTextId(), style: { fontSize: 24 } })
                }}
              >
                更改字体大小为24
              </div>
              <div
                onClick={() => {
                  this.setTextStyle({ id: this.getCurrentTextId(), style: { color: '#f00' } })
                }}
              >
                更改颜色为红色
              </div>
              <div
                onClick={() => {
                  this.setTextStyle({ id: this.getCurrentTextId(), style: { backgroundColor: '#0f0' } })
                }}
              >
                更改背景色为绿色
              </div>
              <div
                onClick={() => {
                  this.addImage({
                    src: 'http://via.placeholder.com/30',
                    size: [30, 30],
                    position: [66, 100]
                  })
                }}
              >
                添加图片
              </div>
              <div
                onClick={() => {
                  this.insertText({
                    id: 4,
                    text: '40分钟',
                    x: 144,
                    y: 107,
                    color: '#000',
                    fontSize: 18,
                    fontFamily: 'SimSun',
                    letterSpacing: 0,
                    backgroundColor: '#fff',
                    canDelete: false
                  })
                }}
              >
                插入文本
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
Induction.defaultProps = {
  ...svgDefault,
  textsDefault,
  debug: true,
  preview: true,
  data: {}
}
Induction.propTypes = {
  screenWidth: PropTypes.number,
  screenHeight: PropTypes.number,
  mapWidth: PropTypes.number,
  mapHeight: PropTypes.number,
  background: PropTypes.string,
  scaleMode: PropTypes.string,
  data: PropTypes.object,
  polygon: PropTypes.string,
  debug: PropTypes.bool,
  preview: PropTypes.bool,
  textsDefault: PropTypes.object
}
export default Induction
