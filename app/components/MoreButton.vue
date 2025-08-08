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
    color="neutral"
    class="p-1"
    variant="link"
    :disabled="disabled"
    @click="emit('click')"
  >
    <i class="icon-[heroicons--ellipsis-horizontal-20-solid] w-4 h-4" />
  </UButton>
</template>
