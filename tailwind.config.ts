import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#050508',
          900: '#090a0f',
          800: '#11131b'
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Cinzel', 'serif'],
        display: ['Cinzel', '"Noto Serif SC"', 'serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
};
