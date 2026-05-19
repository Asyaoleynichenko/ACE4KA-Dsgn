/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
      '2xl': '96rem',
      /** 1120px @ 16px — боковой scrollspy (SideScrollspyNav) */
      scrollspy: '70rem',
    },
    extend: {},
  },
  plugins: [],
};
