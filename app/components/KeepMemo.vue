<script setup lang="ts">
defineProps({
  memo: {
    type: Array,
  },
})
</script>

<template>
  <div
    v-if="memo"
    v-memo="memo"
  >
    <slot />
  </div>
  <div v-else>
    <slot />
  </div>
</template>
