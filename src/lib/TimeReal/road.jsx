import { RED } from './const'

// 路段实例，控制路段内车辆速度、进入和驶出路段
class Road {
  constructor (name, inst1, inst2, distance, speed) {
    this.name = name
    this.inst1 = inst1
    this.inst2 = inst2
    this.distance = distance
    this.speed = speed || 60
    this.cars = {}
  }

  addCar (car) {
    this.cars[car.name] = car
    car.setSpeed(this.speed)
    car.setDistance(0)
  }

  removeCar (car) {
    // console.log('remove', this.name, car.name);
    delete this.cars[car.name]
    // let index = this.cars.indexOf(car.name);
    // this.cars.splice(index, 1);
  }

  getState () {
    return this.cars
  }

  runCar (car, nextRoad) {
    if (car.distance < this.distance) {
      car.addDistance(this.speed)
    } else {
      if (this.inst2.state === RED) {
        return
      }
      this.removeCar(car)
      if (nextRoad) {
        nextRoad.addCar(car)
      }
    }
  }

  tick (nextRoad) {
    for (const name in this.cars) {
      this.runCar(this.cars[name], nextRoad)
    }
  }
}

export default Road
