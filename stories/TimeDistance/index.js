import { storiesOf } from '@storybook/react'
import React from 'react'
import TimeDistance from '../../src/lib/TimeDistance'
import TimeDistanceReadme from '../../src/lib/TimeDistance/README.md'
import { withKnobs, object, boolean, array} from '@storybook/addon-knobs'
import mockData from './data'

const standardData = [
  {
    inter_name: '世纪大道与海甸五西路路口',
    travel_time: 66.27945, // 正向通行时间
    inv_travel_time: 0, // 反向通行时间
    roadlen: 800, // 正向道路长度
    inv_roadlen: 0, // 反向道路长度
    cycle_time: 130, // 周期时间
    offset: 30,
    phase: [{
      phase_name: 'A',
      is_co_phase: 1,
      inv_is_co_phase: 0,
      split_time: 21
    }, {
      phase_name: 'B',
      is_co_phase: 0,
      inv_is_co_phase: 1,
      split_time: 33
    }, {
      phase_name: 'C',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 22
    }, {
      phase_name: 'E',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 51
    }]
  }, {
    inter_name: '怡心路与海甸五西路路口',
    travel_time: 22.70714,
    inv_travel_time: 67.653972,
    roadlen: 349,
    inv_roadlen: 1054,
    cycle_time: 130,
    offset: 67,
    phase: [{
      phase_name: 'A',
      is_co_phase: 1,
      inv_is_co_phase: 1,
      split_time: 83
    }, {
      phase_name: 'B',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 14
    }, {
      phase_name: 'C',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 19
    }, {
      phase_name: 'D',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 14
    }]
  }, {
    inter_name: '海甸五西路交叉口',
    travel_time: 34.471842,
    inv_travel_time: 24.53967,
    roadlen: 490,
    inv_roadlen: 349,
    cycle_time: 130,
    offset: 74,
    phase: [{
      phase_name: 'A',
      is_co_phase: 1,
      inv_is_co_phase: 1,
      split_time: 62
    }, {
      phase_name: 'B',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 17
    }, {
      phase_name: 'C',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 18
    }, {
      phase_name: 'D',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 33
    }]
  }, {
    inter_name: '人民大道与海甸五中路路口',
    travel_time: 0,
    inv_travel_time: 34.326594,
    roadlen: 0,
    inv_roadlen: 490,
    cycle_time: 130,
    offset: 79,
    phase: [{
      phase_name: 'A',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 22
    }, {
      phase_name: 'B',
      is_co_phase: 0,
      inv_is_co_phase: 0,
      split_time: 17
    }, {
      phase_name: 'C',
      is_co_phase: 1,
      inv_is_co_phase: 0,
      split_time: 51
    }, {
      phase_name: 'E',
      is_co_phase: 0,
      inv_is_co_phase: 1,
      split_time: 40
    }]
  }
]

const randomPath = () => {
  let arr = [[0,0]]
  for( let i = 0; i < 600 ; i ++) {
    if(i>0){
      arr.push([i,Math.random() * (Math.random() * 13) + arr[i-1][1]])
    }
  }
  return arr
}

const generateVehiclesPath = () => {
  let vehiclesPathList = []

  for( let i = 0; i < 10 ; i ++) {
    if(i>0){
      vehiclesPathList.push({
        name: Math.random(),
        path: randomPath()
      })
    }
  }

  return vehiclesPathList
}

const vehiclesPath = generateVehiclesPath()

const colors = {
  path: '#8897A7',
  roadName: 'rgba(0, 0, 0, 0.65)',
  roadforward: '#4CAF50',
  roadReverse: '#F15533',
  roadDashed: 'rgba(0, 0, 0, 0.1)',
  axisName: 'rgba(0, 0, 0, 0.45)'
}

storiesOf('TimeDistance', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: TimeDistanceReadme
    }
  })
  .addDecorator(withKnobs)
  .add('TimeDistance', () => (
    <TimeDistance
      styles={object('样式配置', { colors, fontSize: 12, width: 1000, height: 500 })}
      checked={boolean('坐标轴切换', false)}
      isShowSlider={boolean('是否展示TimeSlider', true)}
      isShowSwitch={boolean('是否展示Swith', true)}
      timeRange={array('时间范围', ['08:00', '12:00'])}
      onAfterChange={value => {console.log('onAfterChange', value)}}
      data={object('路口配置', standardData)}
      path={object('车辆轨迹', mockData)}
    />
  ))
