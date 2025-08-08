<script setup lang="ts">
const store = useServiceStore()
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
    id="grid-services"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="studyYearLocalized"
        header-text="ឆ្នាំសិក្សា"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="beginsAt"
        header-text="ថ្ងៃចាប់ផ្តើម"
        text-align="Left"
        format="dd/MM/yyyy"
        type="date"
        :allow-searching="false"
        :auto-fit="true"
      />
      <EColumn
        field="endsAt"
        header-text="ថ្ងៃបញ្ចប់"
        text-align="Left"
        format="dd/MM/yyyy"
        type="date"
        :allow-searching="false"
        :auto-fit="true"
      />
      <EColumn
        field="name"
        header-text="ឈ្មោះ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="localizedType"
        header-text="ប្រភេទ"
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
        field="insertedAt"
        header-text="បង្កើតនៅ"
        text-align="Left"
        format="dd/MM/yyyy hh:mm a"
        type="date"
        :allow-searching="false"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
