<script setup lang="ts">
const store = useStudentNoteReportStore()
onUnmounted(() => store.setGrid(null))
</script>

<template>
  <div class="grid grid-cols-1 gap-2">
    <ElDatePickerExtended
      v-model:start-at="store.filterParam.startDate"
      v-model:end-at="store.filterParam.endDate"
      type="daterange"
    />
    <EjsGrid
      v-bind="objectMemoize(store.gridConfig())"
      id="grid-student-note-report"
      :ref="store.setGrid"
      :toolbar="store.gridToolbar"
      :row-selected="store.handleRowSelect"
      :row-deselected="store.handleRowDeselect"
      :data-source="store.gridDataSource"
    >
      <EColumns>
        <EColumn
          type="checkbox"
          width="40"
        />
        <EColumn
          field="id"
          :is-primary-key="true"
          :visible="false"
          header-text=""
          text-align="Left"
          :auto-fit="true"
          :allow-searching="false"
        />
        <EColumn
          field="studyYear.nameLocalized"
          header-text="កម្រិតសិក្សា"
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
          field="student.name"
          header-text="ឈ្មោះសិស្ស"
          text-align="Left"
          width="170"
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
          field="studentNotePerformanceImprovementLetter"
          header-text="លិខិតណែនាំ"
          text-align="Left"
          :auto-fit="true"
          :allow-searching="false"
        />
        <EColumn
          field="studentNoteWarningLetter"
          header-text="លិខិតព្រមាន"
          text-align="Left"
          :auto-fit="true"
          :allow-searching="false"
        />
        <EColumn
          field="studentNoteContract"
          header-text="កិច្ចសន្យា"
          text-align="Left"
          :auto-fit="true"
          :allow-searching="false"
        />
        <EColumn
          field="studentNoteOther"
          header-text="ឯកសារផ្សេងៗ"
          text-align="Left"
          :auto-fit="true"
          :allow-searching="false"
        />
      </EColumns>
    </EjsGrid>
  </div>
</template>
