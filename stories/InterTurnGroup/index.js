import { storiesOf } from '@storybook/react'
import React from 'react'
import InterTurnGroup from '../../src/lib/InterTurnGroup'
import InterTurnGroupReadme from '../../src/lib/InterTurnGroup/README.md'
import { withReadme } from 'storybook-readme'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

storiesOf('InterTurnGroup', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: InterTurnGroupReadme
    }
  })
  .addDecorator(withKnobs)
  .add('InterTurnGroup', () => (
    <div style={{width: '100%', height:'50%'}}>
    <InterTurnGroup
      arrowStyle={object('箭头样式', { color: 'black', headlen: 10, theta: 30, lineWidth: 1 })}
      lineStyle={object('线样式', { strokeColor: 'black', lineWidth: 1 })}
      interStyle={object('路口点样式', { strokeColor: 'black', fillColor: 'black', radius: 5 })}
      phaseNameStyle={object('转向名样式', {phaseNameBg: 'silver', phaseNameColor: 'white'})}
      data={[
        {
          name: '转向1',
          inter: '113.270186,23.158465',
          lnglats: ['113.270492,23.15917;113.270374,23.158854;113.269982,23.158065;113.269912,23.157893']
        },
        {
          name: '转向2',
          inter: '113.270186,23.158465',
          lnglats: ['113.268947,23.158514;113.26958,23.15849;113.270374,23.15849;113.270739,23.158465']
        }
      ]}
    />
    </div>
  ))
