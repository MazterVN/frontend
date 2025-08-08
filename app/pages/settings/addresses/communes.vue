<script setup lang="ts">
const store = useCommuneStore()
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
    id="grid-communes"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="district.province.value"
        header-text="ខេត្ត"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="district.value"
        header-text="ស្រុក"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="value"
        header-text="ឈ្មោះ"
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

<style scoped></style>
