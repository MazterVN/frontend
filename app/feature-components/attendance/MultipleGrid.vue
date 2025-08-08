<script setup lang="ts">
import {
  AttendanceType,
} from '#gql/default'

const emit = defineEmits(['update:gridRef'])
function gridRef(el: GridComponent | null) {
  emit('update:gridRef', el?.ej2Instances ?? null)
}
const store = useAttendanceMultipleStore()
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.attendanceGridConfig())"
    id="grid-attendance"
    :ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="student.latin"
        header-text=""
        text-align="Left"
        width="85"
        :template="'profile'"
        :allow-searching="false"
      >
        <template #profile="{ data }">
          <NuxtImg
            provider="cloudfront"
            placeholder
            class="w-[70px] h-[70px]"
            :src="data?.student?.s3ProfileUri ?? S3_URI_IMAGE_PLACEHOLDER"
            :modifiers="{
              edits: {
                resize: { width: 200, height: 200, fit: 'cover' },
              },
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="checked"
        header-text="បានពិនិត្យ"
        text-align="Center"
        :auto-fit="true"
        :template="'checked'"
      >
        <template #checked="{ data }">
          <div class="flex justify-center">
            <UCheckbox
              v-model="data.checked"
              @update:model-value="(value) => debounceCallback(() => store.attendanceChanged({ ...data, checked: value }, 'checked'))"
            />
          </div>
        </template>
      </EColumn>
      <EColumn
        field="id"
        header-text="ល.រ"
        :is-primary-key="true"
        text-align="Left"
        width="50"
        :template="'index'"
        :allow-searching="false"
      >
        <template #index="{ data }">
          {{ +data.index + 1 }}
        </template>
      </EColumn>
      <EColumn
        field="timetable.subjectCalc"
        header-text="មុខវិជ្ជា"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="timetable.timeRange"
        header-text="ម៉ោង"
        text-align="Left"
        :auto-fit="true"
        :template="'timetableTimeRange'"
        :allow-searching="false"
      >
        <template #timetableTimeRange="{ data }">
          {{ data.timetable.timeRange }}
        </template>
      </EColumn>
      <EColumn
        field="student.name"
        header-text="ឈ្មោះសិស្ស"
        text-align="Left"
        width="200"
        :template="'studentName'"
        :allow-searching="false"
      >
        <template #studentName="{ data }">
          <div class="flex flex-col gap-y-2">
            <div>
              {{ data.student.name }}
            </div>
            <div>
              {{ data.student.latin }}
            </div>
          </div>
        </template>
      </EColumn>
      <EColumn
        field="isAbsent"
        header-text="វត្តមាន"
        text-align="Left"
        width="60"
        :template="'isAbsent'"
      >
        <template #isAbsent="{ data }">
          <UCheckbox
            :model-value="!data.isAbsent"
            @update:model-value="
              (value) => {
                data.isAbsent = !value;
                debounceCallback(() => store.attendanceChanged({ ...data, isAbsent: !value }, 'isAbsent'));
              }
            "
          />
        </template>
      </EColumn>
      <EColumn
        field="type"
        header-text="ប្រភេទ"
        text-align="Left"
        width="250"
        :template="'type'"
      >
        <template #type="{ data }">
          <DropdownList
            v-model="data.type"
            :graphql-query="ListAttendanceTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            @update:model-value="(value) => debounceCallback(() => store.attendanceChanged({ ...data, type: value }, 'type'))"
          />
        </template>
      </EColumn>
      <EColumn
        field="lateTime"
        header-text="មកយឺត(នាទី)"
        text-align="Left"
        width="85"
        :template="'lateTime'"
      >
        <template #lateTime="{ data }">
          <UInput
            v-model="data.lateTime"
            :disabled="data.type != AttendanceType.PRESENT_LATE"
            min="0"
            max="60"
            type="number"
            @update:model-value="(value) => debounceCallback(() => store.attendanceChanged({ ...data, lateTime: value }, 'lateTime'))"
          />
        </template>
      </EColumn>
      <EColumn
        field="note"
        header-text="សំគាល់"
        text-align="Left"
        width="250"
        :template="'note'"
      >
        <template #note="{ data }">
          <UTextarea
            v-model="data.note"
            resize
            :rows="2"
            @update:model-value="(value) => debounceCallback(() => store.attendanceChanged({ ...data, note: value }, 'note'))"
          />
        </template>
      </EColumn>
      <EColumn
        field="draftAt"
        header-text="Draft?"
        text-align="Center"
        :auto-fit="true"
        :template="'draftAt'"
      >
        <template #draftAt="{ data }">
          <div class="flex justify-center">
            <UCheckbox
              :model-value="data.draftAt === null ? false : true"
              disabled
            />
          </div>
        </template>
      </EColumn>
    </EColumns>
  </EjsGrid>
</template>
