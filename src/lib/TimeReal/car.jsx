import { getRandomItem } from './util'
import { COLORS } from './const'

// 汽车实例，控制车辆速度、路段内行驶距离、路网内行驶距离
class Car {
  constructor (name, speed) {
    this.name = name
    this.speed = speed
    this.distance = 0
    this.totalDist = -100
    this.color = getRandomItem(COLORS)
  }

  setSpeed (speed) {
    this.speed = speed
  }

  setDistance (distance) {
    this.distance = distance
  }

  addDistance (distance) {
    this.distance = this.distance + distance
    this.totalDist = this.totalDist + distance
  }

  getState () {
    return {
      color: this.color,
      name: this.name,
      speed: this.speed,
      distance: this.distance,
      totalDist: this.totalDist
    }
  }
}

export default Car
