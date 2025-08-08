<script setup lang="ts">
import km from 'element-plus/es/locale/lang/km'
import en from 'element-plus/es/locale/lang/en'

const session = useSupabaseSession()
const accessToken = session.value?.access_token
const { getUser } = useAuthentication()
const i18n = useI18n()
const locale = computed(() => i18n.locale.value == 'en' ? en : km)

const colorMode = useColorMode()
const updateStylesheet = () => {
  const lightThemeLink = document.getElementById(
    'light-theme',
  ) as HTMLLinkElement
  const darkThemeLink = document.getElementById(
    'dark-theme',
  ) as HTMLLinkElement
  const lightThemeOverride = document.getElementById(
    'light-theme-override',
  ) as HTMLLinkElement
  const darkThemeOverride = document.getElementById(
    'dark-theme-override',
  ) as HTMLLinkElement
  if (colorMode.value === 'dark') {
    darkThemeLink?.setAttribute('rel', 'stylesheet')
    lightThemeLink?.setAttribute('rel', 'stylesheet alternate')

    darkThemeOverride?.setAttribute('rel', 'stylesheet')
    lightThemeOverride?.setAttribute('rel', 'stylesheet alternate')
  }
  else {
    lightThemeLink?.setAttribute('rel', 'stylesheet')
    darkThemeLink?.setAttribute('rel', 'stylesheet alternate')

    lightThemeOverride?.setAttribute('rel', 'stylesheet')
    darkThemeOverride?.setAttribute('rel', 'stylesheet alternate')
  }
}

// get user info from database
await getUser(accessToken)

onMounted(() => {
  updateStylesheet()
})
watch(() => colorMode.value, _newColorMode => updateStylesheet())
</script>

<template>
  <UApp>
    <ElConfigProvider :locale="locale">
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ElConfigProvider>
  </UApp>
</template>
