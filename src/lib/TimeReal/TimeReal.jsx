import React from 'react'

import Control from './control'
import { RED } from './const'

import './index.less'

// setInterval(() => {
//   const finalData = []
//   for (const carName in printCar) {
//     finalData.push({
//       name: carName,
//       path: printCar[carName]
//     })
//   }
//   // console.log('-------')
//   console.log(JSON.stringify(finalData))
// }, 1000 * 60 * 2 * _TIMESC)

class TimeReal extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: [] }
    this.control = new Control()
  }

  componentDidMount () {
    this.control.event.on('print', () => {
      this.setState({
        data: this.control.getState()
      })
    })
    this.control.start()
  }

  render () {
    const data = this.state.data
    if (data.length === 0) {
      return null
    }
    // const len = data.len;
    return (
      <table className='timeRealGroup'>
        <tbody>
          <tr>
            {
              data.map((road, index) => {
                return (
                  <td className='roadCell' key={index}>
                    <div className='inst'>{road.beginInstInfo.name}</div>
                    <div className='cars'>
                      {
                        road.roadCarInfo.cars.map((car, index) => {
                          return (
                            <div name={car.name} className='carContainer' key={index}>
                              <div className='car' name={car.name} style={{ left: car.distance + 'px', backgroundColor: car.color }} />
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className={road.endInstInfo.state === RED ? 'light red' : 'light green'} />
                  </td>
                )
              })
            }
          </tr>
        </tbody>
      </table>
    )
  }
}

export default TimeReal
