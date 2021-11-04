# TimeDistance
```author: 黑三  mail: heisan```

### 组件描述
基于老版绿波图（GreenWaveBand)优化而来，用于描述各路口红绿灯配时，及车辆在指定时间段内经过各路口的行车轨迹

### 组件属性

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| styles      | 样式配置     | object  |  { colors: {}, fontSize: 12, width: 1000, height: 500}    |
| checked       | 是否Y轴代表时间(坐标轴切换)     | boolean   |  true                |
| isShowSlider       | 是否展示时间范围滑动条     | boolean   |  true                |
| isShowSwitch       | 是否展示Swith操作按钮     | boolean   |  true                |
| timeRange       | 时间范围滑动条选中的时间范围     | array   |  ['00:00', '24:00']                 |
| onAfterChange       | 修改TimeSlider时间范围事件     | function   |                 |
| data       | 红绿灯数据     | array   |  []                 |
| path       | 车辆路径数据     | array   |  []                 |

### 示例用法
```
<TimeDistance 
    styles={
      colors: {
        path: '#8897A7', // 车辆轨迹颜色
        roadName: 'rgba(0, 0, 0, 0.65)', // 道路名称颜色
        roadforward: '#4CAF50', // 正向道路颜色
        roadReverse: '#F15533', // 反向道路颜色
        roadDashed: 'rgba(0, 0, 0, 0.1)', // 道路虚线颜色
        axisName: 'rgba(0, 0, 0, 0.45)' // 坐标轴name颜色
        // 坐标轴样式(是否展示/刻度/刻度标签)可以通过css控制, class名称为x-axis, y-axis
      },
      fontSize: 12,
      width: 1000, // 图表宽度 (不包含Slider及操作按钮)
      height: 500 // 图表高度 (不包含Slider及操作按钮)
    }
    checked={true} // true: X轴代表距离|Y轴代表时间,  false: X轴代表时间|Y轴代表距离
    isShowSlider={true}
    isShowSwitch={true}
    timeRange={['08:00', '12:00']} // 时间范围
    onAfterChange={value => {}} // 抛出的value格式: ['08:00', '12:00']
    path={
      [
        {name:'car-1',path:[[1,1],[2,10]]} // [2,10]代表一个坐标点，格式：[距离(m), 时间(s)]
        {name:'car-2',path:[[1,10],[2,20]]}
        {name:'car-3',path:[[1,11],[2,30]]}
      ]
    }
    data={[
      {
        "inter_name":"世纪大道与海甸五西路路口", // 路口名称
        "travel_time": 66.27945, // 正向通行时间 (单位: 秒)
        "inv_travel_time": 0, // 反向通行时间 (单位: 秒)
        "roadlen": 1054, // 路口距离 (单位: 米)
        "inv_roadlen": 0, // 反向路口距离 (单位: 米)
        "cycle_time":130, // 周期时间 (单位: 秒)
        "offset": 0, // 偏移值 (单位: 秒)
        "phase":[{
          "phase_name": "A",
          "is_co_phase": 1, // 正向, 0是红灯 1是绿灯
          "inv_is_co_phase": 0, // 反向, 0是红灯 1是绿灯
          "split_time": 24 // 时长 (单位: 秒)
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