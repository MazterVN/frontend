<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useAttendanceReportStore()
onUnmounted(() => {
  store.setGridRef(null)
})
</script>

<template>
  <UCard
    class="w-full"
    :ui="{
      body: 'p-1',
      footer: 'p-2',
    }"
  >
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12">
      <div class="sm:col-span-2">
        <UFormField label="ឆ្នាំសិក្សា">
          <DropdownList
            id="study-year-id"
            v-model="store.itemParam.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @update:model-value="store.itemParam.subjectGroupingId = ''"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-4">
        <UFormField
          :key="store.itemParam.studyYearId"
          label="ក្រុមមុខវិជ្ជា"
        >
          <DropdownList
            id="subject-grouping-id"
            v-model="store.itemParam.subjectGroupingId"
            data-testid="subject-grouping-id"
            :graphql-query="ListSubjectGroupingDropdownDocument"
            :fields="{ text: 'nameCalc', value: 'id' }"
            :enabled="!!store.itemParam.studyYearId"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.itemParam.studyYearId || null))"
            @update:model-value="store.itemParam.serviceDetailId = ''"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.itemParam.subjectGroupingId"
          label="សេវាកម្ម"
        >
          <DropdownList
            id="service-detail-id"
            v-model="store.itemParam.serviceDetailId"
            data-testid="service-detail-id"
            :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', store.itemParam.subjectGroupingId || null))"
            :enabled="!!store.itemParam.subjectGroupingId"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
          />
        </UFormField>
      </div>
      <div
        class="sm:col-span-3"
        data-testid="date-range"
      >
        <UFormField label="ថ្ងៃខែឆ្នាំ">
          <ElDatePickerExtended
            id="date-range"
            v-model:start-at="store.itemParam.startDate"
            v-model:end-at="store.itemParam.endDate"
            type="daterange"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <AttendanceReportGrid
          @update:grid-ref="store.setGridRef"
        />
      </div>
    </div>
  </UCard>
</template>
