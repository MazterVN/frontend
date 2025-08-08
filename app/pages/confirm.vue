<script setup lang="ts">
definePageMeta({
  layout: 'no-layout',
})
const redirectInfo = useSupabaseCookieRedirect()
const session = useSupabaseSession()
const { signIn } = useAuthentication()

watch(session, async () => {
  if (session.value) {
    await delay()
    await signIn(session.value?.access_token)
    const path = redirectInfo.pluck()
    // Redirect to the saved path, or fallback to home
    return navigateTo(path || '/', { external: true })
  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center min-h-screen">
    <div>កំពុងរង់ចាំការចូលប្រើប្រាស់</div>
    <UProgress
      class="w-5xl"
      color="primary"
      size="xs"
    />
  </div>
</template>
