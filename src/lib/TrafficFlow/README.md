# Aspects
```author:  元贽, 李冠驰 mail: bob.jff```

### 组件描述
渠化图

### 组件属性

| 成员        | 说明        | 类型               | 参考值       |
|-------------|------------|------------------|--------------|
|  data（*）  |  渠化图数据  |      object       | {
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
            {
              "angle": 0,  // 道路角度
              "ins": [ ], // 进口道的数据
              "length": 200,  // 道路的长度
              "laneWidth": 40,  // 每条道路的宽度
              "outs": 3,   // 出口道的数量
              "isInsBool": true, // 控制增加进口道删除进口道的按钮的是否显示
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  "directions": [], 
                  "device": [{
                    "type": "RADAR"
                  },{
                    "type": "GANTRY"
                  }]
                }, 
                {
                  "directions": [], 
                  "device": [{
                    "type": "COMPDETECTOR"
                  }]
                }
              ],
              "length": 200, 
              "laneWidth": 40, 
              "outs": 0, 
              "isInsBool": false, 
              "isOutBool": true
            }
          ]
        } |
|    showCenterLight   |   是否展示中间信号灯（true展示信号灯默认false）  |       boolean       | true |
|   crossWolkWidth   |   人形道的宽度自定义  |       number       | 300 |
|   crosswalkLen   |   人形道的长度自定义  |       number       | 200 |
|    addBtnBool   |   是否显示编辑车道数量的增删按钮  |       boolean(true显示false不展示)       | true |
|   deviceCallback   |   设备选择的回调函数  |       function       | (p, d, i) => p |
|   dataFunc   |   渠化图数据变更的回调函数  |       function       | (p, d, i) => p |
|    width    |   视口宽度  |       number      | 500 |
|    height   |   视口高度  |       number      | 95 |
|    background    |     样式    |      string      | background: 'gray' |

### 示例用法
```
<Aspects
    width={800}
    height={600}
    data={object('数据', 
    {
        "center": {
        "x": 0.5, 
        "y": 0.5
        }, 
        "streets": [
        {
            "angle": 0, 
            "ins": [ ], 
            "out": 3, 
            "frid": "", 
            "trid": "154IH09KQL01552L09KIH00", 
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
        }, 
        {
            "angle": 180, 
            "ins": [], 
            "out": 0, 
            "frid": "1541K09L650154IH09KQL00", 
            "trid": "", 
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3,
            "isInsBool": false, 
            "isOutBool": true
        }
        ]
    }
    )}
    />
Aspect.Plugin 渠化图插件支持外部引入元素放在渠化图中
Aspect.Plugin (属性： zIndex: 插件层级 Number 越大的覆盖在最外面)
子元素： html标签, svg标签，图片
  属性：id 赋值于子元素一个id值唯一标识该插件
        origin: 'cross|[road|in|out]_i_j_[start|end|middle]_[left_center_right]'
  (1) origin: cross 基于中心点进行插件位移
  (2) origin: road_i_j_start_left 基于某条道路i是大路的下标，j为车道的下标， start为车道斑马线开始位置进行位移，end为车道斑马线结束位置进行位移 middle道的中心位置
              left为车道偏出口道的位置，right为车道偏进口道的位置，center为cross车道的中心位置
              in和out同理基于进口道和出口道的偏移位置
  (3) 当操作到origin位置，觉得要微调一下位置可以引入 coordinate={{ x: 0, y: 0 }} 进行数学坐标的偏移x,y
  (4) 当元素角度需要偏移可以引入rotateorigin :plugincenter|road 以中心点或者道路进行旋转到理想的角度 rotateadjust = '0' 具体的数值
示例：
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <div id="red" rotateorigin='plugincenter' origin='cross' coordinate={{ x: 0, y: 0 }}  rotateadjust='0'>
    </div> 
  </Aspect.Plugin>
</Aspects>
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <div id="red" rotateorigin='road' origin='road_1_1_left' coordinate={{ x: 40, y: 100 }}  rotateadjust='45'>
    </div> 
  </Aspect.Plugin>
</Aspects>
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <div id="red" rotateorigin='road' origin='in_1_1_left' coordinate={{ x: 40, y: 100 }}  rotateadjust='45'>
    </div> 
  </Aspect.Plugin>
</Aspects>
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <div id="red" rotateorigin='road' origin='out_1_1_left' coordinate={{ x: 40, y: 100 }}  rotateadjust='45'>
    </div> 
  </Aspect.Plugin>
</Aspects>
如果想快速搭建插件，渠化图内部会有一些插件提供支持：
Aspects.AddDevice 设备的选择弹窗的插件
Aspects.AddDirection 方向的选择弹窗的插件
Aspects.CenterLight 中心信号灯的插件
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <Aspects.AddDevice showModals={true} deviceClick={(e) => { 
      console.log(e) // COIL 线圈 CAMERA 视频 GANTRY 卡口 COMPDETECTOR 复合设备 RADAR 雷达 
     }} id="device" rotateorigin='road' origin='road_1_1' coordinate={{ x: 10, y: 100 }}  rotateadjust='45' />
  </Aspect.Plugin>
</Aspects>
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <Aspects.AddDirection showModals={true} handleSelectDirection={(e) => { 
      console.log(e) // RIGHT LEFT BACK 等
     }} id="directions" rotateorigin='road' origin='road_1_1' coordinate={{ x: 10, y: 100 }}  rotateadjust='45' />
  </Aspect.Plugin>
</Aspects>
<Aspects>
  <Aspect.Plugin zIndex={13}>
    <Aspects.AddDirection showModals={true} handleEditCenterBtn={(e) => { 
      console.log(e) // RIGHT LEFT BACK 等
     }} handleSelected={(e) => { 
      console.log(e) // RIGHT LEFT BACK 等
     }} id="centerLight" rotateorigin='pluginCenter' origin='cross' coordinate={{ x: 0, y: 0 }}  rotateadjust='90' />
  </Aspect.Plugin>
</Aspects>
```