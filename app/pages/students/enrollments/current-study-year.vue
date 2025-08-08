<script setup lang="ts">
const store = useCurrentEnrollmentStudyYearStore()
await store.readOne()
</script>

<template>
  <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12">
    <div class="sm:col-span-3">
      <UFormField
        label="ឆ្នាំសិក្សាដើម"
      >
        <DropdownList
          v-model="store.item.sourceStudyYearId"
          data-testid="source-study-year"
          :graphql-query="ListStudyYearDropdownDocument"
          :fields="{ text: 'value', value: 'id' }"
          @select="() => store.createUpsert()"
        />
      </UFormField>
    </div>

    <div class="sm:col-span-3">
      <UFormField
        label="ឆ្នាំសិក្សាគោលដៅ"
      >
        <DropdownList
          v-model="store.item.destinationStudyYearId"
          data-testid="destination-study-year"
          :graphql-query="ListStudyYearDropdownDocument"
          :fields="{ text: 'value', value: 'id' }"
          :enabled="!!store.item.sourceStudyYearId"
          @select="() => store.createUpsert()"
        />
      </UFormField>
    </div>
  </div>
</template>
