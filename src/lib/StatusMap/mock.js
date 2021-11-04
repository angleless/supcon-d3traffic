import DIRECTION from './directions'

const mock = {
  // 中心点百分位
  center: {
    x: 0.5,
    y: 0.5
  },
  streets: [
    {
      angle: 20, // 正北方向开始顺时针角度
      length: 180,
      width: 40,
      ins: [
        {
          directions: [DIRECTION.LEFT, DIRECTION.BACK]
        },
        {
          directions: [DIRECTION.STRAIGHT, DIRECTION.RIGHT]
        }
      ],
      outs: 2
    },
    {
      angle: 180, // 正北方向开始顺时针角度
      length: 180,
      width: 60,
      ins: [
        {
          directions: [DIRECTION.LEFT, DIRECTION.BACK]
        },
        {
          directions: [DIRECTION.STRAIGHT, DIRECTION.RIGHT]
        }
      ],
      outs: 3
    },
    {
      angle: 90, // 正北方向开始顺时针角度
      length: 200,
      width: 90,
      ins: [
        {
          directions: [DIRECTION.LEFT, DIRECTION.BACK]
        },
        {
          directions: [DIRECTION.STRAIGHT]
        },
        {
          directions: [DIRECTION.RIGHT]
        }
      ],
      outs: 3
    },
    {
      angle: 280, // 正北方向开始顺时针角度
      length: 250,
      width: 60,
      ins: [
        {
          directions: [DIRECTION.LEFT, DIRECTION.BACK]
        },
        {
          directions: [DIRECTION.STRAIGHT, DIRECTION.RIGHT]
        }
      ],
      outs: 2
    }
  ]
}

export default mock
