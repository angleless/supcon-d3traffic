import { storiesOf } from '@storybook/react'
import React from 'react'
import Aspects from '../../src/lib/Aspects'
import DIRECTION from '../../src/lib/Aspects/directions'
import AspectsReadme from '../../src/lib/Aspects/README.md'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'
function crossLineSign () {
  return <svg viewBox="0 0 1024 1024" width="24" height="24" transform="rotate(135 0 0)">
    <path fill="#ffffff" stroke="#ffffff" d="M874.145185 512L512 8.154074 149.854815 512 512 1015.845926 874.145185 512zM512 105.623704L804.077037 512 512 918.366815 219.913481 512 512 105.623704z" p-id="2110"/>
  </svg>
}
const nameData = {
  streets:[
    {
      "angle": 0, 
      "ins": [ ], 
      "name": '区划图',
       
      
      
      "length": 200, 
      "laneWidth": 20, 
      "outs": 3, 
      "isInsBool": true, 
      "isOutBool": false
    }, {
      "angle": 60, 
      "ins": [ ],
      "name": '区划图',
       
      
      
      "length": 200, 
      "laneWidth": 20, 
      "outs": 3, 
      "isInsBool": true, 
      "isOutBool": false
    }, {
      "angle": 120, 
      "ins": [ ],
      "name": '区划图',
       
      
      
      "length": 200, 
      "laneWidth": 20, 
      "outs": 3, 
      "isInsBool": true, 
      "isOutBool": false
    }, {
      "angle": 240, 
      "ins": [ ],
      "name": '区划图',
       
      
      
      "length": 200, 
      "laneWidth": 20, 
      "outs": 3, 
      "isInsBool": true, 
      "isOutBool": false
    }, {
      "angle": 300, 
      "ins": [ ],
      "name": '区划图',
       
      
      
      "length": 200, 
      "laneWidth": 20, 
      "outs": 3, 
      "isInsBool": true, 
      "isOutBool": false
    }
  ]
}
const statusData =  [
  {
    "angle": 0, 
    "ins": [
      {
        "directions": [
          "LEFT"
        ]
      },
      {
        "directions": [
          "STRAIGHT_RIGHT"
        ]
      },{
        "directions": [
          "BACK"
        ]
      },{
        "directions": [
          "BACK"
        ]
      }
    ],
    "length": 800, 
    "laneWidth": 20, 
    "outs": 0, 
    "isInsBool": true, 
    "isOutBool": true,
    "name": "区划图"
  },{
    "angle": 90, 
    "ins": [
      {
        "directions": [
          "LEFT"
        ]
      },
      {
        "directions": [
          "STRAIGHT_RIGHT"
        ]
      },{
        "directions": [
          "BACK"
        ]
      },{
        "directions": [
          "BACK"
        ]
      }
    ],
    
    
    "length": 800, 
    "laneWidth": 20, 
    "outs": 0, 
    "isInsBool": true, 
    "isOutBool": true,
    "name": "区划图"
  },{
    "angle": 180, 
    "ins": [
      {
        "directions": [
          "LEFT"
        ]
      },
      {
        "directions": [
          "STRAIGHT_RIGHT"
        ]
      },{
        "directions": [
          "BACK"
        ]
      },{
        "directions": [
          "BACK"
        ]
      }
    ],
    
    
    "length": 800, 
    "laneWidth": 20, 
    "outs": 0, 
    "isInsBool": true, 
    "isOutBool": true,
    "name": "区划图"
  },{
    "angle": 270, 
    "ins": [
      {
        "directions": [
          "LEFT"
        ]
      },
      {
        "directions": [
          "STRAIGHT_RIGHT"
        ]
      },{
        "directions": [
          "BACK"
        ]
      },{
        "directions": [
          "BACK"
        ]
      }
    ],
    
    
    "length": 800, 
    "laneWidth": 20, 
    "outs": 0, 
    "isInsBool": true, 
    "isOutBool": true,
    "name": "区划图"
  }
]

