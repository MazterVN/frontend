<script setup lang="ts">
import { AttachmentNamespace } from '#gql/default'

const store = useCmsBlogStore()
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
          label="រូបផ្ទាំងមុខ"
        >
          <ImageUploader
            v-model:file-list="store.item.thumbnails as any"
            :namespace="AttachmentNamespace.BLOG_THUMBNAIL"
            data-testid="upload-thumbnails"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="title"
          label="ចំណងជើង"
        >
          <UInput
            v-model="store.item.title"
            data-testid="title-input-field"
            @update:model-value="store.item.slug = slugify($event as string)"
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
      <div class="sm:col-span-3">
        <UFormField
          name="compartment"
          label="ផ្នែក"
        >
          <DropdownList
            id="compartment"
            v-model="store.item.compartment"
            :graphql-query="ListLocalizedBlogCompartmentTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            data-testid="compartment"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="category"
          label="ប្រភេទ"
        >
          <DropdownList
            id="category"
            v-model="store.item.category"
            :graphql-query="ListLocalizedBlogCategoryTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            data-testid="category"
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
            @update:model-value="store.item.markdown = $event"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          label="កម្រងរូបភាព"
        >
          <ImageUploader
            v-model:file-list="store.item.attachments as any"
            :namespace="AttachmentNamespace.BLOG_ATTACHMENT"
            data-testid="upload-attachments"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
