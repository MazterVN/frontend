<script setup lang="ts">
const store = useCurrencyStore()
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
    id="grid-currencies"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="symbol"
        header-text="រូបិយប័ណ្ណ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="flag"
        header-text="ទង់ជាតិ"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
