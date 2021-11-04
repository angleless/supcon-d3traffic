import { storiesOf } from '@storybook/react'
import React from 'react'
import TimeReal from '../../src/lib/TimeReal'
import TimeRealReadme from '../../src/lib/TimeReal/README.md'
import { withReadme } from 'storybook-readme'
import { withKnobs, text, array, object, number, boolean, color, select } from '@storybook/addon-knobs'

storiesOf('TimeReal', module)
  .addParameters({
    readme: {
      codeTheme: 'duotone-sea',
      sidebar: TimeRealReadme
    }
  })
  .addDecorator(withKnobs)
  .add('TimeReal', () => (
    <TimeReal />
  ))
