import { getRandomItem } from './util'
import { RED, GREEN } from './const'

// 随机的红灯时间
const REDTIME = [30, 40, 20]
// 随机的绿灯时间
const GREENTIME = [60, 40, 90]
// 随机的红绿灯状态
const STATEARRAY = [RED, GREEN]

// 路口实例，控制路口红绿灯变换状态
class Intersection {
  constructor (name, time, state) {
    this.name = name
    this.state = state || getRandomItem(STATEARRAY)
    this.time = time || {
      red: getRandomItem(REDTIME),
      green: getRandomItem(GREENTIME)
    }
    this.ctime = 0
  }

  setState (state) {
    this.state = state
  }

  getState () {
    return this.state
  }

  tick () {
    this.ctime++
    if (this.state === RED) {
      if (this.ctime > this.time.red) {
        this.ctime = 0
        this.state = GREEN
      }
    }
    if (this.state === GREEN) {
      if (this.ctime > this.time.green) {
        this.ctime = 0
        this.state = RED
      }
    }
  }

  online (event) {
    event.on('event', () => {
      this.tick()
    })
  }
}

export default Intersection
