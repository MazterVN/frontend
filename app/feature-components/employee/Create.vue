<script setup lang="ts">
const store = useEmployeeStore()
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
      <div class="sm:col-span-3">
        <UFormField
          name="name"
          label="គោត្តនាម-នាម"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="latin"
          label="គោត្តនាម-នាមឡាតាំង"
        >
          <UInput
            v-model="store.item.latin"
            data-testid="latin"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="gender"
          label="ភេទ"
        >
          <DropdownList
            id="gender"
            v-model="store.item.gender"
            :graphql-query="ListLocalizedGenderTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            data-testid="gender"
          />
        </UFormField>
      </div>
      <div
        class="sm:col-span-3"
        data-testid="dob"
      >
        <UFormField
          name="dob"
          label="ថ្ងៃខែឆ្នាំកំណើត"
        >
          <ElDatePickerExtended
            v-model="store.item.dob"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="type"
          label="តួនាទី"
        >
          <DropdownList
            id="type"
            v-model="store.item.type"
            :graphql-query="ListLocalizedEmployeeRoleTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            data-testid="type"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="tel"
          label="លេខទូរស័ព្ទ"
        >
          <UInput
            v-model="store.item.tel"
            data-testid="tel"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
