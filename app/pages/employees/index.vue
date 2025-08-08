<script setup lang="ts">
const store = useEmployeeStore()
const gridRef = ref(null)
watchEffect(() => {
  if (gridRef.value) {
    store.setGridRef(gridRef.value)
    store.initToolbar()
  }
})
onUnmounted(() => {
  store.setGridRef(null)
})
</script>

<template>
  <EjsGrid
    v-bind="store.gridConfig()"
    id="grid-employees"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="name"
        header-text="គោត្តនាម-នាម"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="latin"
        header-text="គោត្តនាម-នាមឡាតាំង"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="localizedGender"
        header-text="ភេទ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="dob"
        header-text="ថ្ងៃខែឆ្នាំកំណើត"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy"
        :auto-fit="true"
        :allow-filtering="false"
        :allow-searching="false"
      />
      <EColumn
        field="localizedType"
        header-text="តួនាទី"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="tel"
        header-text="លេខទូរស័ព្ទ"
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
        :allow-filtering="false"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>
