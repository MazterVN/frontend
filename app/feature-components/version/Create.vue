<script setup lang="ts">
const store = useVersionStore()
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
      <div class="sm:col-span-1">
        <UFormField
          name="draft"
          label="Draft"
        >
          <UCheckbox
            v-model="store.item.draft"
            data-testid="draft-checkbox"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-2">
        <UFormField
          :key="store.item.id"
          name="platform"
          label="Platform"
        >
          <DropdownList
            v-model="store.item.platform"
            :graphql-query="ListPlatformTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            data-testid="platform-selectfield"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-2">
        <UFormField
          name="appName"
          label="App Name"
        >
          <UInput
            v-model="store.item.appName"
            placeholder="sma-app"
            data-testid="app-name-inputfield"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-2">
        <UFormField
          name="version"
          label="កំណែ"
        >
          <UInput
            v-model="store.item.version"
            placeholder="v1.x.x"
            data-testid="version-inputfield"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-2">
        <UFormField
          name="released"
          label="Release date"
          data-testid="date-release"
        >
          <ElDatePickerExtended
            id="date-release"
            v-model="store.item.released"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="changes"
          label="Changes"
        >
          <CherryMD
            :key="store.item.id"
            @update:model-value="store.item.changes = $event"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
