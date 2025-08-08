<script setup lang="ts">
import { Query } from '@syncfusion/ej2-data'

const emit = defineEmits(['update:gridRef'])
function gridRef(el: GridComponent | null) {
  emit('update:gridRef', el?.ej2Instances ?? null)
}
const store = useAttendanceReportStore()
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-attendance"
    :ref="gridRef"
    :data-source="graphqlMemoize(ListStudentServiceWithAttendanceReportDocument, store.itemParam.endDate ? { startDate: store.itemParam.startDate, endDate: store.itemParam.endDate } : {})"
    :query="queryMemoize(store.itemParam.serviceDetailId ? new Query().where('serviceDetailId', 'equal', store.itemParam.serviceDetailId) : new Query())"
  >
    <EColumns>
      <EColumn
        field="studyYear.value"
        header-text="ឆ្នាំសិក្សា"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="serviceName.nameLocalized"
        header-text="សេវាកម្ម"
        text-align="Left"
        :auto-fit="true"
      />
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
        field="attendanceAbsent"
        header-text="អវត្តមាន (មិនមានការអនុញ្ញាត)"
        text-align="Center"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="attendanceAbsentExcused"
        header-text="អវត្តមាន (មានការអនុញ្ញាត)"
        text-align="Center"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="attendanceLate"
        header-text="វត្តមាន (យឺត)"
        text-align="Center"
        :auto-fit="true"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>
