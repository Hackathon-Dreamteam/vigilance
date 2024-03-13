import flowbitePlugin from 'flowbite/plugin';
import plugin from 'tailwindcss/plugin';
import animatePlugin from 'tailwindcss-animate';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...colors,
      primary: 'rgb(86, 115, 72)',
      secondary: 'rgb(14, 146, 173)',
      default: 'rgb(52, 60, 62)',
      error: 'rgb(168, 45, 19)'
    },
    extend: {
      animationDuration: {
        1200: '1200ms',
        1500: '1500ms',
        2000: '2000ms',
        3000: '3000ms'
      },
      animationDelay: {
        1200: '1200ms',
        2000: '2000ms',
        3000: '3000ms'
      },
      animation: {
        'spin-slow': 'spin 5s linear infinite'
      }
    }
  },
  plugins: [
    flowbitePlugin,
    animatePlugin,
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
          'line-height': '26px',
          'font-size': '22px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h5': {
          'line-height': '22px',
          'font-size': '18px',
          'font-weight': config('theme.fontWeight.bold')
        },
        '.h6': {
          'line-height': '18px',
          'font-size': '16px',
          'font-weight': config('theme.fontWeight.bold')
        }
      };

      addUtilities(newUtilities);
    })
  ]
};
