import React from 'react'
import { padding, defaultWidth, defaultHeight, markList } from './const'
import Slider from 'antd/es/slider'
import './index.less'

class TimeSlider extends React.Component {
  handleChange = (value) => {
    this.props.onChange(value)
  }

  handleAfterChange = (value) => {
    this.props.onAfterChange(value)
  }

  getTimeRangeValue = () => {
    const timeRangeList = this.props.timeRange || []
    const timeRangeIndex = timeRangeList.map(time => {
      let index
      for (var key in markList) {
        if (time === markList[key]) {
          index = key
        }
      }
      return Number(index)
    })
    return timeRangeIndex
  }

  getStyle = () => {
    const { checked } = this.props
    const { top, right, bottom, left } = padding
    const propStyles = this.props.styles || {}
    let style
    if (checked) {
      style = {
        paddingTop: top,
        paddingBottom: bottom,
        height: (propStyles.height || defaultHeight) + 'px'
      }
    } else {
      style = {
        paddingLeft: left,
        paddingRight: right,
        width: (propStyles.width || defaultWidth) - left - right + 'px'
      }
    }
    return style
  }

  getMarks = () => {
    const marksObj = {
      0: '00:00',
      1440: '24:00'
    }
    const [start, end] = this.getTimeRangeValue()
    marksObj[start] = markList[start]
    marksObj[end] = markList[end]
    return marksObj
  }

  render () {
    const { checked } = this.props
    return (
      <div className='time-slider' style={this.getStyle()}>
        <Slider
          vertical={checked}
          tooltipVisible={false}
          range
          min={0}
          max={1440}
          step={1}
          marks={this.getMarks()}
          defaultValue={[0, 1440]}
          value={this.getTimeRangeValue()}
          onChange={this.handleChange}
          onAfterChange={this.handleAfterChange}
        />
      </div>
    )
  }
}

export default TimeSlider
