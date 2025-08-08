<script setup lang="ts">
const store = useStudyYearStore()
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
    id="grid-study-years"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="value"
        header-text="ឈ្មោះ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="beginsAt"
        header-text="ចាប់ផ្តើមនៅ"
        text-align="Left"
        :auto-fit="true"
        format="dd/MM/yyyy"
        type="date"
        :allow-searching="false"
      />
      <EColumn
        field="endsAt"
        header-text="បញ្ចប់នៅ"
        text-align="Left"
        :auto-fit="true"
        format="dd/MM/yyyy"
        type="date"
        :allow-searching="false"
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
