<script setup lang="ts">
const store = useVersionStore()
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
    id="grid-versions"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="localizedPlatform"
        header-text="Platform"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="appName"
        header-text="ឈ្មោះកម្មវិធី"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="version"
        header-text="កំណែ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="released"
        header-text="Release Date"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy"
        :auto-fit="true"
        :allow-filtering="false"
        :allow-searching="false"
      />
      <EColumn
        field="draft"
        header-text="Draft?"
        text-align="Left"
        :template="'draft'"
        :auto-fit="true"
        :allow-searching="false"
      >
        <template #draft="{ data }">
          <UCheckbox
            disabled
            :model-value="data.draft"
          />
        </template>
      </EColumn>
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
