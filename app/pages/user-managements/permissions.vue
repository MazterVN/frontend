<script setup lang="ts">
const store = usePermissionStore()
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
    id="grid-permissions"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="resource"
        header-text="Resource"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="action"
        header-text="Action"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="actionGroup"
        header-text="Action Group"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="description"
        header-text="Description"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="docPage"
        header-text="Document Page"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>
