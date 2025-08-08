import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL } = {},
) => {
  const s3 = parseS3URI(src.replace(/^\/+/, ''))
  modifiers = {
    key: s3?.key,
    bucket: s3?.bucket,
    ...modifiers,
  }
  const request = JSON.stringify(modifiers)
  return {
    url: joinURL(baseURL, unicodeToBase64(request)),
  }
}
