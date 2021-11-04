import { storiesOf } from '@storybook/react'
import React from 'react'
import GreenWaveBand from '../../src/lib/GreenWaveBand'
import GreenWaveBandReadme from '../../src/lib/GreenWaveBand/README.md'
import { withReadme } from 'storybook-readme'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

const standardData = [
  {
    inter_name: '世纪大道与海甸五西路路口',
    travel_time: 66.27945,
    inv_travel_time: 0,
    roadlen: 1054,
    inv_roadlen: 0,
    cycle_time: 130,
    offset: 0,
    phase: [{
      phase_name: 'A',
      is_co_phase: 1,
      inv_is_co_phase: 0,
      split_time: 24
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

storiesOf('GreenWaveBand', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: GreenWaveBandReadme
    }
  })
  .addDecorator(withKnobs)
  .add('GreenWaveBand', () => (
    <GreenWaveBand
      styles={object('样式配置', { colors: ['red', 'green'], opacity: 0.5, fontSize: 12 })}
      data={object('参数配置', standardData)}
    />
  ))
