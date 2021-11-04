# GreenWaveBandEditor
```author: 爱恩  mail: cyp103158```

### 组件描述
绿波带示意图

### 组件属性

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| color      | 样式配置     | object  |  { colors:['red','green'], opacity: 0.5, fontSize: 12}    |
| data       | 图表数据     | array   |  []                 |

### 示例用法
```
<GreenWaveBandEditor 
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