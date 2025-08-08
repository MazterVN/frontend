<script setup lang="ts">
const store = useUserStore()
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
    id="grid-users"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        field="fullName"
        header-text="ឈ្មោះ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="emailOrPhone"
        header-text="អ៊ីម៉ែល/លេខទូរស័ព្ទ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="bucket"
        header-text="Storage"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="bucketFolder"
        header-text="Folder"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="superUser"
        header-text="Super User"
        text-align="Left"
        :template="'superUser'"
        :auto-fit="true"
        :allow-searching="false"
      >
        <template #superUser="{ data }">
          <UCheckbox
            disabled
            :model-value="data.superUser"
          />
        </template>
      </EColumn>
      <EColumn
        header-text="Active"
        text-align="Left"
        field="active"
        :template="'active'"
        :auto-fit="true"
        :allow-searching="false"
      >
        <template #active="{ data }">
          <UCheckbox
            disabled
            :model-value="data.active"
          />
        </template>
      </EColumn>
      <EColumn
        field="employee.employeeCalc"
        header-text="Employee"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
