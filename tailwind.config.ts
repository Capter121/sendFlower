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
        gufeng: {
          xuan: '#f7f4ed',      // 宣纸素白
          parchment: '#e9e2d3', // 仿古绢本
          cinnabar: '#c83c3c',  // 朱砂红
          cinnabarDark: '#992222',
          ink: '#0b0c10',       // 徽墨玄黑
          inkLight: '#1b1d24',  // 松烟墨
          gold: '#e29c36',      // 泥金赤金
          goldDark: '#b87720',
          jade: '#2d7065',      // 苍碧青玉
          jadeLight: '#52968a',
          indigo: '#2e3a59',    // 花青黛蓝
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"ZCOOL XiaoWei"', 'serif'],
        brush: ['"Ma Shan Zheng"', '"ZCOOL XiaoWei"', '"Noto Serif SC"', 'cursive'],
        display: ['"Noto Serif SC"', 'Cinzel', 'serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: []
};
