export default defineNuxtPlugin({
  name: 'main-plugin',
  enforce: 'default',
  dependsOn: ['supabase'],
  parallel: false,
  async setup(_nuxtApp) {
    const nuxtApp = useNuxtApp()
    const dayjs = useDayjs()
    const language = useCookie('_lang', {
      maxAge: 7776000,
      path: '/',
    })
    const tz = useCookie('_tz', {
      maxAge: 7776000,
      path: '/',
    })
    const i18n = nuxtApp.$i18n
    nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => {
      dayjs.locale(newLocale)
      changeLangCookie(newLocale)
    })
    if (import.meta.client) {
      dayjs.locale(language.value ?? 'km')
      changeLangCookie(i18n.locale.value ?? 'km')
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      tz.value = timezone
    }
    // useGqlToken(accessToken)
    const headers = {
      'X-Language': language.value ?? 'km',
      'X-Timezone': tz.value ?? 'Asia/Phnom_Penh',
    }
    useGqlHeaders({
      headers: headers,
    })
    nuxtApp.hook('gql:auth:init', ({ token }) => {
      const session = useSupabaseSession()
      token.value = (session.value?.access_token ?? '')
    })
  },
})
