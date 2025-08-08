import type { Channel } from 'phoenix'

export const useUserObserve = defineStore('userObserveStore', () => {
  const route = useRoute()
  const user = useSupabaseUser()
  const phoenix = usePhoenix()
  let channel: Channel | null = null

  async function initChannel() {
    channel = await phoenix.channel('user:lobby', {})
  }

  function handleUserChange() {
    channel?.on('on:users:all-change', (payload: { id: string, active: boolean, superUser: boolean }) => {
      const { active } = payload
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      user.value.active = active
      if (!active && route.path !== '/un-authorized') {
        navigateTo('/un-authorized')
      }

      if (active && route.path === '/un-authorized') {
        navigateTo('/')
      }
    })
  }
  return {
    initChannel,
    handleUserChange,
  }
})
