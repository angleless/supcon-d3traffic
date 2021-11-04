# GreenWaveBandPro
```author: 爱恩  mail: cyp103158```

### 组件描述
绿波带编辑组件

### 组件属性

## 样式设置(styles) -- 可选

| 成员                 | 说明                    | 类型               | 默认值                |
|---------------------|-------------------------|-------------------|----------------------|
| colors              | 路口信号颜色(红灯、绿灯)    | array             |  ["red","green"]     |
| greenWaveColors     | 绿波带颜色(正向、反向)     | array             |  ["green","orange"]  |
| opacity             | 透明度                   | number            |   0.5                |
| fontSize            | 标注字体                 | number            |   12                 |

## 可见性设置(visible) -- 可选

| 成员                 | 说明                    | 类型               | 默认值                |
|---------------------|-------------------------|-------------------|----------------------|
| actualSpeed         | 显示速度标示线             | bool             |  true                |
| arrow               | 显示正反向箭头标示         | bool              | true                 |
| negativeInter       | 显示/隐藏 反向绿波带       | bool              |   true               |

## 数据设置(data) 

| 成员                                | 说明                    | 类型               | 默认值       |
|------------------------------------|-------------------------|-------------------|-------------|
| positiveSpeed                      | 正向通行速度              | number            | 12.5        |
| negativeSpeed                      | 反向通行速度              | number            | 12.5        |
| standardData                       | 数据对象                 | object            |             |

## standardData 对象

| 成员                                | 说明                    | 类型               | 默认值       |
|------------------------------------|-------------------------|-------------------|-------------|
| inter_name                         | 路口名称                 | string            |             |
| inter_spacing                      | 路口间距(和前一个路口)     | number            |             |
| signal_cycle                       | 信号周期时长              | number            |             |
| green_signal_ratio                 | 绿信比                   | number            |             |
| loss_ratio （Option）               | 损失率（可选）            | number            |             |
| valid_green_signal_ratio（Option）  | 有效绿信比（可选）         | number            |             |
| phase_difference                   | 相位差                   | number            |             |
| cycle_times                        | 信号周期循环的次数         | number            |             |
| PhaseData（Option）                 | 相位图数据（可选）         | array             |             |

### 安装方法
npm i d3traffic

import { GreenWaveBandPro }  from 'd3traffic'

import  GreenWaveBandPro  from 'd3traffic/dist/lib/GreenWaveBandPro'


### 示例用法
```
 <GreenWaveBandPro
    styles = { colors: ['red', 'green'], greenWaveColors: ['green', 'orange'], opacity: 0.5, fontSize: 12 }
    visible= { actualSpeed: true, arrow: true, negativeInter: true }
    data = { 
      positiveSpeed: 12.5, 
      negativeSpeed: 12.5,  
      standardData = {[
      {
        inter_name: 'A',
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
        inter_name: 'B',
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
        inter_name: 'C',
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
        inter_name: 'D',
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
        inter_name: 'E',
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
        inter_name: 'F',
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
        inter_name: 'G',
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
        inter_name: 'H',
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
    ]}
  />
```