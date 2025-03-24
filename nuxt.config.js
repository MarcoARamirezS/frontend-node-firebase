import colors from 'vuetify/es5/util/colors'

export default {
  target: 'static', // Genera archivos estáticos para Azure
  ssr: false, // Desactiva SSR, ya que no es compatible con Azure Static Web Apps

  head: {
    titleTemplate: '%s - frontend-node-firebase',
    title: 'frontend-node-firebase',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Frontend de Node y Firebase' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    // baseURL: process.env.BASE_URL || 'https://test-backend-acdghwgtbhh0bzee.canadacentral-01.azurewebsites.net/api'
    baseURL: 'http://localhost:5050/api'
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/users/login', method: 'post' },
          logout: { url: '/users/logout', method: 'post' },
          user: { url: '/users/user', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/',
      logout: '/',
      home: '/principal'
    }
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    icons: {
      iconfont: 'mdi'
    }
  },

  router: {
    base: process.env.ROUTER_BASE || '/',
    middleware: ['auth']
  },

  generate: {
    dir: 'dist' // Azure Static Web Apps espera la carpeta 'dist'
  },

  build: {
    publicPath: '/dist/',
    extractCSS: true
  }
}
