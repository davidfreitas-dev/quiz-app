/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {},
    colors: {
      ...colors,
      dark: '#464757',
      primary: '#7b63dd',
      secondary: '#8a90a6',
      success: '#61cdb9',
      light: '#f7f8fc',
      'primary-light': '#eae9f9',
      'secondary-light': '#eeeeee',
      'success-light': '#eefafe'
    }
  },
  plugins: [],
};

