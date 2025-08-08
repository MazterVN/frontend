<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useTimetableEmployeeStore()
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
          :key="store.item.id"
          name="titletimetableEmployeeTimetables.0.timetableId"
          label="កាលវិភាគ"
        >
          <MultiDropdownList
            v-model="store.selectedTimetableIds"
            :graphql-query="ListTimetableSubjectDropdownDocument"
            :fields="{ text: 'fullSubjectCalc', value: 'id' }"
            :predicate="predicateMemoize(Predicate.and([...store.timetablePredicate]))"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.item.id"
          name="employeeId"
          label="បុគ្គលិក"
        >
          <DropdownList
            v-model="store.item.employeeId"
            data-testid="employee-id"
            :graphql-query="ListEmployeeDropdownDocument"
            :fields="{ text: 'employeeCalc', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="type"
          label="ប្រភេទ"
        >
          <DropdownList
            v-model="store.item.type"
            data-testid="type"
            :graphql-query="ListTimetableEmployeeTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="endDate"
          label="ចន្លោះពេល"
        >
          <ElDatePickerExtended
            v-model:start-at="store.item.startDate"
            v-model:end-at="store.item.endDate"
            data-testid="date-range-picker-field"
            type="daterange"
            format="ddd, DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
