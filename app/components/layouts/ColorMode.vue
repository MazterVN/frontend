<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <UButton
    class="p-1.5"
    color="neutral"
    variant="outline"
    aria-label="Theme"
    @click="isDark = !isDark"
  >
    <i :class="[isDark ? 'icon-[heroicons--moon-20-solid]' : 'icon-[heroicons--sun-20-solid]', 'w-5 h-5']" />
  </UButton>
</template>
