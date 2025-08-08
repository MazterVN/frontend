<script setup lang="ts">
const store = useSubjectStore()
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
      class="space-y-4"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <UFormField
        v-for="(item, index) in store.item.subjects"
        :key="item.id"
        :name="`subjects.${index}.name`"
        :label="item.languageValue ?? 'Unknown'"
      >
        <UInput
          v-model="item.name"
          :data-testid="`${item.language.toLowerCase()}-input-field`"
        />
      </UFormField>
    </UForm>
  </BaseModal>
</template>
