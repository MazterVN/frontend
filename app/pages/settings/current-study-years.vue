<script setup lang="ts">
const store = useCurrentStudyYearStore()
const formRef = useTemplateRef('formRef')

store.edit()
</script>

<template>
  <UForm
    ref="formRef"
    :schema="store.validationSchema"
    :state="store.item"
    class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
    @submit="store.createUpsert"
  >
    <div class="sm:col-span-3">
      <UCard
        class="w-full"
        :ui="{
          footer: 'p-2',
        }"
      >
        <UFormField
          :key="`studyYearId-${store.item.id}`"
          name="studyYearId"
          label="ឆ្នាំសិក្សា"
        >
          <DropdownList
            id="studyYearId"
            v-model="store.item.studyYearId"
            data-testid="study-year-id-select-field"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
        <template #footer>
          <div class="flex flex-wrap justify-end items-center">
            <div>
              <UButton
                data-testid="submit-btn"
                @click="formRef?.submit"
              >
                រក្សាទុក
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </UForm>
</template>

<style scoped></style>
