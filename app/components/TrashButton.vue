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
    color="error"
    variant="link"
    size="sm"
    :disabled="disabled"
    @click="emit('click')"
  >
    <i class="icon-[heroicons--trash] w-4 h-4" />
  </UButton>
</template>
