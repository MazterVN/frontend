export const useAuthentication = defineStore('authenticationStore', () => {
  // State
  const _user = useSupabaseUser()
  const supabase = useSupabaseClient()

  // Computed
  const user = ref<DBUser>({
    id: '',
    emailOrPhone: '',
    active: false,
    superUser: false,
  })
  const loggedIn = computed(() => !!_user.value)
  const signIn = async (accessToken?: string) => {
    if (!accessToken) return
    const data = await userRepository.signIn(accessToken)
    if (!data) return
    if (data?.signIn?.errors && data.signIn.errors.length > 0) {
      await signOut()
      return
    }
    user.value = data.signIn.result as DBUser
  }

  const getUser = async (accessToken?: string) => {
    if (!accessToken) return
    const data = await userRepository.getAuthenticated(accessToken)
    if (!data?.getAuthenticated) return
    user.value = data.getAuthenticated
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.log(error)
  }

  return {
    // State
    user,
    loggedIn,
    // Action
    signIn,
    signOut,
    getUser,
  }
})
