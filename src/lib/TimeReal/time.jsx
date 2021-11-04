import EventEmitter from 'events'

// 全局时间控制器，由外部注册事件，按照单位时间（_TIMESC，默认1秒）触发事件
class Time {
  constructor () {
    this._CURTIME = 0
    this._TIMESC = 0.2
    this.event = new EventEmitter()
  }

  timeEvent () {
    this.event.emit('event')
    this.event.emit('print')
    this._CURTIME++
  }

  timeLine () {
    setTimeout(() => {
      this.timeEvent()
      this.timeLine()
    }, 1000 * this._TIMESC)
  }

  getCurTime () {
    return this._CURTIME
  }

  start () {
    this.timeLine()
  }
}

export default Time
