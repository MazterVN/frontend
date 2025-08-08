<script setup lang="ts">
import { UFormInterface } from '#components'

const store = useRoleStore()
const menuStore = useMenuStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')
</script>

<template>
  <BaseModal
    title="បន្ថែម"
    submit-title="រក្សាទុក"
    @close="() => emit('close')"
    @submit="() => formRef?.submit()"
  >
    <UForm
      ref="formRef"
      :schema="store.validationSchema"
      :state="store.item"
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div class="sm:col-span-full">
        <UFormField
          name="name"
          label="ឈ្មោះ"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name-input-field"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="description"
          label="ពិពណ៌នា"
        >
          <UTextarea
            v-model="store.item.description"
            data-testid="description-input-field"
            resize
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <MenuRoleItem
          :form-ref="formRef as (InstanceType<typeof UFormInterface> | null)"
          :items="menuStore.menus"
          :max-level="3"
        />
      </div>
    </UForm>
  </BaseModal>
</template>
