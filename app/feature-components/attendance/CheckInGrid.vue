<script setup lang="ts">
import {
  AttendanceType,
} from '#gql/default'

const emit = defineEmits(['update:gridRef'])
function gridRef(el: GridComponent | null) {
  emit('update:gridRef', el?.ej2Instances ?? null)
}
const store = useAttendanceCheckInStore()
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.attendanceGridConfig())"
    id="grid-attendance"
    :ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="attendance.checked"
        header-text="បានពិនិត្យ"
        text-align="Center"
        :auto-fit="true"
        :template="'checked'"
      >
        <template #checked="{ data }">
          <div class="flex justify-center">
            <UCheckbox
              v-model="data.attendance.checked"
              :data-testid="`checked-${data.index}`"
              @update:model-value="
                () => {
                  debounceCallback(() =>
                    store.attendanceChanged(data.attendance, 'checked'),
                  );
                }
              "
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
        field="student.latin"
        header-text=""
        text-align="Left"
        width="85"
        :template="'profile'"
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
        field="student.name"
        header-text="ឈ្មោះសិស្ស"
        text-align="Left"
        width="200"
        :template="'studentName'"
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
        field="attendance.isAbsent"
        header-text="វត្តមាន"
        text-align="Left"
        width="60"
        :template="'isAbsent'"
      >
        <template #isAbsent="{ data }">
          <UCheckbox
            :model-value="!data.attendance.isAbsent"
            :data-testid="`is-absent-${data.index}`"
            @update:model-value="(value) => {
              data.attendance.isAbsent = !value
              debounceCallback(() => store.attendanceChanged(data.attendance, 'isAbsent'))
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="attendance.type"
        header-text="ប្រភេទ"
        text-align="Left"
        width="250"
        :template="'type'"
      >
        <template #type="{ data }">
          <DropdownList
            v-model="data.attendance.type"
            :graphql-query="ListAttendanceTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            :data-testid="`type-${data.index}`"
            @update:model-value="(_value) => {
              debounceCallback(() => store.attendanceChanged(data.attendance, 'type'))
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="attendance.lateTime"
        header-text="មកយឺត(នាទី)"
        text-align="Left"
        width="85"
        :template="'lateTime'"
      >
        <template #lateTime="{ data }">
          <UInput
            v-model="data.attendance.lateTime"
            :disabled="data.attendance.type != AttendanceType.PRESENT_LATE"
            min="0"
            max="60"
            type="number"
            :data-testid="`late-time-${data.index}`"
            @update:model-value="(_value) => {
              debounceCallback(() => store.attendanceChanged(data.attendance, 'lateTime'))
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="attendance.note"
        header-text="សំគាល់"
        text-align="Left"
        width="250"
        :template="'note'"
      >
        <template #note="{ data }">
          <UTextarea
            v-model="data.attendance.note"
            resize
            :rows="2"
            :data-testid="`note-${data.index}`"
            @update:model-value="(_value) => {
              debounceCallback(() => store.attendanceChanged(data.attendance, 'note'))
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="attendance.draftAt"
        header-text="Draft?"
        text-align="Center"
        :auto-fit="true"
        :template="'draftAt'"
      >
        <template #draftAt="{ data }">
          <div class="flex justify-center">
            <UCheckbox
              :model-value="data.attendance.draftAt === null ? false : true"
              disabled
            />
          </div>
        </template>
      </EColumn>
    </EColumns>
  </EjsGrid>
</template>
