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
      'primary-light': '#eae9f9',
      secondary: '#9ea0b2',
      light: '#f7f8fc',
      success: '#61cdb9',
      font: '#444865'
    }
  },
  plugins: [],
};

