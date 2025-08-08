<script setup lang="ts">
const store = useCurrencyStore()
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
      <div class="sm:col-span-full">
        <UFormField
          :key="`symbol-${store.item.id}`"
          name="symbol"
          label="រូបិយប័ណ្ណ"
        >
          <DropdownList
            id="symbol"
            v-model="store.item.symbol"
            data-testid="symbol"
            :graphql-query="ListLocalizedCurrencySymbolTypesDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="flag"
          label="ទង់ជាតិ"
        >
          <UInput
            v-model="store.item.flag"
            data-testid="flag"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
