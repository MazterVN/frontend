<script setup lang="ts">
import { Query } from '@syncfusion/ej2-data'

const store = useStudentServiceStore()
onUnmounted(() => store.setGridRef(null))
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-student-services"
    :ref="store.setGridRef"
    :toolbar="store.gridToolbar"
    :row-selected="store.handleRowSelect"
    :row-deselected="store.handleRowDeselect"
    :query="queryMemoize(new Query().where('isActive', 'equal', true))"
  >
    <EColumns>
      <EColumn
        type="checkbox"
        width="40"
      />
      <EColumn
        field="id"
        :is-primary-key="true"
        text-align="Left"
        :auto-fit="true"
        :template="'index'"
        :allow-searching="false"
      >
        <template #index="{ data }">
          {{ +data.index + 1 }}
        </template>
      </EColumn>
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
            :src="data.student?.studentImage?.uri ?? S3_URI_IMAGE_PLACEHOLDER"
            :modifiers="{
              edits: {
                resize: { width: 200, height: 200, fit: 'cover' },
              },
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="studyYearLocalized.name"
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
        field="serviceTypeLocalized.name"
        header-text="ប្រភេទសេវាកម្ម"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="student.name"
        header-text="គោត្តនាម-នាម"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="student.latin"
        header-text="គោត្តនាម-ឡាតាំង"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="student.localizedGender"
        header-text="ភេទ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="student.dob"
        header-text="ថ្ងៃខែឆ្នាំកំណើត"
        text-align="Left"
        :auto-fit="true"
        format="dd/MM/yyyy"
        type="date"
        :allow-searching="false"
      />
      <EColumn
        field="student.tel"
        header-text="លេខទូរស័ព្ទ"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>
