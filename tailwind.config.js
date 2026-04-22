/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#fdf8f0',
          100: '#f5e6cc',
          200: '#e8c99a',
          300: '#d4a96a',
          400: '#c08040',
          500: '#8B4513',
          600: '#6b3410',
          700: '#4a240b',
          800: '#2d1607',
          900: '#1a0d04',
        },
        latte: {
          50: '#fefcf8',
          100: '#fdf5e6',
          200: '#fae8c4',
          300: '#f5d49a',
          400: '#edbb6a',
          500: '#e09940',
          600: '#c47a1e',
          700: '#9a5e12',
          800: '#6b400c',
          900: '#3d2507',
        },
        cream: '#FFF8E7',
        caramel: '#C68642',
        mocha: '#3D1C02',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'steam': 'steam 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'brew': 'brew 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(0) scaleX(1)' },
          '50%': { opacity: '0.8', transform: 'translateY(-20px) scaleX(1.3)' },
          '100%': { opacity: '0', transform: 'translateY(-40px) scaleX(0.7)' },
        },
        brew: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'wood-grain': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C68642' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
