<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useStudentServiceStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')
</script>

<template>
  <BaseModal
    title="ប្តូរសេវាកម្ម"
    submit-title="រក្សាទុក"
    @close="() => emit('close')"
    @submit="() => formRef?.submit()"
  >
    <UForm
      ref="formRef"
      :schema="store.transferValidationSchema"
      :state="store.transferItem"
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div
        data-testid="date-time"
        class="sm:col-span-2"
      >
        <UFormField
          name="transferDate"
          label="ថ្ងៃប្តូរ"
        >
          <ElDatePickerExtended
            id="date-time"
            v-model="store.transferItem.transferDate"
            type="datetime"
            format="ddd, DD/MM/YYYY hh:mm A"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-4">
        <UFormField
          :key="store.selectedRecord.subjectGrouping?.id"
          name="serviceDetailId"
          label="សេវាកម្ម"
        >
          <DropdownList
            id="service-detail-id"
            v-model="store.transferItem.serviceDetailId"
            data-testid="service-detail-id"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
            :predicate="predicateMemoize(Predicate.and([
              new Predicate('subjectGroupingId', 'equal', store.selectedRecord.subjectGrouping?.id ?? ''),
              new Predicate('serviceDetailId', 'notequal', store.selectedRecord.serviceDetailId ?? ''),
            ]))"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
