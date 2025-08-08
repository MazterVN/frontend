<script setup lang="ts">
const store = useStudyYearStore()
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
          name="endsAt"
          label="ចន្លោះឆ្នាំសិក្សា"
        >
          <ElDatePickerExtended
            v-model:start-at="store.item.beginsAt"
            v-model:end-at="store.item.endsAt"
            type="daterange"
            format="ddd, DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full grid gap-1">
        <UFormField
          v-for="(item, index) in store.item.studyYears"
          :key="item.id"
          :name="`studyYears.${index}.name`"
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
