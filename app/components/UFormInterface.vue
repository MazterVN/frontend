<template>
  <form />
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

const errors = ref<FormError[]>([])
defineExpose({
  validate(
    _path?: string | string[],
    _opts: { silent?: boolean } = { silent: false },
  ) {},
  errors,
  setErrors(_errs: FormError[], _path?: string) {},
  async submit() {},
  getErrors(_path?: string) {},
  clear(_path?: string) {},
})
</script>
