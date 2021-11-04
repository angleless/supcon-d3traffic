import { storiesOf } from '@storybook/react'
import React from 'react'
import RoadThrough from '../../src/lib/RoadThrough'
import RoadThroughReadme from '../../src/lib/RoadThrough/README.md'
import { withReadme } from 'storybook-readme'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

const standardData = {
  points: [[0, 0], [0.3, 0], [0.4, 0], [0.5, 0], [1, 0]],
  ftimes: [0, 2846.2, 4670.0, 2573.0, 0],
  fqueues: [18.9, 18.0, 25.4, 12.9, 0.0],
  ftotals: [324, 502, 495, 350, 350],
  btimes: [2330.3, 3774.2, 3978.0, 2850.0, 1285.7],
  bqueues: [37.9, 20.9, 15.9, 26.8, 59.8],
  btotals: [340, 498, 491, 298, 166]
}
const yourFormat = v => standardData
yourFormat.toString = function () { return 'bob' }
storiesOf('RoadThrough', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: RoadThroughReadme
    }
  })
  .addDecorator(withKnobs)
  .add('显示路口', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
    />
  ))
  .add('正向时间', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
      ftimes={array('points:', [0, 2846.2, 4670.0, 2573.0, 0])}
    />
  ))
  .add('正向队长', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
      fqueues={array('fqueues:', [18.9, 18.0, 25.4, 12.9, 0.0])}
    />
  ))
  .add('正向队长 + 正向路长', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
      fqueues={array('fqueues:', [18.9, 18.0, 25.4, 12.9, 0.0])}
      ftotals={array('ftotals:', [324, 502, 495, 350, 350])}
    />
  ))
  .add('完整显示', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
      ftimes={array('points:', [0, 2846.2, 4670.0, 2573.0, 0])}
      fqueues={array('fqueues:', [18.9, 18.0, 25.4, 12.9, 0.0])}
      ftotals={array('ftotals:', [324, 502, 495, 350, 350])}
      btimes={array('btimes:', [2330.3, 3774.2, 3978.0, 2850.0, 1285.7])}
      bqueues={array('bqueues:', [37.9, 20.9, 15.9, 26.8, 59.8])}
      btotals={array('btotals:', [340, 498, 491, 298, 166])}
    />
  ))
  .add('背景色', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
      ftimes={array('points:', [0, 2846.2, 4670.0, 2573.0, 0])}
      fqueues={array('fqueues:', [18.9, 18.0, 25.4, 12.9, 0.0])}
      ftotals={array('ftotals:', [324, 502, 495, 350, 350])}
      btimes={array('btimes:', [2330.3, 3774.2, 3978.0, 2850.0, 1285.7])}
      bqueues={array('bqueues:', [37.9, 20.9, 15.9, 26.8, 59.8])}
      btotals={array('btotals:', [340, 498, 491, 298, 166])}
      style={object('style:', { background: 'pink' })}
    />
  ))
  .add('字号', () => (
    <RoadThrough
      points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
      ftimes={array('points:', [0, 2846.2, 4670.0, 2573.0, 0])}
      fqueues={array('fqueues:', [18.9, 18.0, 25.4, 12.9, 0.0])}
      ftotals={array('ftotals:', [324, 502, 495, 350, 350])}
      btimes={array('btimes:', [2330.3, 3774.2, 3978.0, 2850.0, 1285.7])}
      bqueues={array('bqueues:', [37.9, 20.9, 15.9, 26.8, 59.8])}
      btotals={array('btotals:', [340, 498, 491, 298, 166])}
      style={object('style:', { fontSize: 18 })}
    />
  ))

  .add('左上角1/4充满', () => (
      <RoadThrough
        width={number('width:',489)}
        height={number('height:',95)}
        points={array('points:', [[0, 0], [0.2, 0], [0.4, 0], [0.8, 0], [1, 0]])}
        ftimes={array('points:', [0, 2846.2, 4670.0, 2573.0, 0])}
        fqueues={array('fqueues:', [18.9, 18.0, 25.4, 12.9, 0.0])}
        ftotals={array('ftotals:', [324, 502, 495, 350, 350])}
        btimes={array('btimes:', [2330.3, 3774.2, 3978.0, 2850.0, 1285.7])}
        bqueues={array('bqueues:', [37.9, 20.9, 15.9, 26.8, 59.8])}
        btotals={array('btotals:', [340, 498, 491, 298, 166])}
        style={object('style:', { background: 'pink' })}
      />
  ))
  .add('传入标准数据(TODO)', () => (
    <RoadThrough
      data={object('原始数据（标准格式）', standardData)}
    />
  ))
  .add('非标数据转换(TODO)', () => (
    <RoadThrough
      data={object('原始数据（非标准格式）', {
        yourdata: 'your format'
      })}
      format={object('format', yourFormat)}
    />
  ))
