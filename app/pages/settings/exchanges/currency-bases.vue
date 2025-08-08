<script setup lang="ts">
const store = useCurrencyBaseStore()
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
    id="grid-currency-bases"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="currency.symbol"
        header-text="រូបិយប័ណ្ណ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="currency.flag"
        header-text="ទង់ជាតិ"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
