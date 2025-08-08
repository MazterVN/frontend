<script setup lang="ts">
const store = useParentStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')
</script>

<template>
  <BaseModal
    title="បន្ថែម"
    submit-title="រក្សាទុក"
    :is-ready="store.isReady"
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
          name="type"
          label="ប្រភេទ"
        >
          <DropdownList
            id="type"
            v-model="store.item.type"
            data-testid="type"
            :graphql-query="ListLocalizedParentTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="job"
          label="មុខរបរ"
        >
          <DropdownList
            id="job"
            v-model="store.item.job"
            data-testid="job"
            :graphql-query="ListLocalizedJobTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
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
