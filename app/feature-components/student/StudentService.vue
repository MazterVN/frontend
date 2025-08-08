<script setup lang="ts">
const studentStore = useStudentStore()
const store = useStudentServiceStore()
onUnmounted(() => store.setGridRef(null))
</script>

<template>
  <EjsGrid
    v-bind="studentStore.studentServiceGridConfig"
    id="grid-student-services"
    :ref="store.setGridRef"
    :row-selected="store.handleRowSelect"
    :row-deselected="store.handleRowDeselect"
    :toolbar="store.gridToolbar"
  >
    <EColumns>
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
        field="transferCalc"
        header-text="ផ្លាស់ប្តូរ"
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
        field="localizedShiftType"
        header-text="វេន្ត"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="isActive"
        header-text="Active?"
        text-align="Left"
        :template="'isActive'"
        :auto-fit="true"
      >
        <template #isActive="{ data }">
          <UCheckbox
            disabled
            :model-value="data.isActive"
          />
        </template>
      </EColumn>
    </EColumns>
  </EjsGrid>
</template>
