<script setup lang="ts">
const store = useStudentStore()
const emit = defineEmits(['submit', 'error'])
const formRef = useTemplateRef('formRef')

function submit() {
  formRef.value?.submit()
}
defineExpose({ submit })
</script>

<template>
  <UForm
    ref="formRef"
    :schema="store.validationSchema"
    :state="store.item"
    @submit="(evt) => emit('submit', evt)"
    @error="(evt) => emit('error', evt)"
  >
    <UCard
      class="w-full card-table"
      :ui="CARD_TABLE_UI"
    >
      <Table class="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead class="w-[200px]">
              ឆ្នាំសិក្សា
            </TableHead>
            <TableHead class="w-[150px]">
              ប្រភេទ
            </TableHead>
            <TableHead>
              អាសយដ្ឋាន
            </TableHead>
            <TableHead class="w-[40px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, index) in store.item.studentAddresses"
            :key="row.id"
          >
            <TableCell>
              <UFormField
                :key="`student-addresses-${row.id}-studyYearId`"
                :name="`studentAddresses.${index}.studyYearId`"
              >
                <DropdownList
                  v-model="row.studyYearId"
                  :graphql-query="ListStudyYearDropdownDocument"
                  :fields="{ text: 'value', value: 'id' }"
                  :data-testid="`study-year-selectfield-${index}`"
                />
              </UFormField>
            </TableCell>
            <TableCell>
              <UFormField
                :key="`student-addresses-${row.id}-type`"
                :name="`studentAddresses.${index}.type`"
              >
                <DropdownList
                  v-model="row.type"
                  :enabled="false"
                  :graphql-query="ListLocalizedAddressTypeDocument"
                  :fields="{ text: 'text', value: 'valueUpper' }"
                />
              </UFormField>
            </TableCell>
            <TableCell>
              <UFormField
                :key="`student-addresses-${row.id}-villageId`"
                :name="`studentAddresses.${index}.villageId`"
              >
                <DropdownList
                  v-model="row.villageId"
                  :graphql-query="ListVillageDropdownDocument"
                  :fields="{ text: 'addressName', value: 'id' }"
                  :data-testid="`village-selectfield-${index}`"
                />
              </UFormField>
            </TableCell>
            <TableCell class="text-center">
              <TrashButton
                :data-testid="`remove-student-address-${index}`"
                @click="store.removeStudentAddress(row.id)"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <template #footer>
        <div class="footer">
          <PlusButton
            data-testid="add-student-address"
            @click="store.addStudentAddress"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
