import React, { Component } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import './index.less'

class AddDirection extends Component {
    state={
      showModals: false
    }

    componentDidMount () {
      document.body.addEventListener('click', this.eventCancel)
      this.setState({
        showModals: this.state.showModals
      })
    }

    componentWillUnmount () {
      document.body.removeEventListener('click', this.eventCancel, false)
    }

    componentDidUpdate (propData) {
      const { showModals } = this.props
      if (propData.showModals !== showModals) {
        this.setState({
          showModals
        })
      }
    }

      eventCancel = (e) => {
        if (e.srcElement.getAttribute('name') !== 'editedAddDirection') {
          this.setState({
            showModals: false
          })
        } else {
          this.setState({
            showModals: true
          })
        }
      }

  straightSvg = () => (
    <svg name='editedAddDirection' width='24' height='24' id='STRAIGHT' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='STRAIGHT_PATH' fill='#333333' d='M 478.38 412.002 H 430.654 L 513.55 0 L 593.346 412.002 h -52.09 V 1024 h -62.8755 Z' />
    </svg>
  )

  leftSvg = () => (
    <svg name='editedAddDirection' id='LEFT' viewBox='0 0 1024 1024' fill='#333333' width='24' height='24'>
      <path name='editedAddDirection' id='LEFT_PATH' d='M 450.608 0 L 373.234 290.022 l 77.3742 267.609 V 394.919 l 138.766 137.159 V 1024 H 650.766 V 376.727 L 450.608 172.118 Z' />
    </svg>
  )

  backSvg = () => (
    <svg name='editedAddDirection' id='BACK' width='24' height='24' fill='#333333' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='BACK_PATH' d='M 696.889 1024 V 125.819 C 660.414 41.9271 607.953 0 539.525 0 C 471.097 0 422.874 41.9366 394.875 125.819 v 212.158 H 327.111 l 99.5461 407.96 l 108.136 -407.96 h -69.5467 v -94.9096 c 4.95882 -62.0658 29.7244 -93.1081 74.2779 -93.1081 c 44.563 0 73.7185 31.0424 87.4667 93.1081 V 1024' />
    </svg>
  )

  rightSvg = () => (
    <svg name='editedAddDirection' id='RIGHT' width='24' fill='#333333' height='24' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='RIGHT_PATH' d='M 571.277 0 L 645.981 290.022 l -74.7041 267.609 V 394.919 l -133.981 137.159 V 1024 H 378.019 V 376.727 l 193.258 -204.609 Z' />
    </svg>
  )

  straightRightSvg = () => (
    <svg name='editedAddDirection' id='STRAIGHT_RIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' id='STRAIGHT_RIGHT_PATH' fill='#333333' d='M 405.36 1024 V 413.103 H 354.093 L 433.238 0 l 79.1351 413.103 h -49.5731 v 337.413 L 600.906 614.41 v -168.051 L 669.907 718.733 l -69.0004 258.699 V 823.928 L 462.81 952.09 V 1024 Z' />
    </svg>
  )

  straightBackSvg = () => (
    <svg name='editedAddDirection' id='STRAIGHT_BACK' width='32'>
      <path name='editedAddDirection' id='STRAIGHT_BACK_PATH' fill='#333333' d='M3.73333333,33.1000591 L3.73333333,48.0533927 L-2.33119576e-13,24.0266963 L3.73333333,2.84217094e-14 L3.73333333,15.0800368 L13.9408006,31.4349277 L14,31.4349277 L14,90 L11.2,90 L11.2,45.0635085 L3.73333333,33.1000591 Z' />
    </svg>
  )

  leftBackSvg = () => (
    <svg id='LEFT_BACK' name='editedAddDirection' width='24'>
      <polygon name='editedAddDirection' id='LEFT_BACK_PATH' points='6.80017205 0 0 25.4898044 6.80017205 49.0104037 6.80017205 34.7099459 18.9968532 46.7648772 18.9968532 90 24.3925234 90 24.3925234 33.1111111 6.80017205 15.127757' />
    </svg>
  )

  straightLeft = () => (
    <svg name='editedAddDirection' id='STRAIGHT_LEFT' width='24' height='24' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' fill='#333333' id='STRAIGHT_LEFT_PATH' d='M 615.414 1024 V 413.103 H 665.122 L 588.379 0 l -76.7426 413.103 h 48.0706 v 337.413 L 425.783 614.41 v -168.051 L 358.879 718.733 l 66.9045 258.699 V 823.928 l 133.924 128.163 V 1024 Z' />
    </svg>
  )

