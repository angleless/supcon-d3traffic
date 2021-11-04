<h1 align="center">D3Traffic</h1>

<div align="center">

[React](https://reactjs.org/) components for faster and easier web development. Display your own traffic data in a professional way

</div>

## Installation

D3Traffic is available as an [npm package](https://www.npmjs.com/package/d3traffic).

```sh
// with npm
npm install d3traffic

// with yarn
yarn add d3traffic
```


## Usage

Here is a quick example to get you started, **it's all you need**:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Phase } from "d3traffic";

function App() {
  return (
      <Phase
        data={{
          name: "路口相位图",
          roads: [
            {
              roadName: "road1",
              angle: 10
            },
            {
              roadName: "road2",
              angle: 100
            },
            {
              roadName: "road3",
              angle: 180
            },
            {
              roadName: "road4",
              angle: 280
            }
          ],
          turns: [{ from: "road1", to: "road2" }]
        }}
      />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

Yes, it's really all you need to get started as you can see in this live and interactive demo:

[![Edit Button](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/phase-epts2)


## Examples

|  Name   |    Component     |                          Demo                           |
| ------- | ---------------- | ------------------------------------------------------- |
| 渠化图  | Aspects          | [Click](https://codesandbox.io/s/aspects-y19ih) |
| 绿波图  | GreenWaveBand    | [Click](https://codesandbox.io/s/green-wave-band-izqiz) |
| 绿波Pro | GreenWaveBandPro | [Click](https://codesandbox.io/s/green-wave-band-pro-jv0yw) |
| 转向图  | InterTurnGroup   | [Click](https://codesandbox.io/s/inter-turn-group-x7619) |
| 相位图  | Phase            | [Click](https://codesandbox.io/s/phase-epts2) |
| 相位组  | PhaseGroup       |  |
| 状态图  | StatusMap        | [Click](https://codesandbox.io/s/status-map-gd6vn) |
| 时距图  | TimeDistance     | [Click](https://codesandbox.io/s/time-distance-o039t) |



## Documentation


### **- Aspects**

 成员        | 说明        | 类型               | 参考值       |
|-------------|------------|------------------|--------------|
|  data（*）  |  渠化图数据  |      object       | {} |
|    showCenterLight   |   是否展示中间信号灯（true展示信号灯默认false）  |       boolean       | true |
|   crossWolkWidth   |   人形道的宽度自定义  |       number       | 300 |
|   crosswalkLen   |   人形道的长度自定义  |       number       | 200 |
|    addBtnBool   |   是否显示编辑车道数量的增删按钮  |       boolean(true显示false不展示)       | true |
|   deviceCallback   |   设备选择的回调函数  |       function       | (p, d, i) => p |
|   dataFunc   |   渠化图数据变更的回调函数  |       function       | (p, d, i) => p |
|    width    |   视口宽度  |       number      | 500 |
|    height   |   视口高度  |       number      | 95 |
|    background    |     样式    |      string      | background: 'gray' |

### **- GreenWaveBand**
#### 样式设置(styles) -- 可选

| 成员                 | 说明                    | 类型               | 默认值                |
|---------------------|-------------------------|-------------------|----------------------|
| colors              | 路口信号颜色(红灯、绿灯)    | array             |  ["red","green"]     |
| opacity             | 透明度                   | number            |   0.5                |
| fontSize            | 标注字体                 | number            |   12                 |

#### 数据设置(data) 

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

#### phase 对象

| 成员                                | 说明                    | 类型               | 默认值       |
|------------------------------------|-------------------------|-------------------|-------------|
| phase_name                         | 周期名称                 | string            |             |
| is_co_phase                        | 正向是否绿灯              | number            |             |
| inv_is_co_phase                    | 反向是否绿灯              | number            |             |
| split_time                         | 周期长度                 | number            |             |

### **- GreenWaveBandPro**
#### 样式设置(styles) -- 可选

| 成员                 | 说明                    | 类型               | 默认值                |
|---------------------|-------------------------|-------------------|----------------------|
| colors              | 路口信号颜色(红灯、绿灯)    | array             |  ["red","green"]     |
| greenWaveColors     | 绿波带颜色(正向、反向)     | array             |  ["green","orange"]  |
| opacity             | 透明度                   | number            |   0.5                |
| fontSize            | 标注字体                 | number            |   12                 |

#### 可见性设置(visible) -- 可选

| 成员                 | 说明                    | 类型               | 默认值                |
|---------------------|-------------------------|-------------------|----------------------|
| actualSpeed         | 显示速度标示线             | bool             |  true                |
| arrow               | 显示正反向箭头标示         | bool              | true                 |
| negativeInter       | 显示/隐藏 反向绿波带       | bool              |   true               |

#### 数据设置(data) 

| 成员                                | 说明                    | 类型               | 默认值       |
|------------------------------------|-------------------------|-------------------|-------------|
| positiveSpeed                      | 正向通行速度              | number            | 12.5        |
| negativeSpeed                      | 反向通行速度              | number            | 12.5        |
| standardData                       | 数据对象                 | object            |             |

#### standardData 对象

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

### **- InterTurnGroup**


| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| data       | 数据源配置   | array  | []                 |
| arrowStyle | 箭头样式配置 | object | {color:'black', headlen: 10, theta: 30, lineWidth: 1} |
| lineStyle  | 线样式配置   | object | {strokeColor: 'black', lineWidth: 1} |
| interStyle | 路口样式配置 | object | {strokeColor: 'black', fillColor: 'black', radius: 5} |
| background | 背景色      | string  | 'white'               |
| phaseNameStyle | 相位名样式      | object  | {phaseNameBg: 'silver', phaseNameColor: 'white'}               |

### **- Phase**

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| data       | 数据源配置   | object  | {}                |
| svgWidth       | 数据源配置   | number  | 200                 |
| svgHeight       | 数据源配置   | number  | 200                 |
| background       | svg背景色   | string  | "#202f39"                 |
| roadStyle | 路段样式配置 | object | { strokeColor: '#444446', fill: '#444446', roadWidth: 20, strokeWidth: 0 } |
| turnStyle | 转向线样式配置 | object | { strokeColor: '#56a162', strokeWidth: 1 } |
| arrowStyle | 转向线末端箭头样式配置 | object | { arrowLen: 10, arrowAngle: 30 } |

### **- PhaseGroup**
Todo
### **- StatusMap**

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| data       | 数据源配置   | object  | {}                |
| width       | 状态图画布宽度   | number  | 200                 |
| height       | 状态图画布高度   | number  | 200                 |
| chooseDirections       | 暴露选中车道的 Frid,Direction,status   | Func  | () => {}  

### **- TimeDistance**

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| color      | 样式配置     | object  |  { colors:['red','green'], opacity: 0.5, fontSize: 12}    |
| data       | 红绿灯数据     | array   |  []                 |
| path       | 车辆路径数据     | array   |  []                 |


## License

This project is licensed under the terms of the
[MIT license](/LICENSE).