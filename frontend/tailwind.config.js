import flowbitePlugin from 'flowbite/plugin';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    flowbitePlugin,
    plugin(({ addUtilities, config }) => {
      const newUtilities = {
        '.h1': {
          'line-height': '44px',
          'font-size': '40px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h2': {
          'line-height': '40px',
          'font-size': '34px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h3': {
          'line-height': '30px',
          'font-size': '26px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h4': {
          'line-height': '22px',
          'font-size': '18px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h5': {
          'line-height': '18px',
          'font-size': '16px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h6': {
          'line-height': '16px',
          'font-size': '14px',
          'font-weight': config('theme.fontWeight.bold')
        }
      };

      addUtilities(newUtilities);
    })
  ]
};
