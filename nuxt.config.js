export default {
  loading: {
    color: '#5469d4',
    height: '2px',
  },
  server: {
    host: '0.0.0.0',
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
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { name: 'format-detection', content: 'telephone=no' }, // 禁止识别电话
      { name: 'format-detection', content: 'email=no' }, // 禁止识别email
      { name: 'x5-orientation', content: 'portrait' }, // QQ 浏览器强制竖屏
      { name: 'x5-fullscreen', content: 'true' }, // QQ 浏览器全屏效果
      { name: 'x5-page-mode', content: 'app' }, // QQ 浏览器应用模式
      { name: 'baidu-site-verification', content: 'code-4Y2X5f1d9i' },
      { name: 'referrer', content: 'never' },
      { name: 'renderer', content: 'webkit' },
      { name: 'force-rendering', content: 'webkit' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'msapplication-TileColor', content: '#000' },
      { name: 'msapplication-TileImage', content: '/favicon.ico' },
      { name: 'msapplication-config', content: '/favicon.ico' },
      { name: 'theme-color', content: '#000' },
      { name: 'apple-mobile-web-app-title', content: 'aphelios' },
      { name: 'application-name', content: 'aphelios' },
      { name: 'msapplication-tooltip', content: 'aphelios' },
      { name: 'msapplication-starturl', content: '/' },
      { name: 'msapplication-navbutton-color', content: '#000' },
      { name: 'full-screen', content: 'yes' },
      { name: 'browsermode', content: 'application' },
      { name: 'nightmode', content: 'disable' },
      { name: 'layoutmode', content: 'fitscreen' },
      { name: 'imagemode', content: 'force' },
      { name: 'screen-orientation', content: 'portrait' },
      { name: 'x5-orientation', content: 'portrait' },
      { name: 'browsermode', content: 'application' },
      { name: 'x5-page-mode', content: 'app' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdn.plyr.io/3.7.8/plyr.css' },
    ],
    script: [
      { src: 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js' },
      {
        src: 'http://192.168.124.40:9000/public-cdn/js/emoji-mart/emoji-mart.js',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['vant/lib/index.css', 'assets/style/font-face.css', 'assets/style/reset.css', 'assets/style/utils.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/vant', '@/plugins/axios.js', '@/plugins/directives.js', '@/plugins/html-css-vars.js'],

  // Router: https://nuxtjs.org/docs/2.x/features/file-system-routing#the-router-property
  router: {
    middleware: ['check-client-id', 'load-userinfo', 'load-ip-address'],
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
    '@nuxtjs/tailwindcss',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: process.env.NODE_ENV === 'production' ? 'http://192.168.124.40:3000' : 'http://localhost:3000',
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
