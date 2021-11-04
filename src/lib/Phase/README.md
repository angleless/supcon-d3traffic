# Phase
```author: 婉一  mail: wanyi.css```

### 组件名
路口相位图

### 组件描述
在一个信号x周期内，一股或几股车流，不管任何瞬间都获得完全相同的信号灯色显示，那么就把它们获得不同灯色的连续时序称作一个信号相位。每一个信号相位的灯色显示时序都是“黄-红-绿”的循环。该组件就是用来表示一个相位下，路口关联的几个路段的允许通行方向

### 组件属性

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| data       | 数据源配置   | object  | {}                |
| svgWidth       | 数据源配置   | number  | 200                 |
| svgHeight       | 数据源配置   | number  | 200                 |
| background       | svg背景色   | string  | "#202f39"                 |
| roadStyle | 路段样式配置 | object | { strokeColor: '#444446', fill: '#444446', roadWidth: 20, strokeWidth: 0 } |
| turnStyle | 转向线样式配置 | object | { strokeColor: '#56a162', strokeWidth: 1 } |
| arrowStyle | 转向线末端箭头样式配置 | object | { arrowLen: 10, arrowAngle: 30 } |

### 示例用法
```js
<Phase
  data={{
    "name": "xxx相位",
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
      {from: 'road1', to: 'road2'}
    ]
  }}
/>
```