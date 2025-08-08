<script setup lang="ts">
const store = useGpaConditionStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')

emit('init')
</script>

<template>
  <BaseModal
    title="កែប្រែ"
    submit-title="រក្សាទុក"
    @close="() => emit('close')"
    @submit="() => formRef?.submit()"
  >
    <UForm
      ref="formRef"
      :schema="store.validationSchema"
      :state="store.item"
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div class="sm:col-span-8">
        <UFormField
          name="name"
          label="ឈ្មោះ"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-4">
        <UFormField
          name="passedGpa"
          label="GPA ជាប់"
        >
          <UInput
            v-model="store.item.passedGpa"
            data-testid="passed-gpa"
            type="number"
            step="0.01"
            min="0"
            max="4"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField
          name="description"
          label="ការពិពណ៌នា"
        >
          <UTextarea
            v-model="store.item.description"
            data-testid="description"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="លម្អិត">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[100px]">
                    សញ្ញាចាប់ផ្តើម
                  </TableHead>
                  <TableHead class="w-[150px]">
                    តម្លៃចាប់ផ្តើម
                  </TableHead>
                  <TableHead class="w-[100px]">
                    សញ្ញាបញ្ចប់
                  </TableHead>
                  <TableHead class="w-[150px]">
                    តម្លៃបញ្ចប់
                  </TableHead>
                  <TableHead class="w-[250px]">
                    កំណត់និទ្ទេស
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.gpaConditionDetails"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :name="`gpaConditionDetails.${index}.startCondOp`"
                    >
                      <USelect
                        v-model="row.startCondOp"
                        :data-testid="`start-cond-op-${index}`"
                        :items="store.condOpOptions"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`gpaConditionDetails.${index}.startCondValue`"
                    >
                      <UInput
                        v-model="row.startCondValue"
                        :data-testid="`start-cond-value-${index}`"
                        type="number"
                        min="0"
                        max="100"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell>
                    <UFormField
                      :name="`gpaConditionDetails.${index}.endCondOp`"
                    >
                      <USelect
                        v-model="row.endCondOp"
                        :data-testid="`end-cond-op-${index}`"
                        :items="store.condOpOptions"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`gpaConditionDetails.${index}.endCondValue`"
                    >
                      <UInput
                        v-model="row.endCondValue"
                        :data-testid="`end-cond-value-${index}`"
                        type="number"
                        min="0"
                        max="100"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`gpaConditionDetails-${row.id}-gradeLevelId`"
                      :name="`gpaConditionDetails.${index}.gradeLevelId`"
                    >
                      <DropdownList
                        :id="`gpaConditionDetails-${index}-gradeLevelId`"
                        v-model="row.gradeLevelId"
                        :data-testid="`grade-level-id-${index}`"
                        :graphql-query="ListGradeLevelDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-btn-${index}`"
                      @click="store.removeDetail(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-relative-btn"
                  @click="store.addDetail"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
