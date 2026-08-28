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
      title: '花笺记 · 3D 东方繁花数字礼笺',
      meta: [
        { name: 'description', content: '极简东方古风 3D 繁花与数字花笺生成分享' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@300;400;600;700&family=ZCOOL+XiaoWei&display=swap' }
      ]
    }
  }
})
