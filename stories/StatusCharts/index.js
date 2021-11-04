import { storiesOf } from '@storybook/react'
import React from 'react'
import StatusCharts from '../../src/lib/StatusCharts'
// import DIRECTION from '../../src/lib/Aspects/directions'
import StatusChartsReadme from '../../src/lib/StatusCharts/README.md'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

storiesOf('StatusCharts', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: StatusChartsReadme
    }
  })
  .addDecorator(withKnobs)
  .add('状态图基于渠化图的插件', () => (
    <StatusCharts
      width={800}
      height={600}
      background={'#eeeeee'}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
            {
              "angle": 0, 
              "ins": [ ], 
              "out": 3,
              "frid": "",
              "name": '吃在是个逗逼',
              "trid": "154IH09KQL01552L09KIH00", 
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 60, 
              "ins": [ ], 
              "out": 3, 
              "frid": "",
              "name": '吃在是个逗逼1', 
              "trid": "154IH09KQL01552L09KIH00", 
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 120, 
              "ins": [ ], 
              "out": 3, 
              "frid": "", 
              "trid": "154IH09KQL01552L09KIH00",
              "name": '吃在是个逗逼2',
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 240, 
              "ins": [ ], 
              "out": 3, 
              "frid": "", 
              "trid": "154IH09KQL01552L09KIH00", 
              "length": 200,
              "name": '吃在是个逗逼3',
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 300, 
              "ins": [ ], 
              "out": 3, 
              "frid": "", 
              "trid": "154IH09KQL01552L09KIH00", 
              "length": 200, 
              "laneWidth": 20,
              "name": '吃在是个逗逼3',
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))