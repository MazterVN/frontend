export default defineNuxtPlugin({
  name: 'phoenix-plugin',
  enforce: 'post',
  dependsOn: ['main-plugin'],
  parallel: true,
  async setup(_nuxtApp) {
    const phoenix = usePhoenix()
    const userObserve = useUserObserve()
    phoenix.connect()
    await userObserve.initChannel()
    userObserve.handleUserChange()
  },
})
