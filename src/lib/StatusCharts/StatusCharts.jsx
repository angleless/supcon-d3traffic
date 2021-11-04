import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Aspects from '../Aspects/Aspects'
// import iconDelay from './image/indicator-delay.png'
// import iconJam from './image/indicator-jam.png'
// import iconPark from './image/indicator-park.png'

class StatusCharts extends Component {
  initialState = {
  }

  render () {
    const { width, height, background, data } = this.props
    console.log(data, 'cz')
    return (
      <Aspects
        width={width}
        height={height}
        background={background}
        data={data}
      >
        {
          // <Aspects.Plugin zIndex={12}>
          data.streets.map((items, index) => (
            <Aspects.Plugin zIndex={12} key={index}>
              <div style={{ minWidth: 80, height: 20, fontSize: '12px' }} rotateorigin='road' origin={`road_${index}_${items.ins.length}`} coordinate={{ x: 1, y: 40 }} rotateadjust='90' id={`name_${index}`}>
                {items.name}
              </div>
            </Aspects.Plugin>
          ))
        }
      </Aspects>
    )
  }
}
StatusCharts.defaultProps = {
}
StatusCharts.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object]),
  background: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}
export default StatusCharts
