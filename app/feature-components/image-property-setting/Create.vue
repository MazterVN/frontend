<script setup lang="ts">
const store = useImagePropertySettingStore()
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
          :key="`useWidth-${store.item.id}`"
          name="useWith"
          label="ប្រើប្រាស់ជាមួយ"
        >
          <DropdownList
            id="use-with"
            v-model="store.item.useWith"
            data-testid="use-with-select-field"
            :graphql-query="ListLocalizedImagePropertySettingUseWithTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`width-${store.item.id}`"
          name="width"
          label="ទទឹង"
        >
          <UInput
            id="width"
            v-model="store.item.width"
            type="number"
            data-testid="width-numeric-field"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-3">
        <UFormField
          :key="`height-${store.item.id}`"
          name="height"
          label="កម្ពស់"
        >
          <UInput
            id="height"
            v-model="store.item.height"
            type="number"
            data-testid="height-numeric-field"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
