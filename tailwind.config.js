/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    extend: {},
    colors: {
      ...colors,
      primary: '#7d64e7',
      secondary: '#9ea0b2',
      light: '#f7f8fc',
      success: '#61cdb9',
      'primary-light': '#eae9f9',
      'primary-font': '#444865',
      'secondary-font': '#ebeaee'
    }
  },
  plugins: [],
};

