<script setup lang="ts">
const store = useImagePropertySettingStore()
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
    id="grid-image-property-settings"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="useWith"
        header-text="ប្រើជាមួយ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="width"
        header-text="ទទឹង"
        text-align="Left"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="height"
        header-text="កម្ពស់"
        text-align="Left"
        :auto-fit="true"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
