import { storiesOf } from '@storybook/react'
import React from 'react'
import StatusMap from '../../src/lib/StatusMap'
import DIRECTION from '../../src/lib/StatusMap/directions'
import StatusMapReadme from '../../src/lib/StatusMap/README.md'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

storiesOf('StatusMap', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: StatusMapReadme
    }
  })
  .addDecorator(withKnobs)
  .add('StatusMap', () => (
    <StatusMap
      width={800}
      height={600}
      data={object('数据', {
        // 中心点百分位
        center: {
          x: 0.5,
          y: 0.5
        },
        streets: [
          {
            angle: 0, // 正北方向开始顺时针角度
            length: 440,
            times: 1,
            laneWidth: 25,
            name: '北进口1',
            frid:'1111111111',
            // isOutBool: true,
            property: [
              {
                type: 1,
                name: '路口延误',
                data: [111,11.4,11.5,10]
              },
              {
                type: 2,
                name: '排队长度',
                data: [222,22.2,22.2,22]
              },
              {
                type: 3,
                name: '停车次数',
                data: [33,33.3,33.3,33]
              }
            ],
            ins: [
              {
                directions: [DIRECTION.BACK],
                choose: true
              },
              {
                directions: [DIRECTION.LEFT],
                choose: false
              },
              {
                directions: [DIRECTION.STRAIGHT],
                choose: false
              },
              {
                directions: [DIRECTION.RIGHT],
                choose: true
              }
            ],
            outs: 0
          },
          {
            angle: 90, // 正北方向开始顺时针角度
            length: 440,
            laneWidth: 25,
            times: 1,
            name: '北进口2',
            frid:'333333333',
            property: [
              {
                type: 1,
                name: '路口延误',
                data: [1.99999,30.42,160.57,104.56]
              },
              {
                type: 2,
                name: '排队长度',
                data: [231.12,16057,6050,null]
              },
              {
                type: 3,
                name: '停车次数',
                data: [111,30.4,60.5,10]
              }
            ],
            ins: [
              {
                directions: [DIRECTION.BACK],
              },
              {
                directions: [DIRECTION.LEFT],
              },
              {
                directions: [DIRECTION.STRAIGHT],
              },
              {
                directions: [DIRECTION.RIGHT],
              }
            ],
            outs: 0
          },
          {
            angle: 180, // 正北方向开始顺时针角度
            length: 440,
            isOutBool: true,
            laneWidth: 25,
            name: '北进口3',
            frid:'44444444',
            property: [
              {
                type: 1,
                name: '路口延误',
                data: [19,30.4,60.5,10]
              },
              {
                type: 2,
                name: '排队长度',
                data: [27,30.4,60.5,10]
              },
              {
                type: 3,
                name: '停车次数',
                data: [88,30.4,60.5,10]
              }
            ],
            ins: [
              {
                directions: [DIRECTION.BACK],
              },
              {
                directions: [DIRECTION.LEFT],
              },
              {
                directions: [DIRECTION.STRAIGHT],
              },
              {
                directions: [DIRECTION.RIGHT],
              }
            ],
            outs: 0
          },
          {
            angle: 270, // 正北方向开始顺时针角度
            length: 440,
            isOutBool: true,
            laneWidth: 25,
            name: '北进口4',
            property: [
              {
                type: 1,
                name: '路口延误',
                data: [55,10.4,60.5,10]
              },
              {
                type: 2,
                name: '排队长度',
                data: [77,40.4,60.5,10]
              },
              {
                type: 3,
                name: '停车次数',
                data: [99,70.4,60.5,10]
              }
            ],
            frid:'555555',
            ins: [
              {
                directions: [DIRECTION.BACK],
              },
              {
                directions: [DIRECTION.LEFT],
              },
              {
                directions: [DIRECTION.STRAIGHT],
              },
              {
                directions: [DIRECTION.RIGHT],
              }
            ],
            outs: 0
          }
        ]
      })}
    />
  ))
  