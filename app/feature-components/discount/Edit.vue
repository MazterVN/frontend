<script setup lang="ts">
const store = useDiscountStore()
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
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div class="sm:col-span-3">
        <UFormField
          :key="`expiresAt-${store.item.id}`"
          name="expiresAt"
          label="ថ្ងៃខែឆ្នាំចាប់ផ្តើម ដល់ ថ្ងៃខែឆ្នាំបញ្ចប់"
        >
          <ElDatePickerExtended
            v-model:start-at="store.item.startsAt"
            v-model:end-at="store.item.expiresAt"
            data-testid="date-range-picker-field"
            type="daterange"
            format="ddd, DD/MM/YYYY"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="value"
          label="តម្លៃ"
        >
          <UInput
            :model-value="store.item.value ?? 0"
            type="number"
            data-testid="value-input-field"
            @update:model-value="store.item.value = $event as number"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField
          name="description"
          label="ពិពណ៌នា"
        >
          <UTextarea
            data-testid="description-input-field"
            resize
            :value="store.item.description"
            @input="store.item.description = $event.target.value"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField>
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    សិស្ស និងសេវាកម្ម
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.studentServiceDiscounts"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`studentServiceId-${row.id}`"
                      :name="`studentServiceDiscounts.${index}.studentServiceId`"
                    >
                      <DropdownList
                        :id="`studentServiceDiscounts.${index}.studentServiceId`"
                        v-model="row.studentServiceId"
                        :data-testid="`student-service-discounts.${index}.student-service-id`"
                        :graphql-query="ListStudentServiceDropdownDocument"
                        :fields="{ text: 'withStudentCalc', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :disabled="store.item.studentServiceDiscounts.length === 1"
                      :data-testid="`student-service-discount-remove-row-${index}`"
                      @click="store.removeStudentServiceDiscount(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-student-service-discount-btn"
                  @click="store.addStudentServiceDiscount"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
