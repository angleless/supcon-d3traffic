import { getRandomItem } from './util'
import { GREEN, RED } from './const'

import Intersection from './intersection'
import Road from './road'
import Car from './car'
import RoadNet from './roadnet'
import Time from './time'

const CARS = {}
const printCar = {}

// 路口红绿灯时间
const TIMEQUEUE = [
  { red: 106, green: 24 },
  { red: 47, green: 83 },
  { red: 68, green: 62 },
  { red: 90, green: 40 }
]
// 路口红绿灯默认状态
const INITSTATEQUEUE = [GREEN, GREEN, GREEN, RED]
// 路口数量
const INSTERSECTIONNUM = 4
// 总体车辆限流
const TOTALCARNUMBER = 50

// 控制器，总体控制路网车辆的运行，并输出路网数据
class Control {
  constructor () {
    this._carName = 0
    this._insterTime = [4, 6, 10, 12]
    this._lastTime = 0
    this._time = new Time()
    this.event = this._time.event
    this.createIntersection()
    this.createRoad()
    this.createRoadNet()
    this.online()
  }

  createIntersection () {
    this.intersection = []
    for (let i = 0; i < INSTERSECTIONNUM; i++) {
      const time = TIMEQUEUE[i]
      const instState = INITSTATEQUEUE[i]
      const intersection = new Intersection(`ins-${i}`, time, instState)
      intersection.online(this.event)
      this.intersection.push(intersection)
    }
  }

  createRoad () {
    this.road = []
    const startInst = new Intersection('emptyins--1')
    const startRoad = new Road('road--1', startInst, this.intersection[0], 100, 40)
    this.road.push(startRoad)
    this.intersection.forEach((inst, index) => {
      let inst2 = this.intersection[index + 1]
      if (!inst2) {
        inst2 = new Intersection(`emptyins-${index}`)
      }
      const road = new Road(`road-${index}`, inst, inst2, 400, 40)
      this.road.push(road)
    })
  }

  createRoadNet () {
    this.roadNet = new RoadNet(this.road)
    this.roadNet.online(this.event)
  }

  createCar () {
    const name = `car-${this._carName++}`
    const car = new Car(name, 0)
    CARS[name] = car
    return car
  }

  instertOneCar () {
    const car = this.createCar()
    // const road = getRandomItem(this.road);
    const road = this.road[0]
    road.addCar(car)
  }

  instertRandomCar () {
    this._lastTime++
    const _time = getRandomItem(this._insterTime)
    if (this._lastTime < _time) {
      return
    }
    this._lastTime = 0
    if (Object.keys(CARS).length >= TOTALCARNUMBER) {
      return
    }

    const count = Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      this.instertOneCar()
    }
  }

  getState () {
    const roadNetInfo = []
    this.road.forEach((road) => {
      const beginInst = road.inst1
      const endInst = road.inst2
      const beginInstInfo = {
        name: beginInst.name,
        state: beginInst.getState()
      }
      const endInstInfo = {
        name: endInst.name,
        state: endInst.getState()
      }
      const cars = []
      for (const carName in road.getState()) {
        cars.push(CARS[carName].getState())
      }
      const roadCarInfo = {
        name: road.name,
        cars: cars,
        len: cars.length
      }
      const info = {
        beginInstInfo,
        endInstInfo,
        roadCarInfo
      }
      // console.log(info)
      roadNetInfo.push(info)
    })
    return roadNetInfo
  }

  print () {
    const curTime = this._time.getCurTime()
    for (const carName in CARS) {
      // console.log(!printCar[car.name])
      // console.log(car.name)
      // console.log(printCar[car.name])
      const car = CARS[carName]
      if (!printCar[carName]) {
        printCar[carName] = [[curTime, car.totalDist]]
        // console.log(car.name)
      } else {
        // console.log('1111111')
        printCar[carName].push([curTime, car.totalDist])
      }
    }
  }

  tick () {
    this.instertRandomCar()
  }

  online () {
    const event = this.event
    event.on('event', () => {
      this.tick()
    })
    event.on('print', () => {
      this.print()
    })
  }

  start () {
    this._time.start()
  }
}

export default Control