  leftRightSvg = () => (
    <svg name='editedAddDirection' id='LEFT_RIGHT' width='24' height='24' viewBox='0 0 1024 1024'>
      <path name='editedAddDirection' fill='#333333' id='LEFT_RIGHT_PATH' d='M 478.505 1024 V 526.547 L 345.337 394.919 v 162.711 L 267.963 290.022 L 345.337 0 v 172.118 L 512 342.485 l 166.663 -170.367 V 0 L 756.037 290.022 l -77.3742 267.609 V 394.919 L 545.495 526.547 V 1024 h -66.9907 Z' />
    </svg>
  )

  handleOnMouseOut = (str) => {
    d3.select(`#${str}_PATH`).attr('fill', '#333333')
  }

  handleOnMouseOver = (str) => {
    d3.select(`#${str}_PATH`).attr('fill', '#0070CC')
  }

  render () {
    const { rotateorigin, origin, coordinate, rotateadjust, id } = this.props
    return (
      <div name='editedAddDirection' className={`add-directions ${this.state.showModals ? '' : 'no-box'}`} rotateorigin={rotateorigin} origin={origin} coordinate={coordinate} rotateadjust={rotateadjust} id={id}>
        {
          this.state.showModals &&
            <div name='editedAddDirection' className='add-direction-models'>
              <div name='editedAddDirection' className='add-direction-warp'>
                <div name='editedAddDirection' className='add-device-models-content'>
                  <div
                    name='editedAddDirection'
                    className='add-device-svg'
                    onMouseOver={() => {
                      this.handleOnMouseOver('STRAIGHT')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('STRAIGHT')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('STRAIGHT')
                    }}
                  >
                    {this.straightSvg()}
                  </div>
                  <div
                    name='editedAddDirection'
                    className='add-device-svg'
                    onMouseOver={() => {
                      this.handleOnMouseOver('LEFT')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('LEFT')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('LEFT')
                    }}
                  >
                    {this.leftSvg()}
                  </div>
                  <div
                    className='add-device-svg'
                    name='editedAddDirection'
                    onMouseOver={() => {
                      this.handleOnMouseOver('BACK')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('BACK')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('BACK')
                    }}
                  >
                    {this.backSvg()}
                  </div>
                  <div
                    className='add-device-svg'
                    name='editedAddDirection'
                    onMouseOver={() => {
                      this.handleOnMouseOver('RIGHT')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('RIGHT')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('RIGHT')
                    }}
                  >
                    {this.rightSvg()}
                  </div>
                  <div
                    className='add-device-svg'
                    name='editedAddDirection'
                    onMouseOver={() => {
                      this.handleOnMouseOver('STRAIGHT_RIGHT')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('STRAIGHT_RIGHT')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('STRAIGHT_RIGHT')
                    }}
                  >
                    {this.straightRightSvg()}
                  </div>
                  <div
                    className='add-device-svg'
                    name='editedAddDirection'
                    onMouseOver={() => {
                      this.handleOnMouseOver('STRAIGHT_LEFT')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('STRAIGHT_LEFT')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('STRAIGHT_LEFT')
                    }}
                  >
                    {this.straightLeft()}
                  </div>
                  <div
                    className='add-device-svg'
                    name='editedAddDirection'
                    onMouseOver={() => {
                      this.handleOnMouseOver('LEFT_RIGHT')
                    }}
                    onClick={() => {
                      this.props.handleSelectDirection('LEFT_RIGHT')
                    }}
                    onMouseOut={() => {
                      this.handleOnMouseOut('LEFT_RIGHT')
                    }}
                  >
                    {this.leftRightSvg()}
                  </div>
                </div>
                <i className='arrows' name='editedAddDirection' />
              </div>
            </div>
        }
      </div>
    )
  }
}
AddDirection.defaultProps = {
  handleSelectDirection: () => {},
  rotateorigin: 'pluginCenter',
  origin: 'road[1]{2}',
  coordinate: { x: -20, y: -70 },
  rotateadjust: '0',
  id: 'addDeviceModels'
}

AddDirection.propTypes = {
  handleSelectDirection: PropTypes.oneOfType([PropTypes.func])
}

export default AddDirection
