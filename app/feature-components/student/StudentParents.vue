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
            <TableHead>
              អាណាព្យាបាល
            </TableHead>
            <TableHead class="w-[40px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, index) in store.item.studentParents"
            :key="row.id"
          >
            <TableCell>
              <UFormField
                :key="`student-parents-${row.id}-parentId`"
                :name="`studentParents.${index}.parentId`"
              >
                <DropdownList
                  v-model="row.parentId"
                  :graphql-query="ListParentDropdownDocument"
                  :fields="{ text: 'nameCalc', value: 'id' }"
                  :data-testid="`student-parent-selectfield-${index}`"
                />
              </UFormField>
            </TableCell>
            <TableCell class="text-center">
              <TrashButton
                :data-testid="`remove-student-parent-${index}`"
                @click="store.removeStudentParent(row.id)"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <template #footer>
        <div class="footer">
          <PlusButton
            data-testid="add-student-parent"
            @click="store.addStudentParent"
          />
        </div>
      </template>
    </UCard>
  </UForm>
</template>
