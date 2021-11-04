// 路网实例，由各个路段组成一个路网
class RoadNet {
  constructor (roadLink) {
    this.roadLink = roadLink
  }

  tick () {
    for (let i = 0, len = this.roadLink.length; i < len; i++) {
      const road = this.roadLink[i]; const nextRoad = this.roadLink[i + 1]
      road.tick(nextRoad)
    }
  }

  online (event) {
    event.on('event', () => {
      this.tick()
    })
  }
}

export default RoadNet
