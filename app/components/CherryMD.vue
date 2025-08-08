<script setup lang="ts">
import type { InputProps } from '@nuxt/ui'

const emit = defineEmits(['update:modelValue'])

interface Props extends InputProps {
  modelValue?: string
  preview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  preview: false,
})

const { emitFormBlur } = useFormField<Props>(props, { deferInputValidation: true })
</script>

<template>
  <ClientOnly>
    <CherryMDComponent
      :id="props.id"
      :model-value="props.modelValue"
      :preview="props.preview"
      @update:model-value="(newValue) => emit('update:modelValue', newValue)"
      @blur="emitFormBlur"
    />
  </ClientOnly>
</template>
