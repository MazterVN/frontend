<script setup lang="ts">
const store = useEnrollmentStore()
onUnmounted(() => store.setGrid(null))
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-enrollment"
    :ref="store.setGrid"
    :toolbar="store.gridToolbar"
    :row-selected="store.handleRowSelect"
    :row-deselected="store.handleRowDeselect"
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
        field="studentService.student.name"
        header-text="Student Name"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="studentService.student.latin"
        header-text="Student Latin"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="studentService.student.i18nGender.nameLocalized"
        header-text="Gender"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="studentService.serviceName.nameLocalized"
        header-text="Service Name"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="enrollmentSettingDestination.serviceName.nameLocalized"
        header-text="Destination Service"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="stateNameLocalized"
        header-text="State"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="insertedAt"
        header-text="Created At"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy hh:mm a"
        :auto-fit="true"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>
