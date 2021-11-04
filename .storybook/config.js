import { addParameters, addDecorator, configure } from '@storybook/react';
import { addReadme } from 'storybook-readme';
import { themes, create } from '@storybook/theming';
// import ButtonWithPropTypes from '../components/Button/ButtonWithPropTypes';

const basicTheme = create({
  base: 'light',
  brandTitle: 'README addon',
  brandUrl: 'https://github.com/tuchk4/storybook-readme',
  brandImage: null,
});

addParameters({
  options: {
    showPanel: true,
    panelPosition: 'bottom',
    theme: basicTheme,
    // theme: themes.dark,
  }
});

addDecorator(addReadme);

function loadStories() {
  require('../stories');
}

configure(loadStories, module);