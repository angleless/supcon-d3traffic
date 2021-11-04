import React, { Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import './index.less'

class InnerAddDevice extends Component {
  state={
    showModals: false,
    modalCoordinate: { x: 0, y: 0 },
    showText: '',
    deviceList: [[{
      nameEn: 'CAMERA',
      name: '视频',
      func: 'cameraSvg'
    }, {
      nameEn: 'COIL',
      name: '线圈',
      func: 'coilSvg'
    }, {
      nameEn: 'GANTRY',
      name: '卡口',
      func: 'gantrySvg'
    }], [{
      nameEn: 'COMPDETECTOR',
      name: '复合设备',
      func: 'compdetector'
    }, {
      nameEn: 'RADAR',
      name: '雷达',
      func: 'radarSvg'
    }, {
      nameEn: 'DELETE-DEVICES',
      name: '删除设备',
      func: 'deleteDevicesSvg'
    }]]
  }

  componentDidMount () {
    // d3.select('#CENTER-LIGHT').attr('transform', 'rotate(90)')
    d3.select('#COIL')
      .attr('stroke', '#333333')
    document.body.addEventListener('click', this.eventCancel)
    // d3.select('#cb-aspects-Device-Modal').attr('width', function () {
    //   console.log(d3.select('#innerDevice').attr('width'))
    //   return d3.select('#innerDevice').attr('width')
    // })
    const { showModals, modalCoordinate } = this.props
    this.setState({
      showModals,
      modalCoordinate
    })
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.eventCancel, false)
  }

  componentDidUpdate (propData) {
    const { showModals, modalCoordinate } = this.props
    if (propData.showModals !== showModals || propData.modalCoordinate !== modalCoordinate) {
      this.setState({
        showModals,
        modalCoordinate
      }, () => {
      })
    }
  }

  eventCancel = (e) => {
    if (e.srcElement.getAttribute('name') !== 'editedAddDevice') {
      this.setState({
        showModals: false
      })
    } else {
      this.setState({
        showModals: true
      })
    }
  }

  cameraSvg = () => (
    <svg name='editedAddDevice' id='CAMERA' viewBox='0 0 1024 1024' width='26' height='26'>
      <path fill={this.state.showText === 'CAMERA' ? '#fff' : '#737373'} name='editedAddDevice' d='M728.177778 307.2v56.888889h-455.111111v-56.888889h455.111111zM881.777778 227.555556H130.844444v221.866666h750.933334V227.555556z m-375.466667 358.4c39.822222 0 68.266667 28.444444 68.266667 68.266666s-28.444444 68.266667-68.266667 68.266667-68.266667-28.444444-68.266667-68.266667c0-34.133333 28.444444-68.266667 68.266667-68.266666zM796.444444 506.311111H210.488889C210.488889 665.6 341.333333 796.444444 500.622222 796.444444S796.444444 665.6 796.444444 506.311111zM881.777778 170.666667c28.444444 0 56.888889 22.755556 56.888889 56.888889v221.866666c0 28.444444-22.755556 56.888889-56.888889 56.888889H853.333333c0 193.422222-153.6 347.022222-347.022222 347.022222s-347.022222-153.6-347.022222-347.022222h-28.444445c-28.444444 0-56.888889-22.755556-56.888888-56.888889V227.555556c0-28.444444 22.755556-56.888889 56.888888-56.888889h750.933334z' />
    </svg>
  )

  coilSvg = () => (
    <svg name='editedAddDevice' id='COIL' viewBox='0 0 1024 1024' width='30' height='30'>
      <path fill={this.state.showText === 'COIL' ? '#fff' : '#737373'} name='editedAddDevice' d='M853.333333 170.666667H170.666667c-34.133333 0-56.888889 22.755556-56.888889 56.888889v568.888888c0 34.133333 22.755556 56.888889 56.888889 56.888889h682.666666c34.133333 0 56.888889-22.755556 56.888889-56.888889V227.555556c0-34.133333-22.755556-56.888889-56.888889-56.888889z m-284.444444 56.888889v56.888888H455.111111V227.555556h113.777778z m170.666667 113.777777v341.333334H284.444444V341.333333h455.111112zM170.666667 227.555556h227.555555v56.888888H267.377778c-22.755556 0-39.822222 17.066667-39.822222 39.822223V398.222222H170.666667V227.555556z m0 227.555555h56.888889v113.777778H170.666667V455.111111z m0 341.333333v-170.666666h56.888889v73.955555c0 22.755556 17.066667 39.822222 39.822222 39.822223H398.222222v56.888888H170.666667z m284.444444 0v-56.888888h113.777778v56.888888H455.111111z m398.222222 0h-227.555555v-56.888888h130.844444c22.755556 0 39.822222-17.066667 39.822222-39.822223V625.777778h56.888889v170.666666z m0-227.555555h-56.888889V455.111111h56.888889v113.777778z m0-170.666667h-56.888889V324.266667c0-22.755556-17.066667-39.822222-39.822222-39.822223H625.777778V227.555556h227.555555v170.666666z' />
    </svg>
  )

  gantrySvg = () => (
    <svg name='editedAddDevice' id='GANTRY' viewBox='0 0 1024 1024' version='1.1' width='30' height='30'>
      <path fill={this.state.showText === 'GANTRY' ? '#fff' : '#737373'} name='editedAddDevice' d='M256 159.288889l-130.844444 227.555555 540.444444 312.888889 130.844444-227.555555-540.444444-312.888889z m28.444444-56.888889l540.444445 312.888889c34.133333 17.066667 39.822222 56.888889 22.755555 91.022222l-130.844444 227.555556c-17.066667 34.133333-56.888889 39.822222-91.022222 22.755555L91.022222 443.733333c-34.133333-17.066667-45.511111-56.888889-22.755555-91.022222l130.844444-227.555555c17.066667-34.133333 56.888889-39.822222 85.333333-22.755556z m620.088889 455.111111c11.377778-17.066667 28.444444-22.755556 45.511111-11.377778 17.066667 11.377778 22.755556 28.444444 11.377778 45.511111l-113.777778 193.422223c-11.377778 17.066667-28.444444 22.755556-45.511111 11.377777-17.066667-11.377778-22.755556-28.444444-11.377777-45.511111l113.777777-193.422222zM227.555556 625.777778c11.377778-17.066667 28.444444-22.755556 45.511111-11.377778l290.133333 170.666667c17.066667 11.377778 22.755556 28.444444 11.377778 45.511111-5.688889 17.066667-28.444444 22.755556-39.822222 11.377778l-119.466667-68.266667-96.711111 164.977778H102.4c-17.066667 0-34.133333-17.066667-34.133333-34.133334s17.066667-34.133333 34.133333-34.133333H284.444444L358.4 739.555556l-119.466667-68.266667c-11.377778-5.688889-17.066667-22.755556-11.377777-45.511111z' />
    </svg>
  )

  compdetector = () => (
    <svg name='editedAddDevice' id='COMPDETECTOR' viewBox='0 0 1024 1024' width='30' height='30'>
      <path fill={this.state.showText === 'COMPDETECTOR' ? '#fff' : '#737373'} name='editedAddDevice' d='M876.088889 369.777778c17.066667 0 34.133333 17.066667 34.133333 34.133333 0 210.488889-170.666667 375.466667-375.466666 375.466667-17.066667 0-34.133333-17.066667-34.133334-34.133334s17.066667-34.133333 34.133334-34.133333c170.666667 0 307.2-136.533333 307.2-307.2 0-17.066667 17.066667-34.133333 34.133333-34.133333zM290.133333 130.844444c11.377778 0 17.066667 5.688889 22.755556 11.377778l102.4 102.4 68.266667-68.266666c17.066667-11.377778 34.133333-17.066667 45.511111-5.688889l5.688889 5.688889c11.377778 11.377778 11.377778 34.133333 0 51.2L352.711111 409.6c-11.377778 11.377778-34.133333 11.377778-51.2 0-11.377778-11.377778-11.377778-34.133333 0-51.2l68.266667-68.266667-91.022222-91.022222H199.111111v642.844445h182.044445c17.066667 0 34.133333 17.066667 34.133333 34.133333s-17.066667 34.133333-34.133333 34.133333H164.977778c-17.066667 0-34.133333-17.066667-34.133334-34.133333V164.977778c0-17.066667 17.066667-34.133333 34.133334-34.133334h125.155555z M739.555556 335.644444c17.066667 0 34.133333 17.066667 34.133333 34.133334 0 153.6-125.155556 273.066667-273.066667 273.066666-17.066667 0-34.133333-17.066667-34.133333-34.133333s17.066667-34.133333 34.133333-34.133333c113.777778 0 204.8-91.022222 204.8-204.8 0-17.066667 11.377778-34.133333 34.133334-34.133334z M603.022222 301.511111c17.066667 0 34.133333 17.066667 34.133334 34.133333 0 96.711111-79.644444 170.666667-170.666667 170.666667-17.066667 0-34.133333-17.066667-34.133333-34.133333s17.066667-34.133333 34.133333-34.133334c56.888889 0 102.4-45.511111 102.4-102.4v-5.688888c0-11.377778 17.066667-28.444444 34.133333-28.444445z' />
    </svg>
  )

  radarSvg = () => (
    <svg name='editedAddDevice' id='RADAR' viewBox='0 0 1024 1024' width='30' height='30'>
      <path fill={this.state.showText === 'RADAR' ? '#fff' : '#737373'} name='editedAddDevice' d='M256 347.022222c11.377778-5.688889 28.444444-5.688889 39.822222 0 11.377778 11.377778 11.377778 28.444444 0 39.822222C227.555556 455.111111 227.555556 563.2 295.822222 631.466667c11.377778 11.377778 11.377778 28.444444 0 39.822222-11.377778 11.377778-28.444444 11.377778-39.822222 0-91.022222-91.022222-91.022222-233.244444 0-324.266667z m483.555556 0c11.377778-11.377778 28.444444-11.377778 39.822222 0 91.022222 91.022222 91.022222 233.244444 0 324.266667-11.377778 11.377778-28.444444 11.377778-39.822222 0-11.377778-11.377778-11.377778-28.444444 0-39.822222 68.266667-68.266667 68.266667-176.355556 0-238.933334-11.377778-11.377778-11.377778-34.133333 0-45.511111zM620.088889 284.444444H420.977778v398.222223h199.111111V284.444444z m0-56.888888c34.133333 0 56.888889 22.755556 56.888889 56.888888v398.222223c0 34.133333-22.755556 56.888889-56.888889 56.888889H420.977778c-34.133333 0-56.888889-22.755556-56.888889-56.888889V284.444444c0-34.133333 22.755556-56.888889 56.888889-56.888888h199.111111zM176.355556 290.133333c5.688889-5.688889 28.444444-5.688889 39.822222 0 11.377778 11.377778 11.377778 34.133333 0 45.511111-102.4 96.711111-102.4 261.688889 0 358.4 11.377778 11.377778 11.377778 28.444444 0 39.822223-11.377778 11.377778-28.444444 11.377778-39.822222 0-125.155556-119.466667-125.155556-318.577778 0-443.733334z m654.222222 0c11.377778-11.377778 28.444444-11.377778 39.822222 0 119.466667 119.466667 119.466667 318.577778 0 443.733334-11.377778 11.377778-28.444444 11.377778-39.822222 0-11.377778-11.377778-11.377778-28.444444 0-39.822223 102.4-102.4 102.4-261.688889 0-364.088888-11.377778-5.688889-11.377778-28.444444 0-39.822223zM620.088889 796.444444c17.066667 0 28.444444 11.377778 28.444444 28.444445s-17.066667 28.444444-28.444444 28.444444H415.288889c-17.066667 0-28.444444-11.377778-28.444445-28.444444s11.377778-28.444444 28.444445-28.444445h204.8z' />
    </svg>
  )

  deleteDevicesSvg = () => (
    <svg name='editedAddDevice' viewBox='0 0 1024 1024' id='DELETE-DEVICES' width='16' height='16'>
      <path name='editedAddDevice' d='M61.44 382.016v-128h896v128zM541.44 382.016h128v448h-128z' fill={this.state.showText === 'DELETE-DEVICES' ? '#fff' : '#737373'} />
      <path name='editedAddDevice' d='M285.44 382.016v448h448v-448h-448z m-128-128h704v704h-704v-704z' fill={this.state.showText === 'DELETE-DEVICES' ? '#fff' : '#737373'} />
      <path name='editedAddDevice' d='M349.44 382.016h128v448h-128zM381.44 254.016h256v-64h-256v64z m384-192v320h-512v-320h512z' fill={this.state.showText === 'DELETE-DEVICES' ? '#fff' : '#737373'} />
    </svg>
  )

  deviceListDrewer1 = () => {
    return this.state.deviceList[0].map((items, index) => {
      // index % 3 === 0 && list.push(<tr>)
      return (
        <td key={index}>
          <div
            className={`${this.state.showText === items.nameEn ? 'active-bg' : 'add-device-svg'}`}
            name='editedAddDevice'
            onClick={() => {
              this.props.deviceClick(items.nameEn)
              this.setState({
                showModals: false
              })
            }}
            onMouseOver={() => {
              this.setState({
                showText: items.nameEn
              })
            }}
            onMouseOut={() => {
              this.setState({
                showText: ''
              })
            }}
          >
            {this[`${items.func}`]()}
            {
              this.state.showText === items.nameEn &&
                <span name='editedAddDevice'>
                  <span name='editedAddDevice'>{items.name}</span>
                </span>
            }
          </div>
        </td>
      )
    })
  }

  deviceListDrewer2 = () => {
    const deviceList = [...this.state.deviceList[1]]
    if (this.props.editRoadParams) {
      const deviceIndex = this.props.editRoadParams.split('_')
      !deviceIndex[2] && deviceList.pop()
    }
    return deviceList.map((items, index) => {
      return (
        <td key={index}>
          <div
            className={`${this.state.showText === items.nameEn ? 'active-bg' : 'add-device-svg'}`}
            name='editedAddDevice'
            onClick={() => {
              this.props.deviceClick(items.nameEn)
              this.setState({
                showModals: false
              })
            }}
            onMouseOver={() => {
              this.setState({
                showText: items.nameEn
              })
            }}
            onMouseOut={() => {
              this.setState({
                showText: ''
              })
            }}
          >
            {items.name === '删除设备' ? <div name='editedAddDevice' className={`${this.state.showText === items.nameEn ? 'active-delete' : 'deletes'}`}>删除</div> : this[`${items.func}`]()}
            {
              this.state.showText === items.nameEn &&
                <span name='editedAddDevice'>
                  <span name='editedAddDevice'>{items.name}</span>
                </span>
            }
          </div>
        </td>
      )
    })
  }

  render () {
    const { modalCoordinate: { x, y } } = this.props
    return (
      <foreignObject id='cb-aspects-Device-Modal' x={x} y={y} width={this.state.showModals ? 194 : 0} height={this.state.showModals ? 160 : 0}>
        <div id='innerDevice' className={`device-modal ${this.state.showModals ? '' : 'no-box'}`} name='editedAddDevice'>
          {
            this.state.showModals &&
              <table className='device-tables'>
                <tbody>
                  <tr>
                    {this.deviceListDrewer1()}
                  </tr>
                  <tr>
                    {this.deviceListDrewer2()}
                  </tr>
                </tbody>
              </table>
          }
          {this.state.showModals && <i className='arrows' name='editedAddDevice' />}
        </div>
      </foreignObject>
    )
  }
}
InnerAddDevice.defaultProps = {
  deviceClick: () => {},
  modalCoordinate: { x: 0, y: 0 }
}
InnerAddDevice.propTypes = {
  deviceClick: PropTypes.oneOfType([PropTypes.func]),
  modalCoordinate: PropTypes.oneOfType([PropTypes.object])
}

export default InnerAddDevice
