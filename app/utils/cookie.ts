export type CookieType = {
  lang: string
  tz: string
}

export function useCookieExtract(cookie: string): CookieType {
  const langMatch = cookie.match(/_lang=([^;]*)/)
  const tzMatch = cookie.match(/_tz=([^;]*)/)

  const lang = langMatch ? langMatch[1] : ''
  const tz = tzMatch ? tzMatch[1] : ''

  return { lang: lang ?? '', tz: tz ?? '' }
}

export function changeLangCookie(lang: string): void {
  const cookie = useCookie('_lang', {
    maxAge: 7776000,
    path: '/',
  })
  cookie.value = lang
}
