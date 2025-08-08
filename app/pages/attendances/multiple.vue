<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'
import { AttendanceType } from '#gql/default'

const store = useAttendanceMultipleStore()
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
            :max-days="15"
            @change="store.setSelectedTimetableIds()"
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
            <TableHeader
              class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0"
            >
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
            <TableBody
              class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0"
            >
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
                  v-for="day, colIndex in time.days"
                  :key="day.id"
                  :class="{
                    '!bg-primary !text-md-on-primary':
                      store.selectedTimetableIds.has(day.id),
                    'cursor-pointer': store.isValidDayForSelection(day),
                    'bg-md-surface-container text-md-on-surface-variant':
                      store.weekdays.includes(day.daysOfWeekSortOrder ?? 0)
                      && !!day.subjectGroupingDetailId,
                  }"
                  :data-testid="`day-${rowIndex}-${colIndex}`"
                  @click="() => store.toggleTimetable(day)"
                >
                  {{ day.subjectCalc }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </UCard>
      </div>
      <div class="sm:col-span-full">
        <UCard
          class="w-full"
          :ui="{
            body: 'p-1',
            footer: '!px-2 py-2',
            header: '!px-2 py-1',
          }"
        >
          <div class="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-12">
            <div class="sm:col-span-full">
              <UFormField label="សិស្ស">
                <MultiDropdownList
                  v-model="store.itemParam.studentServiceIds"
                  data-testid="student-service-ids"
                  :graphql-query="ListStudentServiceDropdownDocument"
                  :fields="{ text: 'withStudentCalc', value: 'id' }"
                  :predicate="predicateMemoize(new Predicate('serviceDetailId', 'equal', store.itemParam.serviceDetailId || null))"
                  :enabled="!!store.itemParam.serviceDetailId"
                />
              </UFormField>
            </div>
            <div class="sm:col-span-1">
              <UFormField label="វត្តមាន">
                <UCheckbox
                  :model-value="!store.itemParam.isAbsent"
                  data-testid="is-absent"
                  @update:model-value="
                    (value) => {
                      store.itemParam.isAbsent = !value;
                      store.itemParam.type = !value
                        ? AttendanceType.ABSENT
                        : AttendanceType.PRESENT;
                    }
                  "
                />
              </UFormField>
            </div>
            <div class="sm:col-span-2">
              <UFormField label="ប្រភេទ">
                <DropdownList
                  id="attendance-type"
                  v-model="store.itemParam.type"
                  data-testid="attendance-type"
                  :show-clear-button="false"
                  :graphql-query="ListAttendanceTypeDocument"
                  :fields="{ text: 'text', value: 'valueUpper' }"
                  @update:model-value="
                    (value) => {
                      store.itemParam.isAbsent = [
                        AttendanceType.ABSENT,
                        AttendanceType.ABSENT_EXCUSED,
                      ].includes(value as AttendanceType);
                      store.itemParam.lateTime
                        = value !== AttendanceType.PRESENT_LATE
                          ? 0
                          : store.itemParam.lateTime;
                    }
                  "
                />
              </UFormField>
            </div>
            <div class="sm:col-span-1">
              <UFormField label="មកយឺត(នាទី)">
                <UInput
                  v-model="store.itemParam.lateTime"
                  data-testid="late-time-input"
                  :disabled="
                    store.itemParam.type != AttendanceType.PRESENT_LATE
                  "
                  type="number"
                  min="0"
                  max="60"
                />
              </UFormField>
            </div>
            <div class="sm:col-span-3">
              <UFormField label="សំគាល់">
                <UTextarea
                  v-model="store.itemParam.note"
                  data-testid="note-input"
                  placeholder="បញ្ហាសុខភាព..."
                  resize
                  :rows="2"
                />
              </UFormField>
            </div>
            <div class="sm:col-span-5">
              <UFormField label="ឯកសារ">
                <UCard
                  class="w-full"
                  :ui="{
                    body: '',
                    footer: '!px-2 py-1',
                    header: '!px-2 py-1',
                  }"
                >
                  <Table class="table-fixed">
                    <TableHeader
                      class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0"
                    >
                      <TableRow>
                        <TableHead> ឯកសារ </TableHead>
                        <TableHead class="w-[200px]">
                          សំគាល់
                        </TableHead>
                        <TableHead class="w-[50px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody
                      class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0"
                    >
                      <TableRow
                        v-for="attachment, index in store.itemParam.attachments"
                        :key="attachment.id"
                      >
                        <TableCell>
                          <UButton
                            class="w-full"
                            variant="ghost"
                            size="sm"
                            color="neutral"
                            :data-testid="`attachment-button-${index}`"
                            @click="store.attachFile(attachment.id)"
                          >
                            <i
                              v-if="!attachment.key"
                              class="icon-[heroicons--paper-clip]"
                            />
                            <div
                              v-else
                              class="text-right truncate"
                              dir="rtl"
                            >
                              {{ getFileNameFromS3URI(attachment.key) || "......" }}
                            </div>
                          </UButton>
                        </TableCell>
                        <TableCell>
                          <UInput
                            :model-value="attachment.note ?? ''"
                            placeholder="សំបុត្រពេទ្យ..."
                            type="text"
                            :data-testid="`attachment-note-${index}`"
                            @update:model-value="attachment.note = $event as string"
                          />
                        </TableCell>
                        <TableCell>
                          <TrashButton
                            :data-testid="`remove-attachment-button-${index}`"
                            @click="store.removeAttachment(attachment.id)"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <template #footer>
                    <div class="flex justify-end">
                      <PlusButton
                        data-testid="add-attachment-button"
                        @click="store.addAttachment"
                      />
                    </div>
                  </template>
                </UCard>
              </UFormField>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-end">
              <UButton
                :disabled="store.attendances.length === 0 || store.isLoading"
                data-testid="apply-and-save-button"
                @click="
                  () => {
                    store.isLoading = true;
                    debounceCallback(() => store.batchApplyChanged());
                  }
                "
              >
                អនុវត្ត និង រក្សាទុក
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
      <div class="sm:col-span-full">
        <AttendanceMultipleGrid
          @update:grid-ref="store.setGridRef"
        />
      </div>
    </div>
  </UCard>
</template>
