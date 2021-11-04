import { storiesOf } from '@storybook/react'
import React from 'react'
import Phase from '../../src/lib/Phase'
import PhaseReadme from '../../src/lib/Phase/README.md'
import { withReadme } from 'storybook-readme'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

storiesOf('Phase', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: PhaseReadme
    }
  })
  .addDecorator(withKnobs)
  .add('Phase', () => (
    <div style={{width: '100%', height:'50%'}}>
    <Phase
      svgWidth={100}
      svgHeight={100}
      data={object('数据', {
        "name": "xxx相位",
        "roads": [
          {"roadName":"152AV09GVF0152CJ09GVM00","angle":0},
          {"roadName":"152BH09GVK0152CJ09GVM00","angle":90},
          {"roadName":"152CS09GVQA152CJ09GVM00","angle":180},
          {"roadName":"152CL09GVD0152CJ09GVM00","angle":270}
        ],
        "turns": [
          {"from":"152AV09GVF0152CJ09GVM00","to":"152CS09GVQA152CJ09GVM00"},
          {"from":"152CS09GVQA152CJ09GVM00","to":"152AV09GVF0152CJ09GVM00"},
          {"from":"152CS09GVQA152CJ09GVM00","to":"152BH09GVK0152CJ09GVM00"},
          {"from":"152AV09GVF0152CJ09GVM00","to":"152CL09GVD0152CJ09GVM00"}
        ]
      })}
    />
    </div>
  ))
