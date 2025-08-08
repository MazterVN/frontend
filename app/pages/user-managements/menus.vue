<script setup lang="ts">
import { UFormInterface } from '#components'

const store = useMenuStore()
const formRef = useTemplateRef('formRef')
</script>

<template>
  <UForm
    ref="formRef"
    :schema="store.validationSchema"
    :state="[]"
    class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
    @submit="store.createRelatedUpsert"
  >
    <div class="sm:col-span-full flex flex-col gap-2">
      <MenuItem
        :form-ref="formRef as (InstanceType<typeof UFormInterface> | null)"
        :items="store.menus"
        :max-level="3"
      />
      <UButton
        data-testid="submit-btn"
        block
        @click="formRef?.submit"
      >
        Save
      </UButton>
    </div>
  </UForm>
</template>
