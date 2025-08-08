import { Socket, type Channel } from 'phoenix'

export const usePhoenix = defineStore('phoenixStore', () => {
  const runtimeConfig = useRuntimeConfig()
  const session = useSupabaseSession()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = i18n.locale.value as 'km' | 'en'
  const accessToken = (session.value?.access_token ?? '') as string
  const socket = new Socket(`${runtimeConfig.public.wsHost}/socket`, { params: { token: `Bearer ${accessToken}`, lang: language, tz: tz } })
  function connect(): Socket {
    socket.connect()
    return socket
  }

  function channel(topic: string, chanParams?: object): Promise<Channel> {
    return new Promise((resolve, reject) => {
      const channel = socket.channel(topic, chanParams)
      channel.join()
        .receive('ok', (resp) => {
          console.log(`Joined successfully: ${topic}`, resp)
          resolve(channel)
        })
        .receive('error', (resp) => {
          console.error(`Unable to join: ${topic}`, resp)
          reject(new Error(`Unable to join: ${topic}`))
        })
    })
  }

  return {
    socket,
    connect,
    channel,
  }
})
