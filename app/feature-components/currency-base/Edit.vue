<script setup lang="ts">
const store = useCurrencyBaseStore()
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
      <div class="sm:col-span-full">
        <UFormField
          :key="`symbol-${store.item.id}`"
          name="currencyId"
          label="រូបិយប័ណ្ណគោល"
        >
          <DropdownList
            id="currencyId"
            v-model="store.item.currencyId"
            data-testid="currency-id"
            :graphql-query="ListCurrencyDocument"
            :fields="{ text: 'symbol', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField label="តម្លៃសិក្សា">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    រូបិយប័ណ្ណ
                  </TableHead>
                  <TableHead>
                    អត្រា
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.currencyRates"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`currencyId-${row.id}`"
                      :name="`currencyRates.${index}.currencyId`"
                    >
                      <DropdownList
                        :id="`currencyRates.${index}.currencyId`"
                        v-model="row.currencyId"
                        :data-testid="`currency-rates.currency-id-${index}`"
                        :graphql-query="ListCurrencyDocument"
                        :fields="{ text: 'symbol', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`rate-${row.id}`"
                      :name="`currencyRates.${index}.rate`"
                    >
                      <UInput
                        :id="`currencyRates.${index}.rate`"
                        v-model="row.rate"
                        type="number"
                        :data-testid="`currency-rates.rate-${index}`"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :disabled="store.item.currencyRates.length === 1"
                      :data-testid="`currency-rate-remove-row-${index}`"
                      @click="store.removeCurrencyRate(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-currency-rate-btn"
                  @click="store.addCurrencyRate"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
