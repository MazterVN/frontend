<script setup lang="ts">
import { Query, Predicate } from '@syncfusion/ej2-data'

const store = useTimetableStore()
const timetableEmployeeStore = useTimetableEmployeeStore()
const gridRef = ref(null)

watchEffect(() => {
  if (gridRef.value) {
    timetableEmployeeStore.setGridRef(gridRef.value)
    timetableEmployeeStore.initToolbar()
  }
})
onUnmounted(() => {
  timetableEmployeeStore.setGridRef(null)
})
onKeyStroke('Escape', (_e) => {
  store.editTimetableId = null
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
            v-model="store.itemParam.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @update:model-value="store.itemParam.subjectGroupingId = ''"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.itemParam.studyYearId"
          label="ក្រុមមុខវិជ្ជា"
        >
          <DropdownList
            id="subject-grouping-id"
            v-model="store.itemParam.subjectGroupingId"
            data-testid="subject-grouping-id"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.itemParam.studyYearId))"
            :enabled="!!store.itemParam.studyYearId"
            :graphql-query="ListSubjectGroupingDropdownDocument"
            :fields="{ text: 'nameCalc', value: 'id' }"
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
            v-model="store.itemParam.serviceDetailId"
            data-testid="service-detail-id"
            :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', store.itemParam.subjectGroupingId))"
            :enabled="!!store.itemParam.subjectGroupingId"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
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
            <UButton
              :disabled="!store.allowSaveBtn"
              label="រក្សាទុក"
              color="neutral"
              data-testid="save-btn"
              @click="store.submit"
            >
              <template #leading>
                <i class="icon-[lucide--save]" />
              </template>
            </UButton>
          </template>
          <Table class="table-fixed">
            <TableHeader class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0">
              <TableRow>
                <TableHead class="w-[175px]">
                  ម៉ោង
                </TableHead>
                <TableHead
                  v-for="header in store.item.headers"
                  :key="header.id"
                  class="w-[165px]"
                >
                  {{ header.value }}
                </TableHead>
                <TableHead class="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0">
              <TableRow
                v-for="(time, index) in store.item.times"
                :key="`time-${time.id}`"
              >
                <TableCell>
                  <div :data-testid="`time-picker-${index}`">
                    <ElTimePicker
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
                  </div>
                </TableCell>
                <TableCell
                  v-for="(day, subIndex) in time.days"
                  :key="day.id"
                  :data-testid="`cell-${index}-${subIndex}`"
                  :class=" {
                    '!border-2 border-primary': store.selectedTimetableId === day.id,
                    'cursor-pointer': true,
                  }
                  "
                  @click="() => store.setSelectedTimetableId(day.id)"
                  @dblclick="() => store.editTimetableId = day.id"
                >
                  <DropdownList
                    :key="`subject-grouping-detail-${day.id}`"
                    v-model="day.subjectGroupingDetailId"
                    :data-testid="`subject-grouping-detail-${index}-${subIndex}`"
                    :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', store.itemParam.subjectGroupingId))"
                    :enabled="store.editTimetableId === day.id"
                    :graphql-query="ListSubjectGroupingDetailDropdownDocument"
                    :fields="{ text: 'fullSubjectCalc', value: 'id' }"
                  />
                </TableCell>
                <TableCell class="text-center">
                  <TrashButton
                    :data-testid="`remove-time-${index}`"
                    :disabled="store.item.times.length === 1"
                    @click="store.removeTime(time.id)"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <template #footer>
            <div class="flex flex-wrap justify-end items-center">
              <PlusButton
                data-testid="add-time-btn"
                @click="store.addTime"
              />
            </div>
          </template>
        </UCard>
      </div>
    </div>
    <div class="mt-2">
      <EjsGrid
        v-bind="objectMemoize(timetableEmployeeStore.gridConfig())"
        id="grid-timetable-employees"
        ref="gridRef"
        :query="queryMemoize(new Query().where('timetables.id', 'equal', null))"
      >
        <EColumns>
          <EColumn
            field="startDate"
            header-text="ចាប់ផ្តើមនៅ"
            text-align="Left"
            type="date"
            format="dd/MM/yyyy"
            :auto-fit="true"
          />
          <EColumn
            field="endDate"
            header-text="បញ្ចប់នៅ"
            text-align="Left"
            type="date"
            format="dd/MM/yyyy"
            :auto-fit="true"
          />
          <EColumn
            field="localizedType"
            header-text="ប្រភេទ"
            text-align="Left"
            :auto-fit="true"
          />
          <EColumn
            field="employee.name"
            header-text="គោត្តនាម-នាម"
            text-align="Left"
            :auto-fit="true"
          />
          <EColumn
            field="employee.latin"
            header-text="គោត្តនាម-នាមឡាតាំង"
            text-align="Left"
            :auto-fit="true"
          />
          <EColumn
            field="employee.localizedGender"
            header-text="ភេទ"
            text-align="Left"
            :auto-fit="true"
          />
          <EColumn
            field="employee.tel"
            header-text="លេខទូរស័ព្ទ"
            text-align="Left"
            :auto-fit="true"
          />
          <EColumn
            field="employee.localizedType"
            header-text="តួនាទី"
            text-align="Left"
            :auto-fit="true"
          />
          <EColumn
            field="insertedAt"
            header-text="បង្កើតនៅ"
            text-align="Left"
            type="date"
            format="dd/MM/yyyy HH:mm a"
            :auto-fit="true"
          />
        </EColumns>
      </EjsGrid>
    </div>
  </UCard>
</template>
