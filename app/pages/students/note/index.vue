<script setup lang="ts">
const store = useStudentNoteStore()
onUnmounted(() => store.setGrid(null))
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-student-note"
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
        :allow-filtering="false"
      />
      <EColumn
        field="title"
        header-text="ចំណងជើង"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="noteAt"
        header-text="កាលបរិច្ឆេទ"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy hh:mm a"
        :auto-fit="true"
        :allow-searching="false"
        :allow-filtering="false"
      />
      <EColumn
        field="insertedAt"
        header-text="បង្កើតនៅ"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy hh:mm a"
        :auto-fit="true"
        :allow-searching="false"
        :allow-filtering="false"
      />
    </EColumns>
  </EjsGrid>
</template>