storiesOf('Aspects', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: AspectsReadme
    }
  })
  .addDecorator(withKnobs)
  .add('二岔口', () => (
    <Aspects
      width={number('宽度', 800)}
      height={number('高度', 600)}
      isEdit={boolean('进口道是否可以编辑高亮', true)}
      contentScale={object('渠化图的缩放比例', { x: 1, y: 1 })}
      addBtnBool={boolean('是否显示增删车道按钮', true)}
      showCenterLight={boolean('中间信号灯的编辑状态', true)}
      centerColor={boolean('中间信号灯的选中的状态', true)}
      isDrawLaneDividers={boolean('是否展示道路分割线', true)}
      showLight={boolean('是否展示中心信号灯', true)}
      showDirectionsModal={boolean('是否使用展示方向默认弹出框', true)}
      isEditOut={boolean('出口道可以高亮编辑', true)}
      showRoadName={boolean('是否显示路名', true)}
      crossWolkWidth= {number('人行横道的宽度', 10)}
      crossWolkHeight={number('人行横道的长度', 30)}
      crossJianJu={number('人行横道的间距', 4)}
      roadNameCallback={(e) => { console.log(e) }}
      centerCallback={(e) => { console.log(e) }}
      optionFunc={(e) => { console.log(e) }}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 6, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  "directions": ["BACK"],
                  "device": [{
                    "id": "", 
                    "type": "RADAR", 
                    
                  },{
                    "id": "", 
                    "type": "GANTRY", 
                    
                  },{
                    "id": "", 
                    "type": "GANTRY", 
                    
                  }]
                }, 
                {
                  "directions": ["LEFT"], 
                  "device": [{
                    "id": "", 
                    "type": "COMPDETECTOR", 
                    
                  }]
                },
                {
                  "directions": ["STRAIGHT"], 
                  "device": [{
                    "id": "", 
                    "type": "CAMERA", 
                    
                  },{
                    "id": "", 
                    "type": "COIL", 
                    
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
        }
      )}
    />
  ))
  .add('中心信号灯插件', () => (
    <Aspects
      width={800}
      height={600}
      // isEdit={false}
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
               
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 6, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  "directions": ["BACK"],
                  "device": [{
                    "id": "", 
                    "type": "RADAR", 
                    
                  },{
                    "id": "", 
                    "type": "GANTRY", 
                    
                  },{
                    "id": "", 
                    "type": "GANTRY", 
                    
                  }]
                }, 
                {
                  "directions": ["LEFT"], 
                  "device": [{
                    "id": "", 
                    "type": "COMPDETECTOR", 
                    
                  }]
                },
                {
                  "directions": ["STRAIGHT"], 
                  "device": [{
                    "id": "", 
                    "type": "CAMERA", 
                    
                  },{
                    "id": "", 
                    "type": "COIL", 
                    
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
        }
      )}
    >
      {/* <Aspects.Plugin zIndex={12}>
        <Aspects.CenterLight rotateorigin='pluginCenter' origin='cross' coordinate={{ x: 0, y: 0 }}  rotateadjust='0' id='names' />
      </Aspects.Plugin> */}
      <Aspects.Plugin zIndex={12}>
        <div style={{width: 30, height: 30}} rotateorigin='pluginCenter' origin='cross' coordinate={{ x: 0, y: 0 }}  rotateadjust='0' id='names'>123</div>
      </Aspects.Plugin>
    </Aspects>
  ))
  .add('三岔口', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {
              "angle": 270, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 10, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 90, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 5, 
              "isInsBool": true, 
              "isOutBool": false
            },
            {
              "angle": 180, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            },
          ]
        }
      )}
    />
  ))
  .add('状态图', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "showRoadName": true,
          "streets": statusData
        }
      )}
    >
      {
        statusData.map((items, index) => (
          <Aspects.Plugin zIndex={12} key={index}>
              <div style={{ boxSizing: 'border-box', padding: '0 10px', minWidth: 150, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: '12px', background: 'rgba(0, 0, 0, 0.7)' }} rotateorigin='road' origin={`road_${index}_${items.ins.length}`} coordinate={{ x: 15, y: 120 }} rotateadjust='180' id={`name_${index}`}>
                <div style={{ color: '#fff'}}>12.5</div>
                <div style={{ color: '#fff'}}>12.5</div>
                <div style={{ color: '#fff'}}>12.5</div>
                <div style={{ color: '#fff'}}>12.5</div>
              </div>
            </Aspects.Plugin>
        ))
      }
    </Aspects>
  ))
  .add('添加道路名称', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "showRoadName": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [ ],
              "length": 200, 
              "laneWidth": 20, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": true,
              "name": "区划图"
            },{
              "angle": 90, 
              "ins": [
                {
                  "deviceList": [],
                  "directions": [
                    "LEFT"
                  ],
                  "device": []
                },
                {
                  "deviceList": [],
                  "directions": [
                    "STRAIGHT_RIGHT"
                  ],
                  "device": []
                }
              ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": true,
              "name": "区划图"
            },{
              "angle": 180, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 4, 
              "isInsBool": true, 
              "isOutBool": true,
              "name": "区划图"
            },{
              "angle": 270, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": true,
              "name": "区划图"
            }
          ]
        }
      )}
    />
  ))
  .add('四岔口(带入口道)', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true, 
          "streets": [
            {
              "angle": 0, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": true
            },{
              "angle": 90, 
              "ins": [
                {
                  "deviceList": [],
                  "directions": [
                    "LEFT"
                  ],
                  "device": []
                },
                {
                  "deviceList": [],
                  "directions": [
                    "STRAIGHT_RIGHT"
                  ],
                  "device": []
                }
              ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": true
            },{
              "angle": 180, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 4, 
              "isInsBool": true, 
              "isOutBool": true
            },{
              "angle": 270, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": true
            }
          ]
        }
      )}
    />
  ))
  .add('五岔口', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 60, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 120, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 240, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 300, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('人行横道提示标识', () => (
    <Aspects
    width={800}
    height={600}
    data={object('数据', 
      {
        "center": {
          "x": 0.5, 
          "y": 0.5
        },
        "addBtnBool": true,
        "isDrawLaneDividers": true,
        "showLight": true,
        "isNonMotorVehicleLane": true,
        "showCenterLight": true,
        "streets": [
          {
            "angle": 0, 
            "ins": [
              {
                "directions": ["BACK"]
              }
            ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3,
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 60, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 120, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 240, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 300, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }
        ]
      }
    )}
    >
      {
        nameData.streets.map((items, index) => (
          <Aspects.Plugin zIndex={12} key={index}>
             {/* <svg viewBox="0 0 1024 1024" width="16" height="16" rotateorigin='road' origin={`out_${index}_${0}_middle_right`} coordinate={{ x: 0, y: 0 }} rotateadjust='45' id={`name_${index}`}>
              <path fill="#ffffff" stroke="#ffffff" d="M874.145185 512L512 8.154074 149.854815 512 512 1015.845926 874.145185 512zM512 105.623704L804.077037 512 512 918.366815 219.913481 512 512 105.623704z" p-id="2110"/>
            </svg> */}
            <div style={{ width: 50, height: 50 }} rotateorigin='road' origin={`out_${index}_${0}_middle_center`} coordinate={{ x: 0, y: 0 }} rotateadjust='45' id={`name_${index}`}>
              {crossLineSign()}
            </div>
          </Aspects.Plugin>
        ))
      }
    </Aspects>
  ))
  .add('禁止掉头', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
              {
                "angle": 0, 
                "ins": [ ], 
                 
                
                
                "length": 200, 
                "laneWidth": 40, 
                "outs": 6, 
                "isInsBool": true, 
                "isOutBool": false
              }, 
              {
                "angle": 180, 
                "ins": [
                  {
                    "directions": ["LEFT_BACK"],
                    "forbidBack": true,
                    "device": [{
                      "id": "", 
                      "type": "RADAR", 
                      
                    },{
                      "id": "", 
                      "type": "GANTRY", 
                      
                    }]
                  }, 
                  {
                    "directions": ["STRAIGHT"], 
                    "device": [{
                      "id": "", 
                      "type": "COMPDETECTOR", 
                      
                    }]
                  },
                  {
                    "directions": ["STRAIGHT"], 
                    "device": [{
                      "id": "", 
                      "type": "CAMERA", 
                      
                    },{
                      "id": "", 
                      "type": "COIL", 
                      
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
        }
      )}
    />
  ))
  .add('禁止停车网格', () => (
    <Aspects
    width={800}
    height={600}
    data={object('数据', 
      {
        "center": {
          "x": 0.5, 
          "y": 0.5
        },
        "addBtnBool": true,
        "isDrawLaneDividers": true,
        "showLight": true,
        "isNonMotorVehicleLane": true,
        "showCenterLight": true,
        "streets": [
          {
            "angle": 0, 
            "ins": [
              {
                "directions": ["BACK"]
              }
            ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3,
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 60, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 120, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 240, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 300, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }
        ]
      }
    )}
    >
      {
          <Aspects.Plugin zIndex={12}>
            <div style={{ width: 200, height: 120 }} rotateorigin='road' origin={`out_${0}_${3}_middle_left`} coordinate={{ x: 40, y: 0 }} rotateadjust='0' id={`name_${0}`}>
              <svg viewBox="0 0 1024 1024" width="170" height="100">
                <path fill="#fad507" d="M845.395349 0.471516L848.82694 4.762791H921.6v1014.474418h-72.77306L845.395349 1023.528484 841.958995 1019.237209h-126.490195L712.037209 1023.528484 708.600856 1019.237209h-126.490196L578.67907 1023.528484 575.242716 1019.237209h-126.490195L445.32093 1023.528484 441.884577 1019.237209H315.394381L311.962791 1023.528484 308.526437 1019.237209H182.036242L178.604651 1023.528484 175.168298 1019.237209H107.162791v-85.015814L102.773879 928.744186 107.162791 923.264595V767.523721L102.781023 762.046512l4.381768-5.479591V600.826047L102.781023 595.348837l4.381768-5.47959V434.128372L102.781023 428.651163l4.381768-5.479591V267.430698L102.781023 261.953488l4.381768-5.47959V100.733023L102.781023 95.255814l4.381768-5.479591L107.162791 4.762791h68.005507L178.604651 0.471516 182.036242 4.762791h126.490195L311.962791 0.471516 315.394381 4.762791h126.490196L445.32093 0.471516 448.752521 4.762791h126.490195L578.67907 0.471516 582.11066 4.762791h126.490196L712.037209 0.471516 715.4688 4.762791h126.490195L845.395349 0.471516zM121.451163 952.08186V1004.948837h42.288818L121.451163 952.08186z m123.832558-11.906976L193.464558 1004.948837h103.6288L245.283721 940.179647z m133.358139 0L326.822698 1004.948837h103.6288L378.64186 940.179647z m133.35814 0L460.180837 1004.948837h103.6288L512 940.179647z m133.35814 0L593.538977 1004.948837h103.6288L645.35814 940.179647z m133.358139 0L726.897116 1004.948837h103.6288L778.716279 940.179647z m128.595349 5.953488L860.255256 1004.948837H907.311628v-58.815702z m-195.274419-89.299944L654.50746 928.744186 712.037209 1000.655181 769.564577 928.744186 712.037209 856.830809z m133.35814 0L787.8656 928.744186 845.395349 1000.655181 902.922716 928.744186 845.395349 856.830809z m-400.074419 0L387.791181 928.744186 445.32093 1000.655181 502.848298 928.744186 445.32093 856.830809z m133.35814 0L521.149321 928.744186 578.67907 1000.655181 636.206437 928.744186 578.67907 856.830809z m-400.074419 0l-57.153488 71.44186v0.940652l57.153488 71.44186L236.132019 928.744186 178.604651 856.830809z m133.35814 0L254.433042 928.744186 311.962791 1000.655181 369.490158 928.744186 311.962791 856.830809z m-66.67907-83.348837L187.749209 845.395349 245.283721 917.308726 302.811088 845.395349 245.283721 773.481972z m266.716279 0L454.465488 845.395349 512 917.308726 569.527367 845.395349 512 773.481972z m133.35814 0L587.823628 845.395349 645.35814 917.308726 702.885507 845.395349 645.35814 773.481972z m133.358139 0L721.181767 845.395349 778.716279 917.308726 836.243647 845.395349 778.716279 773.481972z m-400.074419 0L321.107349 845.395349 378.64186 917.308726 436.169228 845.395349 378.64186 773.481972z m528.669768 5.953488L854.539907 845.395349 907.311628 911.355237v-131.917395z m-785.860465 5.953488v120.0128L169.450567 845.395349 121.451163 785.388949z m190.511628-95.255814L254.433042 762.046512 311.962791 833.957507 369.490158 762.046512 311.962791 690.133135z m-133.35814 0l-57.153488 71.441861v0.940651l57.153488 71.441861L236.132019 762.046512 178.604651 690.133135z m666.790698 0L787.8656 762.046512 845.395349 833.957507 902.922716 762.046512 845.395349 690.133135z m-133.35814 0L654.50746 762.046512 712.037209 833.957507 769.564577 762.046512 712.037209 690.133135z m-266.716279 0L387.791181 762.046512 445.32093 833.957507 502.848298 762.046512 445.32093 690.133135z m133.35814 0L521.149321 762.046512 578.67907 833.957507 636.206437 762.046512 578.67907 690.133135z m-200.03721-83.348837L321.107349 678.697674 378.64186 750.611051 436.169228 678.697674 378.64186 606.784298z m-133.358139 0L187.749209 678.697674 245.283721 750.611051 302.811088 678.697674 245.283721 606.784298z m266.716279 0L454.465488 678.697674 512 750.611051 569.527367 678.697674 512 606.784298z m133.35814 0L587.823628 678.697674 645.35814 750.611051 702.885507 678.697674 645.35814 606.784298z m133.358139 0L721.181767 678.697674 778.716279 750.611051 836.243647 678.697674 778.716279 606.784298z m128.595349 5.953489L854.539907 678.697674 907.311628 744.657563v-131.917396z m-785.860465 5.953488v120.0128L169.450567 678.697674 121.451163 618.691274z m323.869767-95.255814L387.791181 595.348837 445.32093 667.259833 502.848298 595.348837 445.32093 523.43546z m266.716279 0L654.50746 595.348837 712.037209 667.259833 769.564577 595.348837 712.037209 523.43546z m-400.074418 0L254.433042 595.348837 311.962791 667.259833 369.490158 595.348837 311.962791 523.43546z m-133.35814 0l-57.153488 71.441861v0.940651l57.153488 71.44186L236.132019 595.348837 178.604651 523.43546z m666.790698 0L787.8656 595.348837 845.395349 667.259833 902.922716 595.348837 845.395349 523.43546z m-266.716279 0L521.149321 595.348837 578.67907 667.259833 636.206437 595.348837 578.67907 523.43546z m-200.03721-83.348837L321.107349 512 378.64186 583.913377 436.169228 512 378.64186 440.086623z m133.35814 0L454.465488 512 512 583.913377 569.527367 512 512 440.086623z m-266.716279 0L187.749209 512 245.283721 583.913377 302.811088 512 245.283721 440.086623z m533.432558 0L721.181767 512 778.716279 583.913377 836.243647 512 778.716279 440.086623z m-133.358139 0L587.823628 512 645.35814 583.913377 702.885507 512 645.35814 440.086623z m261.953488 5.953488L854.539907 512 907.311628 577.959888v-131.917395z m-785.860465 5.953489v120.0128L169.450567 512 121.451163 451.9936z m590.586046-95.255814L654.50746 428.651163 712.037209 500.562158 769.564577 428.651163 712.037209 356.737786z m133.35814 0L787.8656 428.651163 845.395349 500.562158 902.922716 428.651163 845.395349 356.737786z m-533.432558 0L254.433042 428.651163 311.962791 500.562158 369.490158 428.651163 311.962791 356.737786z m-133.35814 0l-57.153488 71.44186v0.940651l57.153488 71.441861L236.132019 428.651163 178.604651 356.737786z m400.074419 0L521.149321 428.651163 578.67907 500.562158 636.206437 428.651163 578.67907 356.737786z m-133.35814 0L387.791181 428.651163 445.32093 500.562158 502.848298 428.651163 445.32093 356.737786z m333.395349-83.348838L721.181767 345.302326 778.716279 417.215702 836.243647 345.302326 778.716279 273.388949z m-533.432558 0L187.749209 345.302326 245.283721 417.215702 302.811088 345.302326 245.283721 273.388949z m133.358139 0L321.107349 345.302326 378.64186 417.215702 436.169228 345.302326 378.64186 273.388949z m133.35814 0L454.465488 345.302326 512 417.215702 569.527367 345.302326 512 273.388949z m133.35814 0L587.823628 345.302326 645.35814 417.215702 702.885507 345.302326 645.35814 273.388949z m261.953488 5.953489L854.539907 345.302326 907.311628 411.262214v-131.917395z m-785.860465 5.953488v120.0128L169.450567 345.302326 121.451163 285.295926z m323.869767-95.255814L387.791181 261.953488 445.32093 333.864484 502.848298 261.953488 445.32093 190.040112z m-133.358139 0L254.433042 261.953488 311.962791 333.864484 369.490158 261.953488 311.962791 190.040112z m533.432558 0L787.8656 261.953488 845.395349 333.864484 902.922716 261.953488 845.395349 190.040112z m-266.716279 0L521.149321 261.953488 578.67907 333.864484 636.206437 261.953488 578.67907 190.040112z m-400.074419 0l-57.153488 71.441861v0.940651l57.153488 71.44186L236.132019 261.953488 178.604651 190.040112z m533.432558 0L654.50746 261.953488 712.037209 333.864484 769.564577 261.953488 712.037209 190.040112z m-66.679069-83.348837L587.823628 178.604651 645.35814 250.518028 702.885507 178.604651 645.35814 106.691274z m-133.35814 0L454.465488 178.604651 512 250.518028 569.527367 178.604651 512 106.691274z m266.716279 0L721.181767 178.604651 778.716279 250.518028 836.243647 178.604651 778.716279 106.691274z m-400.074419 0L321.107349 178.604651 378.64186 250.518028 436.169228 178.604651 378.64186 106.691274z m-133.358139 0L187.749209 178.604651 245.283721 250.518028 302.811088 178.604651 245.283721 106.691274z m662.027907 5.953488L854.539907 178.604651 907.311628 244.56454V112.647144z m-785.860465 5.953489v120.0128L169.450567 178.604651 121.451163 118.598251z m723.944186-95.255814L787.8656 95.255814 845.395349 167.166809 902.922716 95.255814 845.395349 23.342437z m-266.716279 0L521.149321 95.255814 578.67907 167.166809 636.206437 95.255814 578.67907 23.342437z m-266.716279 0L254.433042 95.255814 311.962791 167.166809 369.490158 95.255814 311.962791 23.342437z m-133.35814 0l-57.153488 71.44186v0.940651l57.153488 71.441861L236.132019 95.255814 178.604651 23.342437z m533.432558 0L654.50746 95.255814 712.037209 167.166809 769.564577 95.255814 712.037209 23.342437z m-266.716279 0L387.791181 95.255814 445.32093 167.166809 502.848298 95.255814 445.32093 23.342437zM430.453879 19.051163H326.825079L378.64186 83.820353 430.453879 19.051163z m400.074419 0h-103.6288L778.716279 83.820353 830.528298 19.051163z m-133.35814 0h-103.6288L645.35814 83.820353 697.170158 19.051163z m-400.074418 0H193.46694L245.283721 83.820353 297.09574 19.051163z m266.716279 0h-103.6288L512 83.820353 563.812019 19.051163zM907.311628 19.051163h-47.053991L907.311628 77.866865 907.311628 19.051163zM163.739981 19.051163H121.451163v52.864595l42.288818-52.866977z" p-id="2558"/>
              </svg>
            </div>
          </Aspects.Plugin>
      }
    </Aspects>
  ))
  .add('停车位', () => (
    <Aspects
    width={800}
    height={600}
    data={object('数据', 
      {
        "center": {
          "x": 0.5, 
          "y": 0.5
        },
        "addBtnBool": true,
        "isDrawLaneDividers": true,
        "showLight": true,
        "isNonMotorVehicleLane": true,
        "showCenterLight": true,
        "streets": [
          {
            "angle": 0, 
            "ins": [
              {
                "directions": ["BACK"]
              }
            ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3,
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 60, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 120, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 240, 
            "ins": [ ], 
             
            
            
            "length": 200,
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 300, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }
        ]
      }
    )}
    >
      {
          <Aspects.Plugin zIndex={12}>
            <div style={{ width: '30px', height: '120px' }} rotateorigin='road' origin={`ins_${0}_${1}_middle_right`} coordinate={{ x: 0, y: 0 }} rotateadjust='0' id={`name_${0}`}>
              <svg style={{ width: '30px', height: '120px' }}>
                <symbol width='10' height='60' id='TCW' viewBox='0 0 1024 1024'>
                  <path fill="#ffffff" d="M603.743256 1019.403907h-178.604651v-1018.046512h178.604651v1018.046512z m-35.726884-327.44186h-107.162791v291.72093h107.162791v-291.72093z m0-327.441861h-107.162791v291.72093h107.162791v-291.72093z m0-327.44186h-107.162791v291.72093h107.162791v-291.72093z" />
                </symbol>
                <use width='30' height='180' xlinkHref="#TCW" transform="translate(-40, -300) scale(4)" stroke="#ffffff" />
              </svg>
            </div>
          </Aspects.Plugin>
      }
    </Aspects>
  ))
  .add('增加非机动车道', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 2, 
              "isInsBool": true, 
              "isNonMotorVehicleOutLane": true,
              "isNonMotorVehicleInsLane": true,
              "isOutBool": true
            },{
              "angle": 90, 
              "ins": [
                {
                  "deviceList": [],
                  "directions": [
                    "LEFT"
                  ],
                  "device": []
                },
                {
                  "deviceList": [],
                  "directions": [
                    "STRAIGHT_RIGHT"
                  ],
                  "device": []
                }
              ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": true
            },{
              "angle": 180, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 4, 
              "isInsBool": true, 
              "isOutBool": true
            },{
              "angle": 270, 
              "ins": [ ],
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": true
            }
          ]
        }
      )}
    />
  ))
  .add('六岔口', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
            {
              "angle": 0, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 60, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 120, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            },{
              "angle": 180, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 240, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, {
              "angle": 300, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('增加方向', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
            {
              "angle": 0, 
              "ins": [ ], 
               
              
              
              "length": 200, 
              "laneWidth": 20, 
              "outs": 4, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [
                    "STRAIGHT"
                  ], 
                  "device": []
                }, 
                {
                  
                  "directions": [
                    "BACK"
                  ], 
                  "device": []
                },
                {
                  
                  "directions": [
                    "LEFT_STRAIGHT"
                  ], 
                  "device": []
                },
                {
                  
                  "directions": [
                    "STRAIGHT_RIGHT"
                  ], 
                  "device": []
                },
                {
                  
                  "directions": [
                    "RIGHT"
                  ], 
                  "device": []
                },{
                  
                  "directions": [
                    "LEFT_RIGHT"
                  ], 
                  "device": []
                },
                {
                  
                  "directions": [
                    "LEFT"
                  ], 
                  "device": []
                },
              ], 
               
              
               
              "length": 200, 
              "laneWidth": 20, 
              "outs": 0, 
              "isInsBool": false, 
              "isOutBool": true
            }
          ]
        }
      )}
    />
  ))
  .add('增加设备', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
              {
                "angle": 0, 
                "ins": [ ], 
                 
                
                
                "length": 200, 
                "laneWidth": 40, 
                "outs": 6, 
                "isInsBool": true, 
                "isOutBool": false
              }, 
              {
                "angle": 180, 
                "ins": [
                  {
                    "directions": ["LEFT_BACK"],
                    "device": [{
                      "id": "", 
                      "type": "RADAR", 
                      
                    },{
                      "id": "", 
                      "type": "GANTRY", 
                      
                    }]
                  }, 
                  {
                    "directions": ["STRAIGHT"], 
                    "device": [{
                      "id": "", 
                      "type": "COMPDETECTOR", 
                      
                    }]
                  },
                  {
                    "directions": ["STRAIGHT"], 
                    "device": [{
                      "id": "", 
                      "type": "CAMERA", 
                      
                    },{
                      "id": "", 
                      "type": "COIL", 
                      
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
        }
      )}
    />
  ))
  .add('进口道3出口道2', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('是否可以编辑出口道', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "isEditOut": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": [],
                  "editRoadColor": "red",
                  "choose": true
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false,
              "chooseOut": 1
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  // addBtnBool
  .add('是否显示增删车道的按钮', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": [],
                  "editRoadColor": "red",
                  "choose": true
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false,
              "chooseOut": 1
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('中心信号灯选中状态', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "showLight": true,
          "centerColor": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": [],
                  "editRoadColor": "red",
                  "choose": true
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false,
              "chooseOut": 1
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('中心信号灯编辑状态', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": [],
                  "editRoadColor": "red",
                  "choose": true
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false,
              "chooseOut": 1
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('是否展示中心信号灯', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "showLight": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": [],
                  "editRoadColor": "red",
                  "choose": true
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false,
              "chooseOut": 1
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('是否可以编辑进口道', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "isEdit": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": [],
                  "editRoadColor": "red",
                  "choose": true
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
      
    />
  ))
  .add('人形横道间隔，宽度，长度', () => (
    <Aspects
      width={800}
      height={600}
      crossWolkWidth={5} // 人行横道的宽度
      crossWolkHeight={30}// 人行横道的长度
      crossJianJu={10}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "crossWolkWidth": 5,
          "crossWolkHeight": 30,
          "crossJianJu": 10,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('是否显示分割线', () => (
    <Aspects
      width={800}
      height={600}
      crossWolkWidth={5} // 人行横道的宽度
      crossWolkHeight={30}// 人行横道的长度
      crossJianJu={10}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "isDrawLaneDividers": true,
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('路名插件显示', () => (
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
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 60, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 120, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 240, 
            "ins": [ ], 
             
            
            
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }, {
            "angle": 300, 
            "ins": [ ],
            "length": 200, 
            "laneWidth": 20, 
            "outs": 3, 
            "isInsBool": true, 
            "isOutBool": false
          }
        ]
      }
    )}
    >
      {
        nameData.streets.map((items, index) => (
          <Aspects.Plugin zIndex={12} key={index}>
            <div onClick={() => { alert(1) }} style={{ minWidth: 80, height: 20, fontSize: '12px' }} rotateorigin='road' origin={`road_${index}_${items.ins.length}`} coordinate={{ x: 1, y: 40 }} rotateadjust='90' id={`name_${index}`}>
              {items.name}
            </div>
          </Aspects.Plugin>
        ))
      }
    </Aspects>
  ))
  .add('出口道绿波带（根据out数组里面的rid进行分类）', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {"angle":243.15,"length":10000,"laneWidth":50,"ins":
            [
              {"directions":["RIGHT", "BACK"],"device":[],"rid":"1518909GI10151CB09GJD00"},
              {"directions":["STRAIGHT"],"device":[{"infoList":{"deviceId":"aaaawweee","deviceName":"","customName":"","deviceTypeNo":9,"mountRid":"1518909GI10151CB09GJD00","mountLaneId":"1518909GI10151CB09GJD0099912","mountLaneNo":12,"gapLen":0},"type":"COMPDETECTOR"}],"rid":"1518909GI10151CB09GJD00"},
              {"directions":["STRAIGHT"],"device":[],"rid":"1518909GI10151CB09GJD00"}
            ],"out":[],"outs":0,"isOutBool":false,"isInsBool":true},
            {"angle":62.09,"length":10000,"laneWidth":50,"ins":[],"out":[
              {"rid":"151CB09GJD0151FA09GL400","out":4,"laneList":[{"laneId":"151CB09GJD0151FA09GL40001011","laneNo":"11","rid":"151CB09GJD0151FA09GL400","cnlId":"010","lnglatSeq":null,"length":null,"width":null,"turnDirNoList":"","deviceList":null},
              {"laneId":"151CB09GJD0151FA09GL40001012","laneNo":"12","rid":"151CB09GJD0151FA09GL400","cnlId":"010","lnglatSeq":null,"length":null,"width":null,"turnDirNoList":"","deviceList":null},{"laneId":"151CB09GJD0151FA09GL40001013","laneNo":"13","rid":"151CB09GJD0151FA09GL400","cnlId":"010","lnglatSeq":null,"length":null,"width":null,"turnDirNoList":"","deviceList":null},{"laneId":"151CB09GJD0151FA09GL40001014","laneNo":"14","rid":"151CB09GJD0151FA09GL400","cnlId":"010","lnglatSeq":null,"length":null,"width":null,"turnDirNoList":"","deviceList":null}]},{"rid":"151CB09GJD0151DD09GJU00","out":2,"laneList":[{"laneId":"151CB09GJD0151DD09GJU0001011","laneNo":"11","rid":"151CB09GJD0151DD09GJU00","cnlId":"010","lnglatSeq":null,"length":null,"width":null,"turnDirNoList":"2","deviceList":null},{"laneId":"151CB09GJD0151DD09GJU0001012","laneNo":"12","rid":"151CB09GJD0151DD09GJU00","cnlId":"010","lnglatSeq":null,"length":null,"width":null,"turnDirNoList":"2","deviceList":null}]}],"outs":6,"isOutBool":true,"isInsBool":false}]
        }
      )}
    />
  ))
  .add('进口道道绿波带（根据ins数组里面的rid进行分类）', () => (
    <Aspects
      width={800}
      height={600}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          },
          "addBtnBool": true,
          "isDrawLaneDividers": true,
          "showLight": true,
          "showCenterLight": true,
          "streets": [
            {"angle":243.15,"length":10000,"laneWidth":50,"ins":
            [
              {"directions":["RIGHT", "BACK"],"device":[],"rid":"1518909GI10151CB09GJD0099912"},
              {"directions":["STRAIGHT"],"device":[{"infoList":{"deviceId":"aaaawweee","deviceName":"","customName":"","deviceTypeNo":9,"mountRid":"151CB09GJD0151FA09GL400","mountLaneId":"1518909GI10151CB09GJD0099912","mountLaneNo":12,"gapLen":0},"type":"COMPDETECTOR"}],"rid":"1518909GI10151CB09GJD00"},
              {"directions":["STRAIGHT"],"device":[],"rid":"1518909GI10151CB09GJD00"}
            ],"out":[],"outs":0,"isOutBool":false,"isInsBool":true},
            {"angle":62.09,"length":10000,"laneWidth":50,"ins":[], "outs":6,"isOutBool":true,"isInsBool":false}]
        }
      )}
    />
  ))
  .add('增加信号灯', () => (
    <Aspects
      width={800}
      height={600}
      showCenterLight={false}
      data={object('数据', 
        {
          "center": {
            "x": 0.5, 
            "y": 0.5
          }, 
          "streets": [
            {
              "angle": 0, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 3, 
              "isInsBool": true, 
              "isOutBool": false
            }, 
            {
              "angle": 180, 
              "ins": [
                {
                  
                  "directions": [], 
                  "device": []
                }, 
                {
                  
                  "directions": [], 
                  "device": []
                },
                {
                  
                  "directions": [], 
                  "device": []
                }
              ], 
              "out": 2,
              
              
              "length": 200, 
              "laneWidth": 40, 
              "outs": 2, 
              "isInsBool": true, 
              "isOutBool": false
            }
          ]
        }
      )}
    />
  ))
  .add('多渠化图', () => (
    <div>
      <Aspects
        width={400}
        height={400}
        showCenterLight={false}
        data={object('数据', 
          {
            "center": {
              "x": 0.5, 
              "y": 0.5
            }, 
            "streets": statusData
          }
        )}
      />
      <br />
      <Aspects
        width={400}
        height={400}
        showCenterLight={false}
        data={object('数据', 
          {
            "center": {
              "x": 0.5, 
              "y": 0.5
            }, 
            "streets": statusData
          }
        )}
      />
    </div>
  ))