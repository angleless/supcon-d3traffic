import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.less'

class CenterLight extends Component {
  state={
    isEdited: false,
    isSelect: false
  }

  componentDidMount () {
    const { isEdited, isSelect } = this.props
    document.body.addEventListener('click', this.eventCancel)
    this.setState({
      isEdited,
      isSelect
    })
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.eventCancel, false)
  }

  drawRedSvg = () => (
    <svg name='editedCenterLight' id='CENTER-LIGHT' viewBox='0 0 1024 1024' width='12' height='12'>
      <path name='editedCenterLight' fill='#ffffff' d='M 773.689 273.067 H 267.378 c -108.089 0 -199.111 91.0222 -199.111 199.111 s 91.0222 199.111 199.111 199.111 h 506.311 c 108.089 0 199.111 -91.0222 199.111 -199.111 s -91.0222 -199.111 -199.111 -199.111 Z M 256 568.889 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 s 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z m 273.067 0 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 s 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z m 261.689 0 c -51.2 0 -91.0222 -39.8222 -91.0222 -91.0222 c 0 -51.2 39.8222 -91.0222 91.0222 -91.0222 c 51.2 0 91.0222 39.8222 91.0222 91.0222 c 0 51.2 -39.8222 91.0222 -91.0222 91.0222 Z' />
    </svg>
  )

  componentDidUpdate (propData) {
    const { isEdited, isSelect } = this.props
    if (propData.isEdited !== isEdited || propData.isSelect !== isSelect) {
      this.setState({
        isEdited,
        isSelect
      })
    }
  }

  eventCancel = (e) => {
    // if (e.srcElement.getAttribute('name') !== 'editedCenterLight') {
    //   this.setState({
    //     isEdited: false,
    //     isSelect: false
    //   })
    // }
  }

  handleEditCenterBtn = () => {
    this.setState({
      isEdited: !this.state.isEdited
    }, () => {
      this.props.handleEditCenterBtn(this.state.isEdited)
    })
  }

  handleSelected = () => {
    this.setState({
      isSelect: true
    }, () => {
      this.props.handleSelected(this.state.isEdited)
    })
  }

  render () {
    const { coordinate } = this.props
    return (
      <foreignObject id='cb-aspects-Directions-Modal' x={coordinate.x} y={coordinate.y} width={50} height={50}>
        <div className='centerLight' name='editedCenterLight'>
          {
            this.state.isEdited &&
              <div className='edited-center' name='editedCenterLight' onClick={this.handleEditCenterBtn}>
                <i className='edited-h' name='editedCenterLight' />
                <i className='edited-c' name='editedCenterLight' />
              </div>
          }
          {
            !this.state.isEdited &&
              <div name='editedCenterLight' className={`svg-center ${!this.state.isSelect ? 'unedit-color' : ''}`} onClick={this.handleSelected}>
                {this.drawRedSvg()}
              </div>
          }
        </div>
      </foreignObject>
    )
  }
}

CenterLight.defaultProps = {
  handleEditCenterBtn: () => {},
  handleSelected: () => {},
  coordinate: { x: 0, y: 0 }
}

CenterLight.propTypes = {
  handleEditCenterBtn: PropTypes.oneOfType([PropTypes.func]),
  handleSelected: PropTypes.oneOfType([PropTypes.func]),
  coordinate: PropTypes.oneOfType([PropTypes.object])
}

export default CenterLight
