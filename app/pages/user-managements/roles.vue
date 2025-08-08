<script setup lang="ts">
const store = useRoleStore()
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
    id="grid-roles"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="name"
        header-text="ឈ្មោះ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="description"
        header-text="ការពិពណ៌នា"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>
