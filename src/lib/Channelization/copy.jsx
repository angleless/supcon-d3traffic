import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pointLenth, segmentDividePoints, splitPoint, lineAnglePoint, intersectionPoint2, polar2rect, angleScope } from './geometry'
import { caclStreetInfos, streetBorderPath, SVGCoord, directions2Id, correctPoint, originDataInfos, reSizeWidthInfo, devicesAllInfoIndex, prevDrectionAllInfoIndex } from './utils'
import {
  WIDTH,
  HEIGHT,
  DEVEICE_GAP_ICON_WIDTH,
  GAP_DEVICE_WIDTH,
  MODEL_GAP_BTN,
  CROSS_WALK_WIDTH,
  CROSS_SCALE_WALK_WIDTH
} from './consts'
import * as d3 from 'd3'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import zip from 'ramda/src/zip'
import mock from './mock'
import './Channelization.less'

class Channelization extends Component {
  initialState = {
    svg: null,
    coord: null,
    data: null,
    prevDrection: null,
    streetInfos: []
  }

  componentWillMount () {
    const { width, height, background, showCenterLight, centerColor, deviceModalWidth, prevModalWidth, contentScale } = this.props
    const w = parseInt(width) ? parseInt(width) : WIDTH
    const h = parseInt(height) ? parseInt(height) : HEIGHT
    const unit = typeof width === 'string' ? '%' : 'px'
    this.setState({
      ...this.initialState,
      background,
      w,
      h,
      contentScale,
      lightEdited: showCenterLight,
      centerColor,
      deviceModalWidth,
      prevModalWidth,
      unit
    })
  }

  render () {
    const { w, h, background, unit, contentScale } = this.state
    return (
      <div id='cb-aspects-container' style={{ width: `${w}${unit}`, height: `${h}${unit}`, transform: `scale(${contentScale.x}, ${contentScale.y})`, transformOrigin: '0 0' }}>
        <svg id='cb-aspects-svg' width={`${w}${unit}`} height={`${h}${unit}`} style={{ background: `${background || 'black'}`, width: `${w}${unit}`, height: `${h}${unit}` }}>
          <g id='cb-aspects-symbols'>
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
            <symbol id='STRAIGHT_RIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 405.36 1024 V 413.103 H 354.093 L 433.238 0 l 79.1351 413.103 h -49.5731 v 337.413 L 600.906 614.41 v -168.051 L 669.907 718.733 l -69.0004 258.699 V 823.928 L 462.81 952.09 V 1024 Z' />
            </symbol>
            <symbol id='STRAIGHT_BACK' width='32'>
              <path d='M3.73333333,33.1000591 L3.73333333,48.0533927 L-2.33119576e-13,24.0266963 L3.73333333,2.84217094e-14 L3.73333333,15.0800368 L13.9408006,31.4349277 L14,31.4349277 L14,90 L11.2,90 L11.2,45.0635085 L3.73333333,33.1000591 Z' />
            </symbol>
            <symbol id='LEFT_BACK' width='24'>
              <polygon points='6.80017205 0 0 25.4898044 6.80017205 49.0104037 6.80017205 34.7099459 18.9968532 46.7648772 18.9968532 90 24.3925234 90 24.3925234 33.1111111 6.80017205 15.127757' />
            </symbol>
            <symbol id='STRAIGHT_LEFT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
            </symbol>
            <symbol id='LEFT_STRAIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
              <path d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
            </symbol>
            <symbol id='STRAIGHT_BACK' width='26'>
              <path d='M17.2450002,60.1821295 L16.8952299,60.7871311 C16.1204982,57.1814409 14.4779281,55.3785958 11.9675196,55.3785958 C9.45711113,55.3785958 8.06207303,57.1814409 7.78240532,60.7871311 L7.78240532,66.3006228 L11.7007062,66.3006228 L5.60829289,90 L0,66.3006228 L3.81772475,66.3006228 L3.81772475,53.9753504 C5.39532854,49.1028946 8.11192684,46.6666667 11.9675196,46.6666667 C13.9693894,46.6666667 15.7285496,47.3234275 17.2450002,48.6369492 L17.2450002,35.8761117 L13.3333333,35.8761117 L20.1274498,0 L26.6666667,35.8761117 L22.3974991,35.8761117 L22.3974991,89.1666667 L17.2450002,89.1666667 L17.2450002,60.1821295 Z' />
            </symbol>
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
            <symbol id='BACK_RIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />
            </symbol>
            <symbol id='BACK_LEFT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M589.302519 0L663.703704 408.187259h-48.57363V1014.518519h-58.624V684.73363l-3.982222 6.893037c-8.590222-39.973926-26.548148-60.472889-53.883259-61.496889l-2.180741-0.047408c-28.558222 0-44.439704 20.517926-47.616 61.534815v62.738963h44.581926L424.106667 1024 360.296296 754.346667h43.434667V614.115556C421.679407 558.677333 452.589037 530.962963 496.459852 530.962963c22.784 0 42.799407 7.471407 60.055704 22.423704l-0.009482-145.199408H512L589.302519 0z' />
            </symbol>
            <symbol id='DEVEICE-BACKGROUND' viewBox='0 0 1024 1024' width='24' height='24'>
              <path d='M 0 0 L 480 0 L 480 480 L 340 480 L 240 550 L 140 480 L 0 480 L 0 0' />
            </symbol>
            <symbol id='CENTER-LIGHT' viewBox='0 0 1024 1024' width='24' height='24'>
              <path fill='#ffffff' d='M 773.689 273.067 H 267.378 c -108.089 0 -199.111 91.0222 -199.111 199.111 s 91.0222 199.111 199.111 199.111 h 506.311 c 108.089 0 199.111 -91.0222 199.111 -199.111 s -91.0222 -199.111 -199.111 -199.111 Z M 256 568.889 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 s 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z m 273.067 0 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 s 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z m 261.689 0 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 c 51.2 0 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z' />
            </symbol>
          </g>
          <g id='cb-aspects-draw'>
            <g id='cb-aspects-group' />
            <g id='cb-aspects-dircections' />
            <g id='cb-aspects-edited' />
            <g id='cb-aspects-devices-bg' />
            <g id='cb-aspects-devices' />
            <g id='road-lane-btn' />
            <g id='cb-aspects-directions-btn' />
            <g id='cb-aspects-devices-btn' />
            <g id='cb-center-light' />
            <g id='cb-center-light-edited' />
            <g id='cb-aspects-modal' />
            <g id='cb-aspects-directions-modal' />
            <g id='cb-aspects-modal-mouse' />
          </g>
        </svg>
      </div>
    )
  }

  componentDidMount () {
    const { data: propData, background, showCenterLight, centerColor, deviceModalWidth, prevModalWidth, contentScale } = this.props
    const { w, h } = this.state
    const aspectData = propData || mock
    const { data, svg, coord } = this.drawSVG(aspectData, w, h)
    const originData = originDataInfos(aspectData)
    const streetInfos = caclStreetInfos(aspectData)
    this.setState({
      ...this.initialState,
      background,
      originData,
      data,
      contentScale,
      svg,
      coord,
      lightEdited: showCenterLight,
      deviceModalWidth,
      prevModalWidth,
      centerColor,
      w,
      h,
      streetInfos
    }, this.allFunc)
  }

  componentDidUpdate (prevProps) {
    const { data: propData, background, contentScale, showCenterLight, centerColor, deviceModalWidth, prevModalWidth, width, height } = this.props

    if (propData !== prevProps.data || prevProps.width !== width || prevProps.height !== height || prevProps.contentScale.x !== contentScale.x || prevProps.contentScale.y !== contentScale.y) {
      const w = parseInt(width) ? parseInt(width) : WIDTH
      const h = parseInt(height) ? parseInt(height) : HEIGHT
      const aspectData = propData || mock
      const { data, svg, coord } = this.drawSVG(aspectData, w, h)
      const originData = originDataInfos(aspectData)
      const streetInfos = caclStreetInfos(aspectData)
      this.setState({
        ...this.initialState,
        background,
        data,
        svg,
        coord,
        w,
        h,
        contentScale,
        centerColor,
        lightEdited: showCenterLight,
        originData,
        streetInfos,
        deviceModalWidth,
        prevModalWidth
      }, this.allFunc)
    }
  }

  clearAllSvg () {
    d3.select('#cb-aspects-group').selectAll('*').remove()
    d3.select('#cb-aspects-dircections').selectAll('*').remove()
    d3.select('#road-lane-btn').selectAll('*').remove()
    d3.select('#cb-aspects-devices').selectAll('*').remove()
    d3.select('#cb-aspects-devices-bg').selectAll('*').remove()
    d3.select('#cb-center-light').selectAll('*').remove()
    d3.select('#cb-center-light-edited').selectAll('*').remove()
    d3.select('#cb-aspects-edited').selectAll('*').remove()
    d3.select('#cb-aspects-directions-btn').selectAll('*').remove()
    d3.select('#cb-aspects-devices-btn').selectAll('*').remove()
  }

