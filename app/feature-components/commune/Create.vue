<script setup lang="ts">
const store = useCommuneStore()
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
          :key="`districtId-${store.item.id}`"
          name="districtId"
          label="ជ្រើសរើសស្រុក/ខណ្ឌ"
        >
          <DropdownList
            id="district-id"
            v-model="store.item.districtId"
            data-testid="district-id"
            :graphql-query="ListDistrictDropdownDocument"
            :fields="{ text: 'nameWithHelper', value: 'id' }"
          />
        </UFormField>
      </div>
      <div
        v-for="(item, index) in store.item.communes"
        :key="item.id"
        class="sm:col-span-full"
      >
        <UFormField
          :name="`communes.${index}.name`"
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
