<script setup lang="ts">
const flagIcon = { km: 'icon-[twemoji--flag-cambodia]', en: 'icon-[twemoji--flag-for-flag-united-states]' }
const i18n = useI18n()
const currentFlagIcon = computed(() => flagIcon[i18n.locale.value as 'km' | 'en'])

function toggleLocale() {
  i18n.setLocale(i18n.locale.value === 'km' ? 'en' : 'km')
}
</script>

<template>
  <div class="flex">
    <UButton
      class="p-1.5"
      type="button"
      color="neutral"
      variant="outline"
      aria-label="Theme"
      data-testid="toggle-locale"
      @click.prevent.stop="toggleLocale()"
    >
      <i :class="[currentFlagIcon, 'w-5 h-5']" />
    </UButton>
  </div>
</template>

<style scoped>

</style>