  clearModalSvg () {
    d3.select('#cb-aspects-directions-modal').selectAll('*').remove()
    d3.select('#cb-aspects-modal').selectAll('*').remove()
  }

  drawCenter () {
    const { coord, w, streetInfos, prevDrection, originData, lightEdited } = this.state
    const self = this
    if (lightEdited) {
      d3.select('#cb-center-light-edited').selectAll('circle')
        .data([coord.math2svg({ x: 0, y: 0 })])
        .enter()
        .append('circle')
        .attr('fill', 'rgba(216, 216, 216, 0.1)')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', w * 0.013)
        .attr('stroke-dasharray', '10,10')
        .on('click', function () {
          d3.event.stopPropagation()
          d3.select('#cb-center-light-edited').selectAll('*').remove()
          self.setState({
            lightEdited: false,
            centerColor: false
          }, () => {
            const streetsClone = JSON.parse(JSON.stringify(originData))
            const resData = []
            streetsClone.forEach(items => {
              const goalData = streetInfos.find(item => item.tabs === items.tabs)
              if (goalData) {
                resData.push(goalData)
              } else {
                resData.push(items)
              }
            })
            let callbackPrevFunc = null
            if (prevDrection) {
              const { objIndex, insIndex, directionPrev, directionBack } = prevDrection ? prevDrectionAllInfoIndex(prevDrection) : null
              callbackPrevFunc = [streetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
            }
            self.props.centerCallback(false, true)
            self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
            self.allFunc()
          })
        })

      const btnGroup = d3.select('#cb-center-light-edited').append('g')
      btnGroup
        .append('title')
        .html('点击修改中心设备')
      btnGroup
        .append('circle')
        .attr('fill', 'rgba(216, 216, 216, 0.1)')
        .attr('cx', d => coord.math2svg({ x: 0, y: 0 }).x)
        .attr('cy', d => coord.math2svg({ x: 0, y: 0 }).y)
        .attr('r', w * 0.013)
        .attr('fill', 'yellow')
        .attr('opacity', '0')
        .attr('stroke-dasharray', '10,10')
        .on('click', function () {
          d3.event.stopPropagation()
          d3.select('#cb-center-light-edited').selectAll('*').remove()
          self.setState({
            lightEdited: false,
            centerColor: false
          }, () => {
            const streetsClone = JSON.parse(JSON.stringify(originData))
            const resData = []
            streetsClone.forEach(items => {
              const goalData = streetInfos.find(item => item.tabs === items.tabs)
              if (goalData) {
                resData.push(goalData)
              } else {
                resData.push(items)
              }
            })
            let callbackPrevFunc = null
            if (prevDrection) {
              const { objIndex, insIndex, directionPrev, directionBack } = prevDrection ? prevDrectionAllInfoIndex(prevDrection) : null
              callbackPrevFunc = [streetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
            }
            self.props.centerCallback(false, true)
            self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
            self.allFunc()
          })
        })

      d3.select('#cb-center-light-edited')
        .append('path')
        .attr('d', `M ${coord.math2svg({ x: 0, y: 0 }).x - 8} ${coord.math2svg({ x: 0, y: 0 }).y} L ${coord.math2svg({ x: 0, y: 0 }).x + 8} ${coord.math2svg({ x: 0, y: 0 }).y} M ${coord.math2svg({ x: 0, y: 0 }).x} ${coord.math2svg({ x: 0, y: 0 }).y + 8} L ${coord.math2svg({ x: 0, y: 0 }).x} ${coord.math2svg({ x: 0, y: 0 }).y - 8} `)
        .attr('stroke', 'rgba(216, 216, 216, 0.8)')
        .attr('fill', 'rgba(216, 216, 216, 0.8)')
        .on('click', function () {
          d3.event.stopPropagation()
          d3.select('#cb-center-light-edited').selectAll('*').remove()
          self.setState({
            lightEdited: false
          }, () => {
            const streetsClone = JSON.parse(JSON.stringify(originData))
            const resData = []
            streetsClone.forEach(items => {
              const goalData = streetInfos.find(item => item.tabs === items.tabs)
              if (goalData) {
                resData.push(goalData)
              } else {
                resData.push(items)
              }
            })
            let callbackPrevFunc = null
            if (prevDrection) {
              const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
              callbackPrevFunc = [streetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
            }
            self.props.centerCallback(false, true)
            self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
            self.allFunc()
          })
        })
    } else {
      const color = this.state.centerColor ? '#1B98FF' : '#ee4e4e'
      d3.select('#cb-center-light')
        .append('use')
        .attr('xlink:href', '#DEVEICE-BACKGROUND')
        .attr('height', '26')
        .attr('transform', `translate(${coord.math2svg({ x: 0, y: 0 }).x - 11} ${coord.math2svg({ x: 0, y: 0 }).y - 11 - 12}) scale(2)`)
        .attr('fill', color)
        .attr('stroke', 'none')
        .on('click', function () {
          d3.event.stopPropagation()
          if (self.state.centerColor) {
            self.setState({
              centerColor: false
            }, () => {
              self.props.centerCallback(false, true)
              self.allFunc()
            })
          } else {
            const streetsClone = JSON.parse(JSON.stringify(originData))
            const resData = []
            streetsClone.forEach(items => {
              const goalData = streetInfos.find(item => item.tabs === items.tabs)
              if (goalData) {
                resData.push(goalData)
              } else {
                resData.push(items)
              }
            })
            let callbackPrevFunc = null
            if (prevDrection) {
              const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
              callbackPrevFunc = [streetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
            }
            self.allFunc()
            self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
          }
        })
      d3.select('#cb-center-light')
        .append('use')
        .attr('xlink:href', '#CENTER-LIGHT')
        .attr('transform', `translate(${coord.math2svg({ x: 0, y: 0 }).x - 12} ,${coord.math2svg({ x: 0, y: 0 }).y - 18 - 12})`)
        .attr('stroke', 'none')
        .attr('fill', '#737373')
        .attr('height', '40')
        .attr('cursor', 'pointer')
        .on('click', function () {
          d3.event.stopPropagation()
          if (self.state.centerColor) {
            self.setState({
              centerColor: false
            }, () => {
              self.allFunc()
              self.props.centerCallback(false, true)
            })
          } else {
            const streetsClone = JSON.parse(JSON.stringify(originData))
            const resData = []
            streetsClone.forEach(items => {
              const goalData = streetInfos.find(item => item.tabs === items.tabs)
              if (goalData) {
                resData.push(goalData)
              } else {
                resData.push(items)
              }
            })
            let callbackPrevFunc = null
            if (prevDrection) {
              const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
              callbackPrevFunc = [streetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
            }
            self.allFunc()
            self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
          }
        })
    }
  }

  allFunc () {
    // const { addBtnBool } = this.props
    this.clearAllSvg()
    // // 绘制背景色
    this.roadBg()
    // // 绘制svg中心点
    // this.state.streetInfos.length > 0 && this.drawCenter()
    // // // 绘制每条道路的虚线
    // this.drawLaneDividers()
    // // // 给每条道路给可编辑状态
    // this.editRoad()
    // // 绘制进口道的方向
    // this.drawDirections()
    // this.drawDevice()
    // // 绘制停止线
    // this.drawCenterRect()
    // // 绘制双黄分割线
    // this.drawsplitLine()
    // // 绘制人行道
    // this.crossWalkRoad()
    // // 增删车道的按钮
    // this.addDirectionBtn('directions')
    // this.addDirectionBtn('devices')
    // // 编辑态车道的按钮
    // addBtnBool && this.addLaneButton()
    // // svg点击取消编辑状态
    // this.svgHandleFunc()
  }

  svgHandleFunc () {
    const self = this
    d3.select('#cb-aspects-svg').on('click', function () {
      const { streetInfos, prevDrection, originData } = self.state
      if (prevDrection) {
        const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
        const prevList = prevDrection.split(',')
        const insList = prevList.slice(2, prevList.length)
        changeStreetInfo[prevList[0]].editIndex = -1
        changeStreetInfo[prevList[0]].ins[prevList[1]].directions = insList.join(',') === '' ? [] : insList
        self.setState({
          ...self.state,
          streetInfos: changeStreetInfo,
          prevDrection: null
        }, () => {
          const streetsClone = JSON.parse(JSON.stringify(originData))
          const resData = []
          streetsClone.forEach(items => {
            const goalData = streetInfos.find(item => item.tabs === items.tabs)
            if (goalData) {
              resData.push(goalData)
            } else {
              resData.push(items)
            }
          })
          self.clearModalSvg()
          self.allFunc()
          const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
          resData[objIndex].ins[insIndex].directions = directionBack ? [directionPrev, directionBack] : [directionPrev]
          self.deviceOptionProps(null, originData, resData, null)
        })
      }
    })
  }

  addLaneButton () {
    const { coord, streetInfos } = this.state
    streetInfos.forEach((d, i) => {
      const { isOutBool, isInsBool } = i === streetInfos.length - 1 ? streetInfos[0] : streetInfos[i + 1]
      const { end, safeEnd, outs, ins, startNext: start, safeStart } = this.concatCurPoint(i)
      const index = i === streetInfos.length - 1 ? 0 : i + 1
      const SCALES = 0.02
      const endX = splitPoint(end, safeEnd, SCALES)
      const startX = splitPoint(start, safeStart, SCALES)

      const btnLen = 10
      const btnX = isOutBool ? 2 : 4
      const startBtnX = isInsBool ? 2 : 0
      for (let x = startBtnX; x < btnX; x++) {
        const endBtnCenter = splitPoint(endX, startX, (x - startBtnX + 1) / (btnX - startBtnX + 1))
        const startBtnCenter = splitPoint(safeEnd, safeStart, (x - startBtnX + 1) / (btnX - startBtnX + 1))
        const startBtnCenterEndxLen = pointLenth(startBtnCenter, safeEnd)
        const startBtnCenterStartxLen = pointLenth(startBtnCenter, safeStart)
        const endBtnCenterEndxLen = pointLenth(endBtnCenter, endX)
        const endBtnCenterStartxLen = pointLenth(endBtnCenter, startX)

        const btnStart1 = splitPoint(startBtnCenter, safeEnd, btnLen * 0.5 / startBtnCenterEndxLen)
        const btnStart2 = splitPoint(startBtnCenter, safeStart, btnLen * 0.5 / startBtnCenterStartxLen)

        const btnEnd1 = splitPoint(endBtnCenter, endX, btnLen * 0.5 / endBtnCenterEndxLen)
        const btnEnd2 = splitPoint(endBtnCenter, startX, btnLen * 0.5 / endBtnCenterStartxLen)
        const endstartLen = pointLenth(btnEnd1, btnStart1)
        const btnEnd3 = splitPoint(btnEnd1, btnStart1, btnLen / endstartLen)
        const btnEnd4 = splitPoint(btnEnd2, btnStart2, btnLen / endstartLen)

        const centerRect1 = splitPoint(btnEnd1, btnEnd3, 0.5)
        const centerRect2 = splitPoint(btnEnd2, btnEnd4, 0.5)
        const centerRect3 = splitPoint(btnEnd1, btnEnd2, 0.5)
        const centerRect4 = splitPoint(btnEnd3, btnEnd4, 0.5)
        const centerRectgap1 = splitPoint(centerRect1, centerRect2, 0.1)
        const centerRectgap2 = splitPoint(centerRect2, centerRect1, 0.1)
        const centerRectgap3 = splitPoint(centerRect3, centerRect4, 0.1)
        const centerRectgap4 = splitPoint(centerRect4, centerRect3, 0.1)
        const { x: gapX1, y: gapY1 } = coord.math2svg(centerRectgap1)
        const { x: gapX2, y: gapY2 } = coord.math2svg(centerRectgap2)
        const { x: gapX3, y: gapY3 } = coord.math2svg(centerRectgap3)
        const { x: gapX4, y: gapY4 } = coord.math2svg(centerRectgap4)
        const { x: ractX1, y: ractY1 } = coord.math2svg(btnEnd1)
        const { x: ractX2, y: ractY2 } = coord.math2svg(btnEnd2)
        const { x: ractX3, y: ractY3 } = coord.math2svg(btnEnd3)
        const { x: ractX4, y: ractY4 } = coord.math2svg(btnEnd4)
        const cross = x % 2 === 0 ? `M ${gapX1} ${gapY1} L ${gapX2} ${gapY2} M ${gapX3} ${gapY3} L ${gapX4} ${gapY4} ` : `M ${gapX1} ${gapY1} L ${gapX2} ${gapY2} `
        const pathContent = `${i},${index},${x},${outs},${ins.length}`
        if (!((x > 1 && outs === 0 && x % 2 !== 0) || (x <= 1 && ins.length === 0 && x % 2 !== 0))) {
          const self = this
          d3.select('#road-lane-btn')
            .append('path')
            .attr('d', `M ${ractX1} ${ractY1} L ${ractX2} ${ractY2} L ${ractX4} ${ractY4} L ${ractX3} ${ractY3} L ${ractX1} ${ractY1} `)
            .attr('content', pathContent)
            .attr('stroke', '#ffffff')
            .attr('fill', '#ffffff')
            .on('click', this.optionRoad.bind(self, pathContent))
          d3.select('#road-lane-btn')
            .append('path')
            .attr('content', pathContent)
            .attr('d', cross)
            .attr('index', x)
            .attr('stroke', '#333333')
            .attr('fill', '#333333')
            .on('click', this.optionRoad.bind(self, pathContent))

          const titleWords = x === 0 ? '进口道添加按钮' : x === 1 ? '进口道删除按钮' : x === 2 ? '出口道添加按钮' : '出口道删除按钮'
          const btnGroup = d3.select('#road-lane-btn').append('g')
          btnGroup
            .append('title')
            .html(titleWords)
            .attr('index', x)
          btnGroup
            .append('path')
            .attr('d', `M ${ractX1} ${ractY1} L ${ractX2} ${ractY2} L ${ractX4} ${ractY4} L ${ractX3} ${ractY3} L ${ractX1} ${ractY1} `)
            .attr('content', pathContent)
            .attr('stroke', '#ffffff')
            .attr('fill', '#ffffff')
            .attr('opacity', '0')
            .on('click', this.optionRoad.bind(self, pathContent))
        }
      }
    })
  }

  addDirectionBtn (type) {
    const { coord, streetInfos } = this.state
    streetInfos.forEach((d, i) => {
      if ((d.editIndex || d.editIndex === 0) && d.editIndex !== -1) {
        const { safeStart, safeEnd, start, end, ins, outs, width } = this.concatCurPrePoint(i)
        const laneNum = ins.length + outs // 道路上总车道数目
        const allLen = width / laneNum
        const btnLen = allLen * 0.3
        const length = pointLenth(safeStart, start)
        const scales = type === 'directions' ? 10 / length : (btnLen + 20) / length
        const startSaft = splitPoint(safeStart, safeEnd, d.editIndex / laneNum)
        const startOpt = splitPoint(start, end, d.editIndex / laneNum)
        const saftStartLine = splitPoint(startSaft, startOpt, scales)
        const nextStart = splitPoint(safeStart, safeEnd, (d.editIndex + 1) / laneNum)
        const nextEnd = splitPoint(start, end, (d.editIndex + 1) / laneNum)
        const endSaftEndLine = splitPoint(nextStart, nextEnd, scales)
        const { x: x1, y: y1 } = coord.math2svg(splitPoint(saftStartLine, endSaftEndLine, 0.5))
        const SideLength = pointLenth(endSaftEndLine, saftStartLine) * 0.3
        const { x: splitLevelPointX, y: splitLevelPointY } = splitPoint({ x: x1, y: y1 }, { x: x1, y: y1 + SideLength }, 0.5)
        const { x: splitLevelPointX1, y: splitLevelPointY1 } = splitPoint({ x: x1, y: y1 }, { x: x1, y: y1 - SideLength }, 0.5)
        const { x: splitVertialPointX, y: splitVertialPointY } = splitPoint({ x: x1, y: y1 }, { x: x1 + SideLength, y: y1 }, 0.5)
        const { x: splitVertialPointX1, y: splitVertialPointY1 } = splitPoint({ x: x1, y: y1 }, { x: x1 - SideLength, y: y1 }, 0.5)
        const selectId = type === 'directions' ? '#cb-aspects-directions-btn' : '#cb-aspects-devices-btn'

        d3.select(selectId)
          .append('path')
          .attr('d', `M ${splitLevelPointX} ${splitLevelPointY} L ${splitLevelPointX1} ${splitLevelPointY1} M ${splitVertialPointX} ${splitVertialPointY} L ${splitVertialPointX1} ${splitVertialPointY1} `)
          .attr('stroke', 'rgba(216, 216, 216, 0.8)')
          .attr('fill', 'rgba(216, 216, 216, 0.8)')
        d3.select(selectId)
          .append('circle')
          .attr('cx', x1)
          .attr('cy', y1)
          .attr('fill', 'rgba(216, 216, 216, 0.1)')
          .attr('option', `${x1},${y1}`)
          .attr('index', i)
          .attr('r', SideLength)
          .attr('stroke-dasharray', '10,10')
          .on('click', type === 'directions' ? this.modalFunc(this) : this.deviceFunc(this))

        const btnGroup = d3.select(selectId).append('g')
        btnGroup
          .append('title')
          .html(type === 'directions' ? '点击修改转向' : '点击修改设备')
          .attr('index', i)
          .attr('option', `${x1},${y1}`)
          .on('click', type === 'directions' ? this.modalFunc(this) : this.deviceFunc(this))
        btnGroup
          .append('circle')
          .attr('cx', x1)
          .attr('cy', y1)
          .attr('index', i)
          .attr('r', SideLength)
          .attr('fill', 'yellow')
          .attr('opacity', '0')
          .attr('index', i)
          .attr('option', `${x1},${y1}`)
          .on('click', type === 'directions' ? this.modalFunc(this) : this.deviceFunc(this))
      }
    })
  }

  modalFunc (self) {
    return function () {
      d3.event.stopPropagation()
      d3.select('#cb-aspects-modal').selectAll('*').remove()
      const { h, prevModalWidth } = self.state
      this.setAttribute('fill', 'rgba(216, 216, 216, 0.3)')
      const hY = Number(this.getAttribute('option').split(',')[1])
      const infoIndex = Number(this.getAttribute('index'))
      const angleDistanceY = 10
      const angleDistanceX = 5
      const modalWidth = prevModalWidth || 100
      const modalHeight = modalWidth / 1.2
      const startX = Number(this.getAttribute('option').split(',')[0])
      const origin = hY <= h / 2 ? 1 : -1 // 比较点击点的位置是在中心上面还是中心下面
      const startY = hY + MODEL_GAP_BTN * origin
      const leftAngleY = startY + angleDistanceY * origin
      const topModalY = startY + (angleDistanceY + modalHeight) * origin
      const leftAngleX = startX - angleDistanceX
      const rightAngleX = startX + angleDistanceX
      const ractOneX = startX - modalWidth / 2
      const ractTwoX = startX + modalWidth / 2
      const paths = `M ${startX} ${startY} L ${leftAngleX} ${leftAngleY} L ${ractOneX} ${leftAngleY} L ${ractOneX} ${topModalY} L ${ractTwoX} ${topModalY} L ${ractTwoX} ${leftAngleY} L ${rightAngleX} ${leftAngleY} L ${startX} ${startY} `
      const gapWidth = 8 // 间隙宽度
      const gapHeight = 4
      const iconWidth = (modalWidth - gapWidth * 5) / 4 // icon宽度
      const iconHeight = (modalHeight - gapHeight * 4) / 3
      const startIconY = origin === 1 ? leftAngleY : topModalY
      const directionsAllType = [['STRAIGHT', 'STRAIGHT_LEFT', 'STRAIGHT_RIGHT', 'LEFT'], ['RIGHT', 'BACK', 'LEFT_RIGHT', 'BACK_RIGHT'], ['BACK_LEFT']]
      d3.select('#cb-aspects-directions-modal').append('path')
        .attr('d', paths)
        .attr('stroke', '#FFFFFF')
        .attr('fill', '#FFFFFF')
        .on('click', function () {
          d3.event.stopPropagation()
        })
      for (let i = 0; i < 3; i++) {
        const iconY1 = startIconY + gapHeight * (i + 1) + iconHeight * i
        const iconY2 = iconY1 + iconHeight
        for (let y = 0; y < 4; y++) {
          if (y === 1 && i === 2) {
            break
          }
          const iconX1 = ractOneX + gapWidth * (y + 1) + iconWidth * y
          const iconX2 = iconX1 + iconWidth
          const iconPath1 = `M ${iconX1} ${iconY1} L ${iconX2} ${iconY1} L ${iconX2} ${iconY2} L ${iconX1} ${iconY2} L ${iconX1} ${iconY1}`
          const type = directionsAllType[i][y]
          const scales = 1
          const useWidth = (iconWidth - d3.select(`#${type}`).attr('width') * scales) / 2
          const useHeight = (iconHeight - 24) / 2
          d3.select('#cb-aspects-directions-modal').append('path')
            .attr('id', `modal-path-background-strokes-${i}${y}`)
            .attr('d', iconPath1)
            .attr('stroke', '#EEEEEE')
            .attr('fill', 'transparent')
            .attr('dircType', type)
            .attr('index', `${i}${y}`)
            .attr('cursor', 'pointer')
            .attr('infoIndex', infoIndex)
            .on('click', self.directionSelect(self))
            .on('mouseover', function (d, i) {
              const index = this.getAttribute('index')
              d3.select(`#modal-path-background-strokes-${index}`).attr('fill', '#EEEEEE')
              d3.select(`#modal-use-icons-fills-${index}`).attr('fill', '#0070CC')
            })
            .on('mouseout', function (d, i) {
              const index = this.getAttribute('index')
              d3.select(`#modal-path-background-strokes-${index}`).attr('fill', 'transparent')
              d3.select(`#modal-use-icons-fills-${index}`).attr('fill', '#737373')
            })
          d3.select('#cb-aspects-directions-modal').append('use')
            .attr('id', `modal-use-icons-fills-${i}${y}`)
            .attr('xlink:href', `#${type}`)
            .attr('transform', `translate(${iconX1 + useWidth} ${iconY1 + useHeight}) scale(${scales})`)
            .attr('stroke', 'none')
            .attr('fill', '#707070')
            .attr('index', `${i}${y}`)
            .attr('dircType', type)
            .attr('infoIndex', infoIndex)
            .on('click', self.directionSelect(self))
            .on('mouseover', function (d, i) {
              const index = this.getAttribute('index')
              d3.select(`#modal-path-background-strokes-${index}`).attr('fill', '#EEEEEE')
              d3.select(`#modal-use-icons-fills-${index}`).attr('fill', '#0070CC')
            })
            .on('mouseout', function (d, i) {
              const index = this.getAttribute('index')
              d3.select(`#modal-path-background-strokes-${index}`).attr('fill', 'transparent')
              d3.select(`#modal-use-icons-fills-${index}`).attr('fill', '#737373')
            })
        }
      }
    }
  }

  deviceFunc (self, type) {
    return function () {
      d3.event.stopPropagation()
      d3.select('#cb-aspects-modal').selectAll('*').remove()
      d3.select('#cb-aspects-directions-modal').selectAll('*').remove()
      this.setAttribute('fill', 'rgba(216, 216, 216, 0.3)')
      const { h, w, deviceModalWidth } = self.state
      const infoIndex = Number(this.getAttribute('index'))
      const hY = Number(this.getAttribute('option').split(',')[1])
      const angleDistanceY = 10
      const angleDistanceX = 5
      const modalWidth = deviceModalWidth || 250
      const modalHeight = modalWidth * 0.7
      const startX = Number(this.getAttribute('option').split(',')[0])
      const origin = hY <= h / 2 ? 1 : -1 // 比较点击点的位置是在中心上面还是中心下面
      const startY = hY + MODEL_GAP_BTN * origin
      const leftAngleY = startY + angleDistanceY * origin
      const topModalY = startY + (angleDistanceY + modalHeight) * origin
      const leftAngleX = startX - angleDistanceX
      const rightAngleX = startX + angleDistanceX
      const ractOneX = startX - modalWidth / 2
      const ractTwoX = startX + modalWidth / 2
      const paths = `M ${startX} ${startY} L ${leftAngleX} ${leftAngleY} L ${ractOneX} ${leftAngleY} L ${ractOneX} ${topModalY} L ${ractTwoX} ${topModalY} L ${ractTwoX} ${leftAngleY} L ${rightAngleX} ${leftAngleY} L ${startX} ${startY} `
      const totalWidth = modalWidth // 弹出框总长度
      const gapWidth = GAP_DEVICE_WIDTH // 间隙宽度
      const iconWidth = (totalWidth - gapWidth * DEVEICE_GAP_ICON_WIDTH) / 3 // icon宽度
      const iconHeight = (modalHeight - gapWidth * 3) / 2 // icon宽度
      const startIconY = origin === 1 ? leftAngleY : topModalY
      const directionsAllType = [['GANTRY', 'CAMERA', 'COIL'], ['COMPDETECTOR', 'RADAR']]
      const directionsAllName = [['卡口', '视频', '线圈'], ['复合设备', '雷达']]
      d3.select('#cb-aspects-modal').append('path')
        .attr('d', paths)
        .attr('stroke', '#FFFFFF')
        .attr('fill', '#FFFFFF')
      for (let i = 0; i < 2; i++) {
        const iconY1 = startIconY + gapWidth * (i + 1) + iconHeight * i
        const iconY2 = iconY1 + iconHeight
        for (let y = 0; y < 3; y++) {
          if (y === 2 && i === 1) {
            break
          }
          const iconX1 = ractOneX + gapWidth * (y + 1) + iconWidth * y
          const iconX2 = iconX1 + iconWidth
          const iconPath1 = `M ${iconX1} ${iconY1} L ${iconX2} ${iconY1} L ${iconX2} ${iconY2} L ${iconX1} ${iconY2} L ${iconX1} ${iconY1}`
          const width = (iconWidth - d3.select(`#${directionsAllType[i][y]}`).attr('width')) / 2
          const name = directionsAllName[i][y]
          const x1 = iconX1
          const x2 = iconX2
          const y1 = iconY2
          const dx = (x2 - x1) / 5
          const centerX = name.length <= 2 ? +x1 + Math.abs((x2 - x1) / 3.5) : +x1 + Math.abs((x2 - x1) / 14)
          const jianju = w * 0.01
          const centerY = +y1 - 5
          const path = `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y1 - jianju} L ${x1} ${y1 - jianju} L ${x1} ${y1}`
          d3.select('#cb-aspects-modal').append('path')
            .attr('d', iconPath1)
            .attr('fill', 'transparent')
            .attr('stroke', '#ececec')
            .attr('cursor', 'pointer')
            .attr('id', `device-path-background-strokes-${i}${y}`)
            .attr('index', `${i}${y}`)
            .attr('href', `#${directionsAllType[i][y]}`)
            .attr('infoIndex', infoIndex)
          d3.select('#cb-aspects-modal')
            .append('use')
            .attr('xlink:href', `#${directionsAllType[i][y]}`)
            .attr('transform', `translate(${iconX1 + width} ,${iconY1})`)
            .attr('stroke', 'none')
            .attr('fill', '#737373')
            .attr('height', '40')
            .attr('id', `device-use-background-strokes-${i}${y}`)
            .attr('name', `${directionsAllType[i][y]}`)
            .attr('index', `${i}${y}`)
            .attr('cursor', 'pointer')
          d3.select('#cb-aspects-modal').append('path')
            .attr('d', path)
            .attr('fill', 'transparent')
            .attr('stroke', 'none')
            .attr('id', `modal-mouse-path-background-strokes-${i}${y}`)
          d3.select('#cb-aspects-modal').append('text').style('font-size', dx).text(name)
            .attr('x', centerX)
            .attr('y', centerY)
            .attr('fill', 'none')
            .attr('id', `modal-mouse-text-background-strokes-${i}${y}`)
            .attr('stroke', 'transparent')
          d3.select('#cb-aspects-modal').append('path')
            .attr('d', iconPath1)
            .attr('fill', 'transparent')
            .attr('stroke', '#ececec')
            .attr('cursor', 'pointer')
            .attr('index', `${i}${y}`)
            .attr('href', `#${directionsAllType[i][y]}`)
            .attr('infoIndex', infoIndex)
            .on('click', self.deviceSelect(self))
            .on('mouseover', self.mouseEnterText())
            .on('mouseout', self.mouseLeaveText())
            .attr('mouse', [iconX1, iconX2, iconY2])
        }
      }
    }
  }

  mouseEnterText () {
    return function () {
      d3.event.stopPropagation()
      const index = this.getAttribute('index')
      d3.select(`#modal-mouse-path-background-strokes-${index}`).attr('fill', 'rgba(100,100,100,0.63)')
      d3.select(`#modal-mouse-text-background-strokes-${index}`).attr('fill', '#ffffff')
      d3.select(`#device-path-background-strokes-${index}`).attr('fill', '#eeeeee')
      d3.select(`#device-use-background-strokes-${index}`).attr('fill', '#0070CC')
    }
  }

  mouseLeaveText () {
    return function () {
      d3.event.stopPropagation()
      const index = this.getAttribute('index')
      d3.select(`#device-use-background-strokes-${index}`).attr('fill', '#737373')
      d3.select(`#device-path-background-strokes-${index}`).attr('fill', 'transparent')
      d3.select(`#modal-mouse-path-background-strokes-${index}`).attr('fill', 'transparent')
      d3.select('#cb-aspects-modal-mouse').selectAll('*').remove()
    }
  }

  directionSelect (self) {
    return function () {
      d3.event.stopPropagation()
      const { state } = self
      const { streetInfos, originData } = state
      const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
      const index = this.getAttribute('infoIndex')
      const dircType = this.getAttribute('dircType')
      changeStreetInfo[index].ins[changeStreetInfo[index].editIndex - changeStreetInfo[index].outs].directions = dircType.split('_')
      const prevDrection = `${index},${changeStreetInfo[index].editIndex - changeStreetInfo[index].outs},${dircType.split('_').join(',')}`
      state.streetInfos = changeStreetInfo
      self.setState({
        streetInfos: changeStreetInfo,
        prevDrection
      }, () => {
        const streetsClone = JSON.parse(JSON.stringify(originData))
        const resData = []
        streetsClone.forEach(items => {
          const goalData = changeStreetInfo.find(item => item.tabs === items.tabs)
          if (goalData) {
            resData.push(goalData)
          } else {
            resData.push(items)
          }
        })
        self.clearModalSvg()
        d3.select('#cb-aspects-dircections').selectAll('*').remove()
        d3.select('#cb-aspects-directions-btn').selectAll('*').remove()
        self.drawDirections()
        let callbackPrevFunc = null
        if (prevDrection) {
          const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
          callbackPrevFunc = [changeStreetInfo[objIndex].tabs, insIndex, directionPrev, directionBack]
        }
        self.deviceOptionProps(callbackPrevFunc, originData, resData, changeStreetInfo[index].tabs)
      })
    }
  }

  deviceSelect (self) {
    return function () {
      const { state } = self
      const { streetInfos, prevDrection, originData } = state
      d3.event.stopPropagation()
      d3.select('#cb-aspects-modal-mouse').selectAll('*').remove()
      const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
      const index = this.getAttribute('infoIndex')
      const href = this.getAttribute('href').slice(1)
      const insIndex = changeStreetInfo[index].editIndex - changeStreetInfo[index].outs
      const deviceIndex = changeStreetInfo[index].ins[insIndex]
      let deviceLen = changeStreetInfo[index].ins[insIndex].device.length - 1
      if (deviceIndex && deviceIndex.device && deviceIndex.device.length > 0) {
        deviceIndex.device.push({
          type: href,
          infoList: {}
        })
        deviceLen = deviceLen + 1
      } else {
        deviceIndex.device = [{
          type: href,
          infoList: {}
        }]
        deviceLen = 0
      }
      self.setState({
        streetInfos: changeStreetInfo
      })
      const streetsClone = JSON.parse(JSON.stringify(originData))
      const resData = []
      streetsClone.forEach(items => {
        const goalData = changeStreetInfo.find(item => item.tabs === items.tabs)
        if (goalData) {
          resData.push(goalData)
        } else {
          resData.push(items)
        }
      })
      let callbackPrevFunc = null
      if (prevDrection) {
        const { objIndex, insIndex: insdrecIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
        callbackPrevFunc = [changeStreetInfo[objIndex].tabs, insdrecIndex, directionPrev, directionBack]
      }
      self.clearModalSvg()
      d3.select('#cb-aspects-devices').selectAll('*').remove()
      self.drawDevice(`${index}_${insIndex}_${deviceLen}`)
      self.deviceOptionProps(callbackPrevFunc, originData, resData, changeStreetInfo[index].tabs)
      self.props.deviceCallback(changeStreetInfo[index], insIndex, deviceLen)
    }
  }

  optionRoad (pathContent) {
    d3.event.stopPropagation()
    const { streetInfos, prevDrection, originData } = this.state
    const content = pathContent.split(',')
    const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
    const buttonPosition = Number(content[2])
    const prevInfoIndex = Number(content[1])
    const insLength = Number(content[4])
    const outs = Number(content[3])
    const selectEditIndex = changeStreetInfo[prevInfoIndex].editIndex && changeStreetInfo[prevInfoIndex].editIndex !== -1 ? changeStreetInfo[prevInfoIndex].editIndex : 0
    let newPrevDrection = prevDrection
    if (buttonPosition === 1) {
      const deleteIndex = selectEditIndex < outs ? insLength - 1 : selectEditIndex - outs
      insLength - 1 >= 0 && changeStreetInfo[content[1]].ins.splice(deleteIndex, 1)
      changeStreetInfo[prevInfoIndex].editIndex = -1
      const resizePointInfo = reSizeWidthInfo(changeStreetInfo)
      newPrevDrection = null
      this.setState({
        ...this.state,
        streetInfos: resizePointInfo,
        prevDrection: newPrevDrection
      })
      this.allFunc()
    } else if (buttonPosition === 0) {
      const addIndex = selectEditIndex < outs ? 0 : selectEditIndex - outs + 1
      changeStreetInfo[content[1]].ins.splice(addIndex, 0, {
        directions: [],
        device: []
      })
      changeStreetInfo[prevInfoIndex].editIndex = changeStreetInfo[prevInfoIndex].editIndex && changeStreetInfo[prevInfoIndex].editIndex !== -1 ? changeStreetInfo[prevInfoIndex].editIndex : outs
      const resizePointInfo = reSizeWidthInfo(changeStreetInfo)
      this.setState({
        ...this.state,
        streetInfos: resizePointInfo
      })
      this.allFunc()
    } else if (buttonPosition === 3) {
      changeStreetInfo[content[1]].outs = outs - 1 >= 0 ? outs - 1 : 0
      changeStreetInfo[prevInfoIndex].editIndex = -1
      const resizePointInfo = reSizeWidthInfo(changeStreetInfo)
      this.setState({
        ...this.state,
        streetInfos: resizePointInfo
      })
      this.allFunc()
    } else {
      changeStreetInfo[content[1]].outs = outs + 1
      changeStreetInfo[prevInfoIndex].editIndex = -1
      const resizePointInfo = reSizeWidthInfo(changeStreetInfo)
      this.setState({
        ...this.state,
        streetInfos: resizePointInfo
      })
      this.allFunc()
    }
    const streetsClone = JSON.parse(JSON.stringify(originData))
    const resData = []
    streetsClone.forEach(items => {
      const goalData = changeStreetInfo.find(item => item.tabs === items.tabs)
      if (goalData) {
        resData.push(goalData)
      } else {
        resData.push(items)
      }
    })
    let callbackPrevFunc = null
    if (newPrevDrection) {
      const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(newPrevDrection)
      callbackPrevFunc = [changeStreetInfo[objIndex].tabs, insIndex, directionPrev, directionBack]
    }
    this.deviceOptionProps(callbackPrevFunc, originData, resData, changeStreetInfo[content[1]].tabs)
  }

  editRoad () {
    const self = this
    const { state } = self
    const { coord, streetInfos } = state
    streetInfos.forEach((v, i) => {
      const { safeStart, safeEnd, start, end, ins, outs } = this.concatCurPrePoint(i)
      const { x: xCurveStart, y: yCurveStart } = coord.math2svg(safeStart)
      const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(safeEnd)
      const { x: xStart, y: yStart } = coord.math2svg(start)
      const { x: xEnd, y: yEnd } = coord.math2svg(end)
      const laneNum = ins.length + outs
      for (let x = outs; x < laneNum; x++) {
        const { x: splitSaftPointX, y: splitSafePointY } = splitPoint({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, x / laneNum)
        const { x: splitStartPointX, y: splitStartPointY } = splitPoint({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, x / laneNum)
        const { x: splitSaftPointX1, y: splitSafePointY1 } = splitPoint({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, (x + 1) / laneNum)
        const { x: splitStartPointX1, y: splitStartPointY1 } = splitPoint({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, (x + 1) / laneNum)
        d3.select('#cb-aspects-edited').append('path')
          .attr('d', `M ${splitSaftPointX} ${splitSafePointY} L ${splitStartPointX} ${splitStartPointY} L ${splitStartPointX1} ${splitStartPointY1} L ${splitSaftPointX1} ${splitSafePointY1} L ${splitSaftPointX} ${splitSafePointY} `)
          .attr('stroke', 'none')
          .attr('content', `${x},${i},${ins.length}`)
          .attr('fill', 'transparent')
          .attr('key', (d, i) => `safe-start-line${i}`)
          .on('click', function () {
            let { prevDrection, streetInfos, originData } = self.state
            d3.event.stopPropagation()
            const changeStreetInfo = JSON.parse(JSON.stringify(streetInfos))
            const content = this.getAttribute('content').split(',')
            if (!prevDrection) {
              self.setState({
                centerColor: true
              })
              self.props.centerCallback(true, true)
              self.clearModalSvg()
              prevDrection = `${+content[1]},${content[0] - changeStreetInfo[+content[1]].outs},${changeStreetInfo[+content[1]].ins[content[0] - changeStreetInfo[+content[1]].outs].directions.join(',')}`
              changeStreetInfo[+content[1]].editIndex = +content[0]
              changeStreetInfo[+content[1]].ins[content[0] - changeStreetInfo[+content[1]].outs].directions = []
              changeStreetInfo.forEach((items, index) => {
                if (+content[1] !== index) {
                  changeStreetInfo[index].editIndex = -1
                }
              })
              self.setState({
                streetInfos: changeStreetInfo,
                prevDrection
              }, () => {
                const streetsClone = JSON.parse(JSON.stringify(originData))
                const resData = []
                streetsClone.forEach(items => {
                  const goalData = changeStreetInfo.find(item => item.tabs === items.tabs)
                  if (goalData) {
                    resData.push(goalData)
                  } else {
                    resData.push(items)
                  }
                })
                let callbackPrevFunc = null
                if (prevDrection) {
                  const { objIndex, insIndex, directionPrev, directionBack } = prevDrectionAllInfoIndex(prevDrection)
                  callbackPrevFunc = [changeStreetInfo[objIndex].tabs, insIndex, directionPrev, directionBack]
                }
                self.allFunc()
                self.deviceOptionProps(callbackPrevFunc, originData, resData, changeStreetInfo[+content[1]].tabs)
              })
            } else {
              let prevList = self.state.prevDrection.split(',')
              const insList = prevList.slice(2, prevList.length)
              prevList = prevList.filter(items => items !== 'undefined')
              if (prevList[0] !== content[1] || Number(prevList[1]) !== content[0] - changeStreetInfo[+content[1]].outs) {
                self.setState({
                  centerColor: true
                })
                self.props.centerCallback(true, true)
                self.clearModalSvg()
                changeStreetInfo[prevList[0]].ins[prevList[1]].directions = insList.join(',') === '' ? [] : insList
                prevDrection = `${+content[1]},${content[0] - changeStreetInfo[+content[1]].outs},${changeStreetInfo[+content[1]].ins[content[0] - changeStreetInfo[+content[1]].outs].directions.join(',')}`
                changeStreetInfo[+content[1]].editIndex = +content[0]
                changeStreetInfo[+content[1]].ins[content[0] - changeStreetInfo[+content[1]].outs].directions = []
                changeStreetInfo.forEach((items, index) => {
                  if (+content[1] !== index) {
                    changeStreetInfo[index].editIndex = -1
                  }
                })
                self.setState({
                  streetInfos: changeStreetInfo,
                  prevDrection
                }, () => {
                  const streetsClone = JSON.parse(JSON.stringify(originData))
                  const resData = []
                  streetsClone.forEach(items => {
                    const goalData = changeStreetInfo.find(item => item.tabs === items.tabs)
                    if (goalData) {
                      resData.push(goalData)
                    } else {
                      resData.push(items)
                    }
                  })
                  let callbackPrevFunc = null
                  if (prevDrection) {
                    const { objIndex, insIndex, directionPrev, directionBack } = prevDrection ? prevDrectionAllInfoIndex(prevDrection) : null
                    callbackPrevFunc = [changeStreetInfo[objIndex].tabs, insIndex, directionPrev, directionBack]
                  }
                  self.allFunc()
                  self.deviceOptionProps(callbackPrevFunc, originData, resData, changeStreetInfo[+content[1]].tabs)
                })
              }
            }
          })
      }
    })
  }

  crossWalkRoad () {
    const { crossWolkWidth, crossWolkHeight } = this.props
    const { svg, coord, streetInfos } = this.state
    svg.append('g')
      .attr('id', 'cb-human-line')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        const { nextJoint, safeStart, safeEnd, joint } = this.concatCurPoint(i)
        const fristLen = pointLenth(safeEnd, joint)
        const secondLen = pointLenth(safeStart, nextJoint)
        const startDistance = crossWolkWidth || CROSS_WALK_WIDTH // 人行道的宽度
        const crosswalkLen = crossWolkHeight || startDistance * CROSS_SCALE_WALK_WIDTH // 人形道的长度
        const lengScales = crosswalkLen > fristLen ? 1 - (4 / fristLen) : crosswalkLen / fristLen
        const { x: crosswolkStartx, y: crosswolkStarty } = splitPoint(safeEnd, joint, 4 / fristLen)
        const { x: crosswolkJoinEndx, y: crosswolkJoinEndy } = splitPoint(safeEnd, joint, lengScales)
        const { x: crosswolkEndx, y: crosswolkEndy } = splitPoint(safeStart, nextJoint, 4 / secondLen)
        const { x: crosswolkJoinStartx, y: crosswolkJoinStarty } = splitPoint(safeStart, nextJoint, lengScales)
        // new joint
        const jointConectLen = pointLenth({ x: crosswolkStartx, y: crosswolkStarty }, { x: crosswolkEndx, y: crosswolkEndy })
        const numb = Math.floor(jointConectLen / startDistance)
        let result = ''
        for (let i = 0; i < numb + 1; i++) {
          const jianju = 2.5
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
      .attr('stroke', '#ffffff')
      .attr('fill', '#ffffff')
  }

  roadBg () {
    const { svg, streetInfos, w, h } = this.state
    // const getPoint = streetInfos.reduce((p, d, i, a) => {
    //   const { angle, length, width, widthNext } = d
    //   const bufferNum = 30
    //   const scale = bufferNum / length
    //   const isPoint = { x: reatCenterX2, y: reatCenterY2 }
    //   const { x: xCurrLine, y: yCurrLine } = i === 0 ? polar2rect({ x: w / 2, y: h / 2 }, angle.from, length)
    //     : polar2rect(p.end.x, angle.to, length - 30)
    // }, [])
    svg.append('g')
      .attr('id', 'draw-road-bg')
      .selectAll('path')
      .data(streetInfos)
      .enter()
      .append('path')
      .attr('d', (d, i) => {
        const { angle, length, width, widthNext } = d
        const { x: endOneX, y: endOneY } = polar2rect({ x: w / 2, y: h / 2 }, angle.from, length)
        const bufferNum = 30
        const scale = bufferNum / length
        const isStartMinus = angle.from >= 135 && angle.from <= 315 ? -1 : 1
        const { x: startOneX, y: startOneY } = splitPoint({ x: w / 2, y: h / 2 }, { x: endOneX, y: endOneY }, scale)
        const angleRect = angleScope(angle.from)
        const endTwoX = angleRect ? endOneX : endOneX + isStartMinus * width
        const endTwoY = angleRect ? endOneY + isStartMinus * width : endOneY
        const startTwoX = angleRect ? startOneX : startOneX + isStartMinus * width
        const startTwoY = angleRect ? startOneY + isStartMinus * width : startOneY

        // next line
        const isPoint = Math.abs(angle.to - angle.from) <= 180 ? { x: startTwoX, y: startTwoY } : { x: startOneX, y: startOneY }

        const { x: xCurrLineNext, y: yCurrLineNext } = polar2rect(isPoint, angle.to, length - 30)
        const angleRectNext = angleScope(angle.to)
        const isMinus = angle.to >= 315 && angle.to <= 360 ? -1 : angle.to >= 135 && angle.to <= 315 ? 1 : -1
        const newRectxNext1 = angleRectNext ? xCurrLineNext : xCurrLineNext + widthNext * isMinus
        const newRectyNext1 = angleRectNext ? yCurrLineNext + widthNext * isMinus : yCurrLineNext
        const reatCenterNextX1 = angleRectNext ? isPoint.x : isPoint.x + widthNext * isMinus
        const reatCenterNextY1 = angleRectNext ? isPoint.y + widthNext * isMinus : isPoint.y
        return ` ${i === 0 ? `M ${startOneX} ${startOneY} L ${endOneX} ${endOneY} M ${startTwoX} ${startTwoY} L ${endTwoX} ${endTwoY}
        M ${isPoint.x} ${isPoint.y} L ${xCurrLineNext} ${yCurrLineNext} M ${reatCenterNextX1} ${reatCenterNextY1} L ${newRectxNext1} ${newRectyNext1}` : ''}`
      })
      .attr('stroke', '#ffffff')
      .attr('fill', 'none')
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
    let { joint, safeEnd, angle, end, width } = streetInfos[index]
    let { joint: nextJoint, safeStart, start: startNext, angle: angleNext, outs, ins } = index === streetInfos.length - 1 ? streetInfos[0] : streetInfos[index + 1]
    if (Math.abs(angleNext.to - angleNext.from) > 140 && Math.abs(angleNext.to - angleNext.from) <= 200 && streetInfos.length === 3) {
      nextJoint = correctPoint(angle.to, angleNext.from, safeEnd, joint, startNext).joint
      safeStart = correctPoint(angle.to, angleNext.from, safeEnd, joint, startNext).safe
    }
    if (Math.abs(angle.to - angle.from) > 140 && Math.abs(angle.to - angle.from) <= 200 && streetInfos.length === 3) {
      joint = correctPoint(angleNext.from, angle.to, safeStart, nextJoint, end).joint
      safeEnd = correctPoint(angleNext.from, angle.to, safeStart, nextJoint, end).safe
    }
    return {
      nextJoint,
      safeStart,
      safeEnd,
      joint,
      outs,
      ins,
      startNext,
      end,
      angle,
      width
    }
  }

  concatCurPrePoint (index) {
    const { streetInfos } = this.state
    let { angle, start, safeStart, ins, outs, width } = streetInfos[index]
    const len = streetInfos.length
    const vprev = streetInfos[(index - 1 + len) % len]
    let { safeEnd, angle: angleNext, end } = vprev
    if (Math.abs(angleNext.to - angleNext.from) > 140 && Math.abs(angleNext.to - angleNext.from) <= 200 && streetInfos.length === 3) {
      const angleRect = angle.from < 90 ? angle.from + 90 : angle.from - 90
      const { a: a1, b: b1, c: c1 } = lineAnglePoint(angleRect, safeStart)
      const { a: a2, b: b2, c: c2 } = lineAnglePoint(angle.from, end)
      safeEnd = intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    }
    if (Math.abs(angle.to - angle.from) > 140 && Math.abs(angle.to - angle.from) <= 200 && streetInfos.length === 3) {
      const angleRect = angleNext.to < 90 ? angleNext.to + 90 : angleNext.to - 90
      const { a: a1, b: b1, c: c1 } = lineAnglePoint(angleRect, safeEnd)
      const { a: a2, b: b2, c: c2 } = lineAnglePoint(angleNext.to, start)
      safeStart = intersectionPoint2({ a1, b1, c1 }, { a2, b2, c2 })
    }
    return {
      safeStart: safeStart,
      safeEnd: safeEnd,
      start,
      end,
      ins,
      outs,
      angle,
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
        const { end, safeEnd, safeStart, outs, ins, startNext: start } = this.concatCurPoint(i)
        if (outs + ins.length && outs !== 0 && ins.length !== 0) {
          const scales = ins.length / (outs + ins.length)
          const { x: splitStartx, y: splitStarty } = splitPoint(end, start, scales)
          const { x: splitEndx, y: splitEndy } = splitPoint(safeEnd, safeStart, scales)
          const { x: xStart, y: yStart } = coord.math2svg({ x: splitStartx, y: splitStarty })
          const { x: xEnd, y: yEnd } = coord.math2svg({ x: splitEndx, y: splitEndy })
          const result = `M ${xStart} ${yStart} L ${xEnd} ${yEnd}`
          return result
        }
        return ''
      })
      .attr('stroke', 'yellow')
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

  drawDevice (tabInfo) {
    const { coord, streetInfos } = this.state
    const self = this
    streetInfos.forEach((d, tabs) => {
      const { safeStart, safeEnd, start, end, ins, outs } = this.concatCurPrePoint(tabs)
      const laneNum = ins.length + outs
      ins.forEach((items, index) => {
        items.device.forEach((item, i) => {
          const startSaft = splitPoint(safeStart, safeEnd, (index + outs) / laneNum)
          const startOpt = splitPoint(start, end, (index + outs) / laneNum)
          const saftStartLine = splitPoint(startSaft, startOpt, 0.45 + i * 0.2)
          const nextStart = splitPoint(safeStart, safeEnd, (index + outs + 1) / laneNum)
          const nextEnd = splitPoint(start, end, (index + outs + 1) / laneNum)
          const endSaftEndLine = splitPoint(nextStart, nextEnd, 0.45 + i * 0.2)
          const orgins = coord.math2svg(splitPoint(saftStartLine, endSaftEndLine, 0.5))
          const widths = 30
          const bgWidths = widths * 0.8 / 0.46875
          const symbolWidth = widths * 0.9
          const fillColor = tabInfo === `${tabs}_${index}_${i}` || item.deviceColor ? '#ee4e4e' : '#1B98FF'
          d3.select('#cb-aspects-devices-bg')
            .append('use')
            .attr('xlink:href', '#DEVEICE-BACKGROUND')
            .attr('transform', `translate(${orgins.x - symbolWidth / 2} ${orgins.y - bgWidths / 2})`)
            .attr('width', `${bgWidths}`)
            .attr('height', `${bgWidths}`)
            .attr('fill', fillColor)
            .attr('id', `cb-aspects-icons-${tabs}_${index}_${i}`)
            .attr('indexs', `${tabs}_${index}_${i}`)
            .attr('option', `${orgins.x},${orgins.y}`)
            .attr('stroke', 'none')
            .on('click', function () {
              d3.event.stopPropagation()
              const { prevDrection, originData, streetInfos: newStreetInfos } = self.state
              const indexs = this.getAttribute('indexs')
              const { obj, insIndex, devicesIndex } = devicesAllInfoIndex(newStreetInfos, indexs) // 当前车道的信息obj, 进口道的下标，设备的下标
              self.setState({
                centerColor: true
              })

              const streetsClone = JSON.parse(JSON.stringify(originData))
              const resData = []
              streetsClone.forEach(items => {
                const goalData = newStreetInfos.find(item => item.tabs === items.tabs)
                if (goalData) {
                  resData.push(goalData)
                } else {
                  resData.push(items)
                }
              })
              let callbackPrevFunc = null
              if (prevDrection) {
                const { objIndex, insIndex, directionPrev, directionBack } = prevDrection ? prevDrectionAllInfoIndex(prevDrection) : null
                callbackPrevFunc = [newStreetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
              }
              d3.select('#cb-aspects-devices-bg').selectAll('*').attr('fill', '#1B98FF')
              self.props.centerCallback(true, true)
              self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
              d3.select(`#cb-aspects-icons-${indexs}`).attr('fill', '#ee4e4e')

              self.props.deviceCallback(obj, insIndex, devicesIndex)
              d3.select('#cb-center-light-edited').selectAll('*').remove()
              self.drawCenter()
            })
          d3.select('#cb-aspects-devices')
            .append('use')
            .attr('xlink:href', `#${item.type}`)
            .attr('transform', `translate(${orgins.x - symbolWidth / 2} ${orgins.y - bgWidths / 2}) scale(0.9)`)
            .attr('width', `${symbolWidth}`)
            .attr('fill', '#FFFFFF')
            .attr('option', `${orgins.x},${orgins.y}`)
            .attr('indexs', `${tabs}_${index}_${i}`)
            .attr('stroke', '#FFFFFF')
            .on('click', function () {
              d3.event.stopPropagation()
              const indexs = this.getAttribute('indexs')
              const { prevDrection, originData, streetInfos: newStreetInfos } = self.state
              const { obj, insIndex, devicesIndex } = devicesAllInfoIndex(streetInfos, indexs) // 当前车道的信息obj, 进口道的下标，设备的下标
              self.setState({
                centerColor: true
              })
              const streetsClone = JSON.parse(JSON.stringify(originData))
              const resData = []
              streetsClone.forEach(items => {
                const goalData = newStreetInfos.find(item => item.tabs === items.tabs)
                if (goalData) {
                  resData.push(goalData)
                } else {
                  resData.push(items)
                }
              })
              self.props.centerCallback(true, true)
              let callbackPrevFunc = null
              if (prevDrection) {
                const { objIndex, insIndex, directionPrev, directionBack } = prevDrection ? prevDrectionAllInfoIndex(prevDrection) : null
                callbackPrevFunc = [newStreetInfos[objIndex].tabs, insIndex, directionPrev, directionBack]
              }
              self.deviceOptionProps(callbackPrevFunc, originData, resData, null)
              d3.select('#cb-aspects-devices-bg').selectAll('*').attr('fill', '#1B98FF')
              d3.select(`#cb-aspects-icons-${indexs}`).attr('fill', '#ee4e4e')
              self.props.deviceCallback(obj, insIndex, devicesIndex)
              d3.select('#cb-center-light-edited').selectAll('*').remove()
              self.drawCenter()
            })
        })
      })
    })
  }

  deviceOptionProps (callbackPrevFunc, originData, resData, index) {
    const prev1 = callbackPrevFunc ? callbackPrevFunc[0] : null
    const prev2 = callbackPrevFunc ? callbackPrevFunc[1] : null
    const prev3 = callbackPrevFunc ? callbackPrevFunc[2] : null
    const prev4 = callbackPrevFunc ? callbackPrevFunc[3] : null
    this.props.prevDrectionPrevFunc(prev1, prev2, prev3, prev4)
    this.props.dataFunc(originData, resData, index)
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
        const { safeStart, safeEnd, start, end, ins, outs } = this.concatCurPrePoint(i)
        const { x: xCurveStart, y: yCurveStart } = coord.math2svg(safeStart)
        const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(safeEnd)
        const { x: xStart, y: yStart } = coord.math2svg(start)
        const { x: xEnd, y: yEnd } = coord.math2svg(end)
        const laneNum = ins.length + outs
        if (laneNum === 0) {
          return ''
        }
        const stopPoints = segmentDividePoints({ x: xCurveStart, y: yCurveStart }, { x: xCurveEnd, y: yCurveEnd }, laneNum)
        const terminalPoints = segmentDividePoints({ x: xStart, y: yStart }, { x: xEnd, y: yEnd }, laneNum)
        const result = zip(stopPoints, terminalPoints).reduce((p, v, i) => {
          const { x: x0, y: y0 } = v[0]
          const { x: xCenter, y: yCenter } = splitPoint(v[0], v[1], 40 / pointLenth(v[0], v[1]))
          const splitV = splitPoint(v[1], v[0], 0.3)
          const insLen = pointLenth(v[0], splitV)
          const num = insLen / 10
          let strs = i < outs ? '' : `M ${x0} ${y0} L ${xCenter} ${yCenter} `

          for (let x = 0; x < num - 1; x++) {
            if (x % 2 === 0) {
              const { x: splitStartx, y: splitStarty } = splitPoint(v[0], v[1], x * 10 / insLen)
              const { x: splitStartx1, y: splitStarty1 } = splitPoint(v[0], v[1], (x + 1) * 10 / insLen)
              strs += `M ${splitStartx} ${splitStarty} L ${splitStartx1} ${splitStarty1} `
            }
          }
          return p.concat(strs)
        }, '')
        return result
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('key', (d, i) => `curve-start-line${i}`)
  }

  drawDirections () {
    const { coord, streetInfos } = this.state
    let guidesPoints = streetInfos.reduce((p, c, i, a) => {
      const { safeStart, safeEnd, ins, outs, angle, width } = this.concatCurPrePoint(i)
      const laneNum = ins.length + outs
      if (laneNum === 0) {
        return [
          ...p
        ]
      }
      const index = i
      const { x: xCurveStart, y: yCurveStart } = coord.math2svg(safeStart)
      const { x: xCurveEnd, y: yCurveEnd } = coord.math2svg(safeEnd)
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
          result = [...p, { ...c, angle, isOut, directions, index, insIdx, safeStart, safeEnd, width, ins, outs }]
        }
        return result
      }, [])
      return [
        ...p,
        ...laneMidPoints
      ]
    }, [])
    guidesPoints = guidesPoints.filter(items => items.directions.length !== 0)
    d3.select('#cb-aspects-dircections')
      .selectAll('use')
      .data(guidesPoints)
      .enter()
      .append('use')
      .attr('xlink:href', (v, i) => {
        const { directions } = v
        const direList = directions.length > 2 ? ['STRAIGHT', 'RIGHT'] : directions
        const symbolStr = directions2Id(direList)
        return symbolStr
      })
      .attr('fill', '#FFFFFF')
      .attr('transform', (v, i) => {
        const { directions } = v
        const { x: x1, y: y1, angle, isOut } = v
        const direList = directions.length > 2 ? ['STRAIGHT', 'RIGHT'] : directions
        const revist = JSON.parse(JSON.stringify(direList))
        const symbolStr = directions2Id(direList)
        const symbolStrRer = directions2Id(revist.reverse())
        const symbolWidth = d3.select(symbolStr)._groups[0][0] !== null ? d3.select(symbolStr).attr('width') / 2 : d3.select(symbolStrRer).attr('width') / 2
        // const laneWidth = width / (ins.length + outs)
        const s = 1.2
        const opt = 1
        const scales = 1
        const w = symbolWidth
        const h = 90
        const { x: x0, y: y0 } = { x: w * scales, y: isOut ? h * 1 : h * -0.08 }
        const { from } = angle
        const signAngle = from + (isOut ? 0 : 180)
        const result = `translate(${x1 - x0} ${y1 - y0}) rotate(${signAngle} ${x0} ${y0}) translate(${x0 * (1 - opt)} ${y0 * (1 - opt)}) scale(${s}) `

        return result
      })
      .attr('stroke', 'none')
      .attr('fill', '#ffffff')
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
        const { safeEnd, safeStart, outs, ins } = this.concatCurPoint(i)
        const { x: xJoint, y: yJoint } = safeEnd
        const { x: xNextJoint, y: yNextJoint } = safeStart
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
Channelization.defaultProps = {
  deviceCallback: () => {},
  centerCallback: (e, v) => {},
  dataFunc: () => {},
  prevDrectionPrevFunc: () => {},
  addBtnBool: true,
  showCenterLight: true,
  centerColor: false,
  deviceModalWidth: 150,
  prevModalWidth: 180,
  contentScale: { x: 1, y: 1 }
}
Channelization.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object]),
  contentScale: PropTypes.oneOfType([PropTypes.object]),
  background: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  deviceCallback: PropTypes.oneOfType([PropTypes.func]),
  centerCallback: PropTypes.oneOfType([PropTypes.func]),
  dataFunc: PropTypes.oneOfType([PropTypes.func]),
  prevDrectionPrevFunc: PropTypes.oneOfType([PropTypes.func]),
  addBtnBool: PropTypes.oneOfType([PropTypes.bool]),
  showCenterLight: PropTypes.oneOfType([PropTypes.bool]),
  centerColor: PropTypes.oneOfType([PropTypes.bool]),
  deviceModalWidth: PropTypes.oneOfType([PropTypes.number]),
  prevModalWidth: PropTypes.oneOfType([PropTypes.number]),
  crossWolkWidth: PropTypes.oneOfType([PropTypes.number]),
  crossWolkHeight: PropTypes.oneOfType([PropTypes.number])
}
export default Channelization
