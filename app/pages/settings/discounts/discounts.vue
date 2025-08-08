<script setup lang="ts">
const store = useDiscountStore()
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
    id="grid-discounts"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="valueCalc"
        header-text="តម្លៃ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="description"
        header-text="ពិពណ៌នា"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="startsAt"
        header-text="ថ្ងៃចាប់ផ្តើម"
        text-align="Left"
        format="dd/MM/yyyy hh:mm a"
        type="date"
        :allow-searching="false"
        :auto-fit="true"
      />
      <EColumn
        field="expiresAt"
        header-text="ថ្ងៃបញ្ចប់"
        text-align="Left"
        format="dd/MM/yyyy hh:mm a"
        type="date"
        :allow-searching="false"
        :auto-fit="true"
      />
      <EColumn
        field="limitUsageCalc"
        header-text="ចំនួនប្រើប្រាស់អតិបរមា"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
