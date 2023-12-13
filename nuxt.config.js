export default {
  loading: {
    color: '#5469d4',
    height: '2px',
  },
  server: {
    port: 9003, // 默认为 3000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'aphelios-h5',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'format-detection', content: 'telephone=no' }, // 禁止识别电话
      { name: 'format-detection', content: 'email=no' }, // 禁止识别email
      { name: 'x5-orientation', content: 'portrait' }, // QQ 浏览器强制竖屏
      { name: 'x5-fullscreen', content: 'true' }, // QQ 浏览器全屏效果
      { name: 'x5-page-mode', content: 'app' }, // QQ 浏览器应用模式
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['vant/lib/index.css', 'assets/style/font-face.css', 'assets/style/reset.css', 'assets/style/utils.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/vant', '@/plugins/axios.js'],

  // Router: https://nuxtjs.org/docs/2.x/features/file-system-routing#the-router-property
  router: {
    middleware: ['check-client-id', 'load-userinfo'],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3000',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      scss: {
        additionalData: '@import "@/assets/style/variables.scss";',
      },
    },
  },
};
