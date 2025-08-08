<script setup lang="ts">
const store = useVillageStore()
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
          :key="`communeId-${store.item.id}`"
          name="communeId"
          label="ជ្រើសរើសឃុំ/សង្កាត់"
        >
          <DropdownList
            id="commune-id"
            v-model="store.item.communeId"
            data-testid="commune-id"
            :graphql-query="ListCommuneDropdownDocument"
            :fields="{ text: 'nameWithHelper', value: 'id' }"
          />
        </UFormField>
      </div>
      <div
        v-for="(item, index) in store.item.villages"
        :key="item.id"
        class="sm:col-span-full"
      >
        <UFormField
          :name="`villages.${index}.name`"
          :label="item.languageValue ?? 'Unwnown'"
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
