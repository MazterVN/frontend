<script setup lang="ts">
const store = useCmsPageStore()
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
    id="grid-cms-pages"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="title"
        header-text="ចំណងជើង"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="slug"
        header-text="Slug"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="insertedAt"
        header-text="បង្កើតនៅ"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy HH:mm a"
        :auto-fit="true"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>
