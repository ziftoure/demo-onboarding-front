const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'gray-light': '#f3f3ff',
      white: '#FEFEFE',
      // primary: '#262b66',
      // 'primary-light': '#1f3b7d',
      primary: '#151838',
      'primary-light': '#23285c',
      secondary: '#4f46e5',
      tertiary: '#050931',
      'extra-light': '#ffffff',
      light: '#9195b3',
      success: '#2BC094',
      // default ones
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      gray: colors.gray,
      green: colors.green,
      red: colors.red,
      blue: colors.blue,
      yellow: colors.yellow,
      indigo: colors.indigo,
      violet: colors.violet,
    },
    extend: {
      fontFamily: {
        sans: 'Satoshi', // TODO : light and sort fonts for production
      },
    },
  },
  variants: {
    extend: {},
  },
};
