<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useAttendanceStore()
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
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6">
      <div class="sm:col-span-1">
        <UFormField label="ឆ្នាំសិក្សា">
          <DropdownList
            id="study-years"
            v-bind="globalDropdownListConfig()"
            v-model="store.itemParam.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @update:model-value="store.itemParam.subjectGroupingId = ''"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-2">
        <UFormField
          :key="store.itemParam.studyYearId"
          label="ក្រុមមុខវិជ្ជា"
        >
          <DropdownList
            id="subject-grouping-id"
            v-bind="globalDropdownListConfig()"
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
      <div class="sm:col-span-2">
        <UFormField
          :key="store.itemParam.subjectGroupingId"
          label="សេវាកម្ម"
        >
          <DropdownList
            id="service-detail-id"
            v-bind="globalDropdownListConfig()"
            v-model="store.itemParam.serviceDetailId"
            data-testid="service-detail-id"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
            :enabled="!!store.itemParam.subjectGroupingId"
            :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', store.itemParam.subjectGroupingId || null))"
          />
        </UFormField>
      </div>
      <div
        class="sm:col-span-1"
        data-testid="date-picker-field"
      >
        <UFormField label="ថ្ងៃខែឆ្នាំ">
          <ElDatePickerExtended
            v-model="store.itemParam.date"
            type="date"
            format="dd, DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UCard
          class="w-full"
          :ui="{
            body: '',
            footer: '!px-2 py-1',
            header: '!px-2 py-1',
          }"
        >
          <template #header>
            កាលវិភាគ
          </template>
          <Table class="table-fixed">
            <TableHeader class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0">
              <TableRow>
                <TableHead class="w-[155px]">
                  ម៉ោង
                </TableHead>
                <TableHead
                  v-for="header in store.item.headers"
                  :key="header.id"
                  class="w-[150px]"
                >
                  {{ header.value }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0">
              <TableRow
                v-for="time, rowIndex in store.item.times"
                :key="`time-${time.id}`"
              >
                <TableCell>
                  <ElTimePicker
                    readonly
                    class="!w-full"
                    :model-value="[time.startTime, time.endTime]"
                    is-range
                    range-separator="-"
                    start-placeholder="ចាប់ពី"
                    end-placeholder="បញ្ចប់"
                    format="HH:mm"
                    value-format="HH:mm:ss"
                    @update:model-value="store.updateTime(time, $event)"
                  />
                </TableCell>
                <TableCell
                  v-for="(day, cellIndex) in time.days"
                  :key="day.id"
                  :class="{
                    '!border-2 border-primary': store.selectedTimetableId === day.id,
                    'cursor-pointer': store.isValidDayForSelection(day),
                    'bg-md-surface-container text-md-on-surface-variant': $dayjs(store.itemParam.date).isoWeekday() === day.daysOfWeekSortOrder,
                  }"
                  :data-testid="`day-${rowIndex}-${cellIndex}`"
                  @click="() => store.setSelectedTimetable(day)"
                >
                  {{ day.subjectCalc }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </UCard>
      </div>
    </div>
    <div class="mt-2">
      <AttendanceIndexGrid
        @update:grid-ref="store.setGridRef"
      />
    </div>
  </UCard>
</template>
