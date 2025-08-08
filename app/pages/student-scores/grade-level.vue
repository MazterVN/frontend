<script setup lang="ts">
const store = useGpaConditionStore()
onUnmounted(() => store.setGrid(null))
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-grade-level"
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
        field="passedGpa"
        header-text="Passed GPA"
        type="number"
        text-align="Left"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="description"
        header-text="ពិពណ៌នា"
        text-align="Left"
        :auto-fit="true"
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
