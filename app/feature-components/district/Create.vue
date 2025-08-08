<script setup lang="ts">
const store = useDistrictStore()
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
          :key="`provinceId-${store.item.id}`"
          name="provinceId"
          label="ជ្រើសរើសខេត្ត"
        >
          <DropdownList
            id="province-id"
            v-model="store.item.provinceId"
            data-testid="province-id"
            :graphql-query="ListProvinceDocument"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
      </div>
      <div
        v-for="(item, index) in store.item.districts"
        :key="item.id"
        class="sm:col-span-full"
      >
        <UFormField
          :name="`districts.${index}.name`"
          :label="item.languageValue ?? 'Unknown'"
        >
          <UInput
            v-model="item.name"
            :data-testid="`${item.language.toLowerCase()}-input-field`"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
