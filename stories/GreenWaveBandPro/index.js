import React from 'react';
import { storiesOf } from '@storybook/react';
import GreenWaveBandPro from '../../src/lib/GreenWaveBandPro';
import GreenWaveBandProReadme from '../../src/lib/GreenWaveBandPro/README.md'
import { withReadme } from 'storybook-readme'
import { withKnobs, object } from '@storybook/addon-knobs'

const standardData = [
  {
    inter_name: '北京西站路口南北大街',
    inter_spacing: 0,
    signal_cycle: 80,
    green_signal_ratio: 55,
    loss_ratio: 26,
    valid_green_signal_ratio: 29,
    phase_difference: 72.5,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road1",
          "to": "road4"
        },
        {
          "from": "road1",
          "to": "road3"
        },
        {
          "from": "road3",
          "to": "road1"
        },
        {
          "from": "road3",
          "to": "road2"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 60,
    inter_spacing: 350,
    loss_ratio: 4,
    valid_green_signal_ratio: 56,
    phase_difference: 20,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road1",
          "to": "road4"
        },
        {
          "from": "road1",
          "to": "road3"
        },
        {
          "from": "road3",
          "to": "road1"
        },
        {
          "from": "road3",
          "to": "road2"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 65,
    inter_spacing: 400,
    loss_ratio: 24,
    valid_green_signal_ratio: 41,
    phase_difference: 67.5,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road2",
          "to": "road1"
        },
        {
          "from": "road2",
          "to": "road4"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 65,
    inter_spacing: 160,
    loss_ratio: 8,
    valid_green_signal_ratio: 57,
    phase_difference: 67.5,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road1",
          "to": "road4"
        },
        {
          "from": "road1",
          "to": "road3"
        },
        {
          "from": "road3",
          "to": "road1"
        },
        {
          "from": "road3",
          "to": "road2"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 60,
    inter_spacing: 540,
    loss_ratio: 16,
    valid_green_signal_ratio: 44,
    phase_difference: 20,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road4",
          "to": "road2"
        },
        {
          "from": "road4",
          "to": "road3"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 65,
    inter_spacing: 280,
    loss_ratio: 28,
    valid_green_signal_ratio: 37,
    phase_difference: 67.5,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road1",
          "to": "road4"
        },
        {
          "from": "road1",
          "to": "road3"
        },
        {
          "from": "road3",
          "to": "road1"
        },
        {
          "from": "road3",
          "to": "road2"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 70,
    inter_spacing: 280,
    loss_ratio: 28,
    valid_green_signal_ratio: 42,
    phase_difference: 65,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road1",
          "to": "road4"
        },
        {
          "from": "road1",
          "to": "road3"
        },
        {
          "from": "road3",
          "to": "road1"
        },
        {
          "from": "road3",
          "to": "road2"
        }
      ]
    }
  }, {
    inter_name: '北京西站路口南北大街',
    signal_cycle: 80,
    green_signal_ratio: 50,
    inter_spacing: 270,
    loss_ratio: 18,
    valid_green_signal_ratio: 32,
    phase_difference: 25,
    cycle_times: 3,
    PhaseData: {
      "name": "相位展示",
      "roads": [
        {
          "roadName": "road1",
          "angle": 0
        },
        {
          "roadName": "road2",
          "angle": 90
        },
        {
          "roadName": "road3",
          "angle": 180
        },
        {
          "roadName": "road4",
          "angle": 270
        }
      ],
      "turns": [
        {
          "from": "road1",
          "to": "road4"
        },
        {
          "from": "road1",
          "to": "road3"
        },
        {
          "from": "road3",
          "to": "road1"
        },
        {
          "from": "road3",
          "to": "road2"
        }
      ]
    }
  }
]

storiesOf('GreenWaveBandPro', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: GreenWaveBandProReadme
    }
  })
  .addDecorator(withKnobs)
  .add('GreenWaveBandPro', () => (
    <GreenWaveBandPro
      styles={object('样式配置', { greenWaveColors: ['#2BAE41', '#5B6E90'], opacity: 0.25, fontSize: 12, fontColor: '#666' })}
      visible={object('数据开关', { actualSpeed: true, arrow: true, negativeInter: true })}
      data={object('参数配置', { positiveSpeed: 12.5, negativeSpeed: 12.5, standardData })}
    />
  ))
  .add('实际速度展示', () => (
    <GreenWaveBandPro
      styles={object('样式配置', { greenWaveColors: ['#2BAE41', '#5B6E90'], opacity: 0.25,  fontSize: 12, fontColor: '#666' })}
      visible={object('数据开关', { actualSpeed: true, arrow: false, negativeInter: false })}
      data={object('参数配置', { positiveSpeed: 12.5, negativeSpeed: 12.5, standardData })}
    />
  ))
  .add('方向箭头', () => (
    <GreenWaveBandPro
      styles={object('样式配置', { greenWaveColors: ['#2BAE41', '#5B6E90'], opacity: 0.25,  fontSize: 12, fontColor: '#666' })}
      visible={object('数据开关', { actualSpeed: false, arrow: true, negativeInter: false })}
      data={object('参数配置', { positiveSpeed: 12.5, negativeSpeed: 12.5, standardData })}
    />
  ))
  // .add('反向路口', () => (
  //   <GreenWaveBandPro
  //     styles={object('样式配置', { greenWaveColors: ['green', 'orange'], opacity: 0.5, fontSize: 12, fontColor: 'black' })}
  //     visible={object('数据开关', { actualSpeed: false, arrow: false, negativeInter: true })}
  //     data={object('参数配置', { positiveSpeed: 12.5, negativeSpeed: 12.5, standardData })}
  //   />
  // ))
