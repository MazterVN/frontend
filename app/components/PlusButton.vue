<script setup lang="ts">
const emit = defineEmits(['click'])

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <UButton
    class="p-1.5"
    :ui="{
      base: 'rounded-full',
    }"
    :disabled="disabled"
    @click="emit('click')"
  >
    <i class="icon-[heroicons--plus] w-4 h-4" />
  </UButton>
</template>
