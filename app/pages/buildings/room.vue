<script setup lang="ts">
const store = useBuildingRoomStore()
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
    id="grid-building-room"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="building"
        header-text="អាគារ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="floor"
        header-text="ជាន់ទី"
        text-align="Left"
        :auto-fit="true"
        :allow-filtering="false"
        :allow-searching="false"
      />
      <EColumn
        field="roomNo"
        header-text="លេខបន្ទប់"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="seatCount"
        header-text="ចំនួនកៅអី"
        text-align="Left"
        :auto-fit="true"
        :allow-filtering="false"
        :allow-searching="false"
      />
      <EColumn
        field="insertedAt"
        header-text="បង្កើតនៅ"
        text-align="Left"
        type="date"
        format="dd/MM/yyyy HH:mm a"
        :auto-fit="true"
        :allow-filtering="false"
        :allow-searching="false"
      />
    </EColumns>
  </EjsGrid>
</template>
