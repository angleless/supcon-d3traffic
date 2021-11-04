import React, { Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import './index.less'

class InnerAddDirections extends Component {
  state = {
    checked: false,
    areaLength: 0,
    showModals: false,
    showText: '',
    directionList: [[{
      name: 'STRAIGHT',
      func: 'straightSvg'
    }, {
      name: 'LEFT',
      func: 'leftSvg'
    }, {
      name: 'BACK',
      func: 'backSvg'
    }, {
      name: 'RIGHT',
      func: 'rightSvg'
    }], [{
      name: 'STRAIGHT_RIGHT',
      func: 'straightRightSvg'
    }, {
      name: 'STRAIGHT_LEFT',
      func: 'straightLeft'
    }, {
      name: 'BACK_LEFT',
      func: 'backLeft'
    }, {
      name: 'BACK_RIGHT',
      func: 'backRight'
    }], [{
      name: 'LEFT_RIGHT',
      func: 'leftRightSvg'
    }, {
      name: 'DELETE',
      func: 'deleteSvg'
    }]]
  }

  componentDidMount () {
    document.body.addEventListener('click', this.eventCancel)
    const { showModals, areaLength, checked } = this.props
    this.setState({
      showModals,
      areaLength,
      checked
    })
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.eventCancel, false)
  }

  componentDidUpdate (propData) {
    const { showModals, checked, areaLength } = this.props

    if (propData.showModals !== showModals) {
      this.setState({
        showModals,
      })
    }
    if(this.state.checked != checked){
      this.setState({
        checked: checked})
    }
    if(propData.areaLength != this.props.areaLength){
      this.setState({
        areaLength: this.props.areaLength})
    }
    // if(propData.areaLength != this.props.areaLength || (areaLength && this.state.areaLength != areaLength)){
    //   this.setState({
    //     areaLength: areaLength})
    // }
  }

  eventCancel = (e) => {
    if (e.srcElement && e.srcElement.getAttribute('name') !== 'editedAddDirection') {
      this.props.closeAddDirectionsModal();
      // this.setState({
      //   showModals: false,
      //   areaLength: 0
      // })
    } else {
      this.setState({
        showModals: true
      })
    }
  }

  straightSvg = () => (
    <svg name='editedAddDirection' width='34' height='34' id='STRAIGHT' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='STRAIGHT_PATH' fill='#333333' d='M 478.38 412.002 H 430.654 L 513.55 0 L 593.346 412.002 h -52.09 V 1024 h -62.8755 Z' />
    </svg>
  )

  leftSvg = () => (
    <svg name='editedAddDirection' id='LEFT' viewBox='0 0 1024 1024' fill='#333333' width='34' height='34'>
      <path name='editedAddDirection' id='LEFT_PATH' d='M 450.608 0 L 373.234 290.022 l 77.3742 267.609 V 394.919 l 138.766 137.159 V 1024 H 650.766 V 376.727 L 450.608 172.118 Z' />
    </svg>
  )

  backSvg = () => (
    <svg name='editedAddDirection' id='BACK' width='34' height='34' fill='#333333' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='BACK_PATH' d='M 696.889 1024 V 125.819 C 660.414 41.9271 607.953 0 539.525 0 C 471.097 0 422.874 41.9366 394.875 125.819 v 212.158 H 327.111 l 99.5461 407.96 l 108.136 -407.96 h -69.5467 v -94.9096 c 4.95882 -62.0658 29.7244 -93.1081 74.2779 -93.1081 c 44.563 0 73.7185 31.0424 87.4667 93.1081 V 1024' />
    </svg>
  )

  rightSvg = () => (
    <svg name='editedAddDirection' id='RIGHT' width='34' height='34' fill='#333333' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='RIGHT_PATH' d='M 571.277 0 L 645.981 290.022 l -74.7041 267.609 V 394.919 l -133.981 137.159 V 1024 H 378.019 V 376.727 l 193.258 -204.609 Z' />
    </svg>
  )

  straightRightSvg = () => (
    <svg name='editedAddDirection' id='STRAIGHT_RIGHT' width='34' height='34' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='STRAIGHT_RIGHT_PATH' fill='#333333' d='M 405.36 1024 V 413.103 H 354.093 L 433.238 0 l 79.1351 413.103 h -49.5731 v 337.413 L 600.906 614.41 v -168.051 L 669.907 718.733 l -69.0004 258.699 V 823.928 L 462.81 952.09 V 1024 Z' />
    </svg>
  )

  straightBackSvg = () => (
    <svg name='editedAddDirection' id='STRAIGHT_BACK' width='32'>
      <path name='editedAddDirection' id='STRAIGHT_BACK_PATH' fill='#333333' d='M3.73333333,33.1000591 L3.73333333,48.0533927 L-2.33119576e-13,24.0266963 L3.73333333,2.84217094e-14 L3.73333333,15.0800368 L13.9408006,31.4349277 L14,31.4349277 L14,90 L11.2,90 L11.2,45.0635085 L3.73333333,33.1000591 Z' />
    </svg>
  )

  straightLeft = () => (
    <svg name='editedAddDirection' id='STRAIGHT_LEFT' width='34' height='34' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' fill='#333333' id='STRAIGHT_LEFT_PATH' d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
    </svg>
  )

  backLeft = () => (
    <svg id='BACK_LEFT' name='editedAddDirection' viewBox='0 0 1024 1024' width='34' height='34'>
            <path id='BACK_LEFT_PATH' name='editedAddDirection' d='M451.176296 0v170.524444L649.481481 373.238519V1014.518519h-60.823703V674.778074c-10.391704-29.790815-28.254815-44.695704-53.570371-44.695704-29.705481 0-46.212741 20.517926-49.521777 61.534815v62.738963h46.364444L459.851852 1024 393.481481 754.346667h45.17926V614.115556C457.320296 558.677333 489.472 530.962963 535.087407 530.962963c19.882667 0 37.736296 5.262222 53.579852 15.796148v-19.607704L451.166815 391.262815v161.204148L374.518519 287.336296 451.176296 0z' />

      {/* <path id='BACK_LEFT_PATH' name='editedAddDirection' d='M589.302519 0L663.703704 408.187259h-48.57363V1014.518519h-58.624V684.73363l-3.982222 6.893037c-8.590222-39.973926-26.548148-60.472889-53.883259-61.496889l-2.180741-0.047408c-28.558222 0-44.439704 20.517926-47.616 61.534815v62.738963h44.581926L424.106667 1024 360.296296 754.346667h43.434667V614.115556C421.679407 558.677333 452.589037 530.962963 496.459852 530.962963c22.784 0 42.799407 7.471407 60.055704 22.423704l-0.009482-145.199408H512L589.302519 0z' /> */}
    </svg>
  )

  backRight = () => (
    <svg id='BACK_RIGHT' name='editedAddDirection' viewBox='0 0 1024 1024' width='34' height='34'>
      <path id='BACK_RIGHT_PATH' name='editedAddDirection' d='M674.452645 0L751.483871 287.331097 674.452645 552.464516v-161.197419l-138.173935 135.894709v487.357936h-61.109678V688.194065c-9.529806-38.730323-28.787613-58.103742-57.806451-58.103742-29.844645 0-46.426839 20.513032-49.763097 61.539096v62.728258h46.592L341.751742 1024 275.059613 754.357677h45.402839v-140.238451c18.745806-55.444645 51.051355-83.15871 96.900129-83.15871 21.652645 0 40.910452 6.177032 57.806451 18.547613V373.248l199.283613-202.718968V0z'  />
    </svg>
  )

  leftRightSvg = () => (
    <svg name='editedAddDirection' id='LEFT_RIGHT' width='34' height='34' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' fill='#333333' id='LEFT_RIGHT_PATH' d='M 478.505 1024 V 526.547 L 345.337 394.919 v 162.711 L 267.963 290.022 L 345.337 0 v 172.118 L 512 342.485 l 166.663 -170.367 V 0 L 756.037 290.022 l -77.3742 267.609 V 394.919 L 545.495 526.547 V 1024 h -66.9907 Z' />
    </svg>
  )

  handleOnMouseOut = (str) => {
    d3.select(`#${str}_PATH`).attr('fill', '#333333')
    this.setState({
      showText: ''
    })
  }

  handleOnMouseOver = (str) => {
    d3.select(`#${str}_PATH`).attr('fill', '#fff')
    this.setState({
      showText: str
    })
  }

  drawerDirectionModal = () => {
    let isShowDelete = false
    if (this.props.editRoadParams) {
      const deviceIndex = this.props.editRoadParams.split('_')
      isShowDelete = !deviceIndex[2]
    }
    return this.state.directionList.map((items, index) => {
      return (
        <tr key={index}>
          {
            items.map((item, i) => {
              if (isShowDelete && item.name === 'DELETE') {
                return null
              } else {
                return (
                  <td key={`${index}_${i}`}>
                    {
                      item.name !== 'DELETE' &&
                        <div
                          name='editedAddDirection'
                          className={`add-device-svg ${item.name === this.state.showText ? 'select-bg' : ''}`}
                          onMouseOver={() => {
                            this.handleOnMouseOver(item.name)
                          }}
                          onClick={() => {
                            this.props.handleSelectDirection(item.name)
                          }}
                          onMouseOut={() => {
                            this.handleOnMouseOut(item.name)
                          }}
                        >
                          {this[`${item.func}`]()}
                        </div>
                    }
                    {
                      item.name === 'DELETE' &&
                        <div
                          onMouseOver={() => {
                            this.setState({
                              showText: item.name
                            })
                          }}
                          onClick={() => {
                            this.props.handleSelectDirection(item.name)
                          }}
                          onMouseOut={() => {
                            this.setState({
                              showText: ''
                            })
                          }}
                          name='editedAddDirection'
                          className={`delete-btn ${item.name === this.state.showText ? 'select-bg' : ''}`}
                        >
                          <span name='editedAddDirection'>清除</span>
                        </div>
                    }
                  </td>
                )
              }
            })
          }
        </tr>
      )
    })
  }

  _click = (e)=>{
    const { handleWaitingArea } = this.props;
    this.setState({checked: !this.state.checked})
    handleWaitingArea && handleWaitingArea(!this.state.checked, this.state.areaLength, true)
  }

  _change = (e)=>{
    const { handleWaitingArea } = this.props;
    if(e.target.value === ''){
      this.setState({areaLength: 0})
    }
    const number = parseInt(e.target.value);
    if(!Number.isNaN(number)){
      this.setState({areaLength: number})
      handleWaitingArea && handleWaitingArea(this.state.checked, number)

    }
  }

  render () {
    const { modalCoordinate: { x, y } } = this.props
    const { checked, areaLength } = this.state;
    // console.log('areaLength',areaLength)
    return (
      <foreignObject id='cb-aspects-Directions-Modal' x={x} y={y} width={this.state.showModals ? 281 : 0} height={this.state.showModals ? 215 : 0}>
        <div name='editedAddDirection' className={`add-directions ${this.state.showModals ? '' : 'no-box'}`}>
          {
            this.state.showModals &&
            <React.Fragment>
              <table className='direction-tables'>
                <tbody>
                  {this.drawerDirectionModal()}
                </tbody>
              </table>

                  <div className='direction-waiting-area'>
                    <div>
                      <input name='editedAddDirection' checked={checked || false} onClick={this._click} type="checkbox"/>
                      <span>是否有待停区</span>
                    </div>
                    <div className='waiting-area'>
                      <span>长度</span>
                      <input autoFocus value={areaLength || ''} onChange={this._change} name='editedAddDirection' type="text"/>
                      <span>米</span>
                    </div>
                  </div>
            </React.Fragment>
          }
        </div>
      </foreignObject>
    )
  }
}

InnerAddDirections.defaultProps = {
  handleSelectDirection: () => { },
  modalCoordinate: { x: 0, y: 0 }
}
InnerAddDirections.propTypes = {
  handleSelectDirection: PropTypes.oneOfType([PropTypes.func]),
  modalCoordinate: PropTypes.oneOfType([PropTypes.object])
}

export default InnerAddDirections
