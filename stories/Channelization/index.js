import { storiesOf } from '@storybook/react'
import React from 'react'
import Channelization from '../../src/lib/Channelization'
import DIRECTION from '../../src/lib/Channelization/directions'
import ChannelizationReadme from '../../src/lib/Channelization/README.md'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

storiesOf('Channelization', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: ChannelizationReadme
    }
  })
  .addDecorator(withKnobs)
  .add('option Channelization', () => (
    <Channelization
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
              "angle": 30, 
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
              "angle":350, 
              "ins": [
                {
                  "lane": {
                    "laneId": "1541K09L650154IH09KQL0099911", 
                    "laneNo": "11", 
                    "turnDirNoList": "2", 
                    "rid": "1541K09L650154IH09KQL00", 
                    "cnlId": "999", 
                    "lnglatSeq": "", 
                    "length": null, 
                    "width": null
                  }, 
                  "deviceList": [ ], 
                  "directions": [
                    "RIGHT"
                  ], 
                  "device": [ ]
                }, 
                {
                  "lane": {
                    "laneId": "1541K09L650154IH09KQL0099912", 
                    "laneNo": "12", 
                    "turnDirNoList": "2", 
                    "rid": "1541K09L650154IH09KQL00", 
                    "cnlId": "999", 
                    "lnglatSeq": "", 
                    "length": null, 
                    "width": null
                  }, 
                  "deviceList": [ ], 
                  "directions": [
                    "BACK"
                  ], 
                  "device": [ ]
                }, 
                {
                  "lane": {
                    "laneId": "1541K09L650154IH09KQL0099913", 
                    "laneNo": "13", 
                    "turnDirNoList": "2,3", 
                    "rid": "1541K09L650154IH09KQL00", 
                    "cnlId": "999", 
                    "lnglatSeq": "", 
                    "length": null, 
                    "width": null
                  }, 
                  "deviceList": [ ], 
                  "directions": [
                    "STRAIGHT", 
                    "RIGHT"
                  ], 
                  "device": [
                    {
                      "id": "", 
                      "type": "RADAR", 
                      "taskinfo": { }
                    }
                  ]
                }, 
                {
                  "lane": {
                    "laneId": "1541K09L650154IH09KQL0099914", 
                    "laneNo": "14", 
                    "turnDirNoList": "3", 
                    "rid": "1541K09L650154IH09KQL00", 
                    "cnlId": "999", 
                    "lnglatSeq": "", 
                    "length": null, 
                    "width": null
                  }, 
                  "deviceList": [ ], 
                  "directions": [
                    "RIGHT"
                  ], 
                  "device": [
                    {
                      "deviceId": "", 
                      "type": "", 
                      "infoList": [ ]
                    }
                  ]
                }
              ], 
              "out": 0, 
              "frid": "1541K09L650154IH09KQL00", 
              "trid": "", 
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
  