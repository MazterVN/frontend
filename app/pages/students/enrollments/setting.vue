<script setup lang="ts">
const store = useEnrollmentSettingStore()
onUnmounted(() => store.setGrid(null))
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-enrollment-setting"
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
        field="name"
        header-text="ឈ្មោះ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="sourceStudyYear.nameLocalized"
        header-text="កម្រិតសិក្សាប្រភព"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="destinationStudyYear.nameLocalized"
        header-text="កម្រិតសិក្សាគោលដៅ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="seatDatetimeStart"
        header-text="ថ្ងៃចាប់ផ្តើម"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy hh:mm a"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="seatDatetimeEnd"
        header-text="ថ្ងៃបញ្ចប់"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy hh:mm a"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="insertedAt"
        header-text="បង្កើតនៅ"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy hh:mm a"
        :auto-fit="true"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>
