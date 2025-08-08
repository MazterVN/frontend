<script setup lang="ts">
const store = useCmsPageStore()
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
          name="title"
          label="ចំណងជើង"
        >
          <UInput
            v-model="store.item.title"
            data-testid="title-input-field"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="slug"
          label="Slug"
        >
          <UInput
            v-model="store.item.slug"
            data-testid="slug-input-field"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="markdown"
          label="Content"
        >
          <CherryMD
            :key="store.item.id"
            v-model="store.item.markdown as string"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
