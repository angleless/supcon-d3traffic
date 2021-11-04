# Phase
```author: 婉一  mail: wanyi.css```

### 组件名
路口转向图

### 组件描述
描述围绕一个路口为中心的一组转向线的展示

### 组件属性

| 成员        | 说明        | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| data       | 数据源配置   | array  | []                 |
| arrowStyle | 箭头样式配置 | object | {color:'black', headlen: 10, theta: 30, lineWidth: 1} |
| lineStyle  | 线样式配置   | object | {strokeColor: 'black', lineWidth: 1} |
| interStyle | 路口样式配置 | object | {strokeColor: 'black', fillColor: 'black', radius: 5} |
| background | 背景色      | string  | 'white'               |
| phaseNameStyle | 相位名样式      | object  | {phaseNameBg: 'silver', phaseNameColor: 'white'}               |

### 示例用法
```
<InterTurnGroup 
    arrowStyle={{color:'black', headlen: 10, theta: 30}}
    lineStyle={{strokeColor: 'black'}}
    interStyle={{strokeColor: 'black', fillColor: 'black', radius: 5}}
    phaseNameStyle={{phaseNameBg: 'silver', phaseNameColor: 'white'}}
    data={[
      {
        name: '转向1',
        inter: '113.270186,23.158465',
        lnglats: [
          '113.270492,23.15917;113.270374,23.158854;113.269982,23.158065;113.269912,23.157893'
        ]
      }
    ]}
  />
```