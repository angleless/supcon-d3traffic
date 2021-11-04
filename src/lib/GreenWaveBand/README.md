# GreenWaveBand
```author: 爱恩  mail: cyp103158```

### 组件描述
绿波带示意图

### 组件属性

## 样式设置(styles) -- 可选

| 成员                 | 说明                    | 类型               | 默认值                |
|---------------------|-------------------------|-------------------|----------------------|
| colors              | 路口信号颜色(红灯、绿灯)    | array             |  ["red","green"]     |
| opacity             | 透明度                   | number            |   0.5                |
| fontSize            | 标注字体                 | number            |   12                 |

## 数据设置(data) 

| 成员                                | 说明                    | 类型               | 默认值       |
|------------------------------------|-------------------------|-------------------|-------------|
| inter_name                         | 路口名称                 | string            |             |
| travel_time                        | 正向通行时间              | number            |             |
| inv_travel_time                    | 信反向通行时间            | number            |             |
| roadlen                            | 正向和前一个路口间距       | number            |             |
| inv_roadlen                        | 反向和前一个路口间距       | number            |             |
| cycle_time                         | 信号周期时长              | number            |             |
| offset                             | 相位差                   | number            |             |
| phase                              | 信号周期数组              | Array             |             |

## phase 对象

| 成员                                | 说明                    | 类型               | 默认值       |
|------------------------------------|-------------------------|-------------------|-------------|
| phase_name                         | 周期名称                 | string            |             |
| is_co_phase                        | 正向是否绿灯              | number            |             |
| inv_is_co_phase                    | 反向是否绿灯              | number            |             |
| split_time                         | 周期长度                 | number            |             |

### 安装方法
npm i d3traffic

import { GreenWaveBand }  from 'd3traffic'

import  GreenWaveBand  from 'd3traffic/dist/lib/GreenWaveBand'


### 示例用法
```
<GreenWaveBand 
    styles: {
      colors:['red','green'], 
      opacity: 0.5, 
      fontSize: 12
    } 
    data={[
      {
        "inter_name":"世纪大道与海甸五西路路口",
        "travel_time": 66.27945,
        "inv_travel_time": 0,
        "roadlen": 1054,
        "inv_roadlen": 0,
        "cycle_time":130,
        "offset": 0,
        "phase":[{
          "phase_name": "A",
          "is_co_phase": 1,
          "inv_is_co_phase": 0,
          "split_time": 24
        },{
          "phase_name": "B",
          "is_co_phase": 0,
          "inv_is_co_phase": 1,
          "split_time": 33
        },{
          "phase_name": "C",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 22
        },{
          "phase_name": "E",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 51
        }]
      },{
        "inter_name":"怡心路与海甸五西路路口",
        "travel_time": 22.70714,
        "inv_travel_time": 67.653972,
        "roadlen": 349,
        "inv_roadlen": 1054,
        "cycle_time":130,
        "offset": 67,
        "phase":[{
          "phase_name": "A",
          "is_co_phase": 1,
          "inv_is_co_phase": 1,
          "split_time": 83
        },{
          "phase_name": "B",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 14
        },{
          "phase_name": "C",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 19
        },{
          "phase_name": "D",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 14
        }]
      },{
        "inter_name":"海甸五西路交叉口",
        "travel_time": 34.471842,
        "inv_travel_time": 24.53967,
        "roadlen": 490,
        "inv_roadlen": 349,
        "cycle_time":130,
        "offset": 74,
        "phase":[{
          "phase_name": "A",
          "is_co_phase": 1,
          "inv_is_co_phase": 1,
          "split_time": 62
        },{
          "phase_name": "B",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 17
        },{
          "phase_name": "C",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 18
        },{
          "phase_name": "D",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 33
        }]
      },{
        "inter_name":"人民大道与海甸五中路路口",
        "travel_time": 0,
        "inv_travel_time": 34.326594,
        "roadlen": 0,
        "inv_roadlen": 490,
        "cycle_time":130,
        "offset": 79,
        "phase":[{
          "phase_name": "A",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 22
        },{
          "phase_name": "B",
          "is_co_phase": 0,
          "inv_is_co_phase": 0,
          "split_time": 17
        },{
          "phase_name": "C",
          "is_co_phase": 1,
          "inv_is_co_phase": 0,
          "split_time": 51
        },{
          "phase_name": "E",
          "is_co_phase": 0,
          "inv_is_co_phase": 1,
          "split_time": 40
        }]
      }
    ]}
  />
```