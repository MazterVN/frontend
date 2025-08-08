<script setup lang="ts">
const store = useStudentStore()
const studentServiceStore = useStudentServiceStore()
onUnmounted(() => {
  store.setGridRef(null)
  // Reset student id
  studentServiceStore.setStudentId('')
})
</script>

<template>
  <EjsGrid
    v-bind="objectMemoize(store.gridConfig())"
    id="grid-students"
    :ref="store.setGridRef"
    :toolbar="store.gridToolbar"
    :row-selected="store.handleRowSelect"
    :row-deselected="store.handleRowDeselect"
  >
    <EColumns>
      <EColumn
        type="checkbox"
        width="40"
      />
      <EColumn
        field="id"
        :is-primary-key="true"
        :visible="false"
        header-text=""
        text-align="Left"
        :auto-fit="true"
        :allow-searching="false"
      />
      <EColumn
        field="bookId"
        header-text="អត្តលេខ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        text-align="Left"
        width="85"
        :template="'profile'"
        :allow-searching="false"
      >
        <template #profile="{ data }">
          <NuxtImg
            provider="cloudfront"
            placeholder
            class="w-[70px] h-[70px]"
            :src="data?.studentImage?.uri ?? S3_URI_IMAGE_PLACEHOLDER"
            :modifiers="{
              edits: {
                resize: { width: 200, height: 200, fit: 'cover' },
              },
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="name"
        header-text="គោត្តនាម-នាម"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="latin"
        header-text="គោត្តនាម-ឡាតាំង"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="localizedGender"
        header-text="ភេទ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="dob"
        header-text="ថ្ងៃខែឆ្នាំកំណើត"
        text-align="Left"
        :auto-fit="true"
        format="dd/MM/yyyy"
        type="date"
        :allow-searching="false"
      />
      <EColumn
        field="tel"
        header-text="លេខទូរស័ព្ទ"
        text-align="Left"
        :auto-fit="true"
      />
    </EColumns>
  </EjsGrid>
</template>

<style scoped></style>
