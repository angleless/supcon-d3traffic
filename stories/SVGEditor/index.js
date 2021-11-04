import React from 'react';
import { storiesOf } from '@storybook/react';
import SVGEditor from '../../src/lib/SVGEditor'


storiesOf('SVGEditor', module)
  .add('default', () => <div style={{width:400, height:400, background:'rgba(200,200,200,0.5)'}}><SVGEditor /></div>)