// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false, // Pure client-side WebGL & URL decompression SPA
  modules: [
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
  ],
  tres: {
    glsl: true,
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Digital Bloom · 3D 粒子数字花束',
      meta: [
        { name: 'description', content: '极简 3D 粒子花束与数字贺卡生成分享' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Noto+Serif+SC:wght@300;400;600&display=swap' }
      ]
    }
  }
})
