<script setup lang="ts">
const { isLoading } = useLoadingIndicator()
const emit = defineEmits(['submit', 'close'])

function handleSubmit() {
  emit('submit')
}

function handleClose() {
  emit('close')
}

withDefaults(defineProps<{
  title?: string
  submitTitle?: string
  fullscreen?: boolean
  isReady?: boolean
  id?: string
  noSubmit?: boolean
  noSpace?: boolean
  noFooter?: boolean
  noHeader?: boolean
  ui?: { width?: string }
}>(), {
  title: 'Modal Title',
  submitTitle: 'រក្សាទុក',
  fullscreen: true,
  isReady: true,
  id: '',
  noSubmit: false,
  noSpace: false,
  noFooter: false,
  noHeader: false,
  ui: () => ({}),
})
</script>

<template>
  <ModalExtend
    :fullscreen="fullscreen"
    :title="title"
    :dismissible="false"
    :modal="false"
    :ui="{ footer: 'justify-end', content: ui?.width ?? '' }"
  >
    <template #body>
      <slot />
    </template>

    <template
      v-if="!noFooter && !$slots.footer"
      #footer
    >
      <UButton
        data-testid="close-btn"
        color="neutral"
        variant="outline"
        @click="handleClose"
      >
        ថយ
      </UButton>
      <UButton
        v-if="!noSubmit"
        data-testid="submit-btn"
        :loading="isLoading"
        @click="handleSubmit"
      >
        {{ submitTitle }}
      </UButton>
    </template>
    <template
      v-else-if="!noFooter && $slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </ModalExtend>
</template>
