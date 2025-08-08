<script setup lang="ts">
const emit = defineEmits(['close'])
const loading = ref(true)
const { start, finish } = useLoadingIndicator()
defineProps({
  s3Uri: {
    type: String,
    required: true,
  },
})
start()
function onImageLoad() {
  loading.value = false
  finish()
}
function onImageError() {
  loading.value = false
  finish()
}
</script>

<template>
  <BaseModal
    title="Preview"
    no-space
    no-header
    no-footer
    @close="() => emit('close')"
  >
    <div
      class="h-[90vh] flex items-center justify-center"
      :class="{ hidden: !loading }"
    >
      <i class="icon-[eos-icons--three-dots-loading] w-14 h-14" />
    </div>
    <NuxtImg
      provider="cloudfront"
      placeholder
      class="w-full h-full"
      :src="s3Uri"
      :modifiers="{
        edits: {},
      }"
      @load="onImageLoad"
      @error="onImageError"
    />
  </BaseModal>
</template>
