<script setup lang="ts">
const { loggedIn, signOut: clear } = useAuthentication()
const { user } = useAuthentication()
const runtimeConfig = useRuntimeConfig()
async function signOut() {
  await clear()
  await delay(100)
  navigateTo('/sign-in', { external: true })
}
const telegramDeepLink = computed(() => {
  return `https://t.me/${runtimeConfig.public.telegramBotUsername}?start=${unicodeToBase64(user?.id ?? '')}`
})
function connectTelegram(deepLink: string) {
  navigateTo(deepLink, { external: true, open: {
    target: '_blank',
  } })
}
const userProfile = computed(() => user?.profile ?? S3_URI_IMAGE_PLACEHOLDER)
</script>

<template>
  <DropdownMenu v-if="loggedIn">
    <DropdownMenuTrigger as-child>
      <UAvatar
        v-if="userProfile.startsWith('http')"
        class="cursor-pointer"
        data-testid="account-profile"
        :src="userProfile"
        size="sm"
      />
      <NuxtImg
        v-else
        provider="cloudfront"
        placeholder
        class="w-8 h-8 rounded-full cursor-pointer"
        data-testid="account-profile"
        :src="userProfile"
        :modifiers="{
          edits: {
            resize: { width: 200, height: 200, fit: 'cover' },
          },
        }"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>
        <div class="text-left">
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ user?.emailOrPhone }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <i class="icon-[lucide--user] mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="connect-telegram"
          @click="connectTelegram(telegramDeepLink)"
        >
          <i class="icon-[logos--telegram] mr-2 h-4 w-4" />
          <span>Connect Telegram</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <i class="icon-[lucide--settings] mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        data-testid="sign-out"
        @click="signOut"
      >
        <i class="icon-[lucide--log-out] mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <UButton
    v-else
    :external="true"
    to="/auth/auth0"
    type="button"
    icon="material-symbols:login"
    color="neutral"
    variant="outline"
    aria-label="Theme"
  />
</template>
