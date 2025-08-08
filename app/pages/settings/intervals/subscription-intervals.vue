<script setup lang="ts">
const store = useSubscriptionIntervalStore()
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
    id="grid-subscription-intervals"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="day"
        header-text="ថ្ងៃ"
        text-align="Left"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="mode"
        header-text="Mode"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
