<script setup lang="ts">
const store = useInvoiceIntervalStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')
</script>

<template>
  <BaseModal
    title="កែប្រែ"
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
      <div class="sm:col-span-3">
        <UFormField
          :key="`mode-${store.item.id}`"
          name="mode"
          label="Mode"
        >
          <DropdownList
            id="mode"
            v-model="store.item.mode"
            data-testid="mode-select-field"
            :graphql-query="ListLocalizedIntervalModeTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`day-${store.item.id}`"
          name="day"
          label="ចំនួនថ្ងៃ"
        >
          <UInput
            id="day"
            :model-value="store.item.day ?? 0"
            type="number"
            data-testid="day-numeric-field"
            @update:model-value="store.item.day = $event as number"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
