// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-graphql-client',
    'nuxt-graphql-tool',
    'pinia-plugin-persistedstate',
    '@vueuse/nuxt',
    '@element-plus/nuxt',
    // 'shadcn-nuxt',
    'dayjs-nuxt',
    '@nuxtjs/supabase',
    'shadcn-nuxt',
  ],
  ssr: true,
  components: [
    { path: '~/feature-components' },
    { path: '~/components', ignore: ['ui/**'] },
  ],
  imports: {
    dirs: ['types', 'extensions', 'features/**', 'graphql/generated/*'],
  },
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet alternate',
          href: '/css/syncfusion/tailwind.min.css',
          id: 'light-theme',
        },
        {
          rel: 'stylesheet alternate',
          href: '/css/syncfusion/tailwind-dark.min.css',
          id: 'dark-theme',
        },
        {
          rel: 'stylesheet alternate',
          href: '/css/syncfusion/tailwind.override.css',
          id: 'light-theme-override',
        },
        {
          rel: 'stylesheet alternate',
          href: '/css/syncfusion/tailwind-dark.override.css',
          id: 'dark-theme-override',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    // preference: 'system',
    classSuffix: '',
  },
  runtimeConfig: {
    public: {
      GQL_HOST: '', // overwritten by process.env.GQL_HOST
      s3Server: '',
      imageCdn: '',
      apiHost: '',
      wsHost: '',
      telegramBotUsername: '',
      placeholderImg: '',
      redirectUrl: 'http://localhost:3000/confirm',
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-11-27',
  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  vite: {
    // optimizeDeps: {
    //   include: [
    //     '@syncfusion/ej2-data',
    //     '@syncfusion/ej2-grids',
    //     '@syncfusion/ej2-vue-dropdowns',
    //   ],
    // },
    plugins: [
      tailwindcss(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
          api: 'modern-compiler',
        },
      },
    },
  },
  dayjs: {
    locales: ['km', 'en'],
    plugins: ['relativeTime', 'utc', 'timezone', 'isoWeek'],
    defaultLocale: 'km',
    defaultTimezone: 'Asia/Phnom_Penh',
  },
  elementPlus: {
    themes: ['dark'],
    importStyle: 'scss',
    defaultLocale: 'km',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  googleFonts: {
    families: {
      'Roboto': [400, 700],
      'Noto Sans Khmer': [400, 700],
    },
    display: 'swap',
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'km', name: 'Khmer', file: 'km.json' },
    ],
    defaultLocale: 'km',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  icon: {
    serverBundle: {
      remote: 'jsdelivr',
    },
  },
  image: {
    providers: {
      cloudfront: {
        name: 'cloudfront',
        provider: '~/providers/awsSlsImage.ts',
        options: {
          baseURL: 'https://image.pks.edu.kh',
        },
      },
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui',
  },
  supabase: {
    redirectOptions: {
      login: '/sign-in',
      callback: '/confirm',
      include: undefined,
      exclude: [],
      saveRedirectToCookie: true,
    },
  },
})
