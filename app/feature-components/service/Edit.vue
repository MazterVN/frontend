<script setup lang="ts">
const store = useServiceStore()
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
          name="name"
          label="ឈ្មោះ"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name-input-field"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`endsAt-${store.item.id}`"
          name="endsAt"
          label="ថ្ងៃខែឆ្នាំចាប់ផ្តើម ដល់ ថ្ងៃខែឆ្នាំបញ្ចប់"
        >
          <ElDatePickerExtended
            v-model:start-at="store.item.beginsAt"
            v-model:end-at="store.item.endsAt"
            data-testid="date-range-picker-field"
            type="daterange"
            format="ddd, DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-3">
        <UFormField
          :key="`studyYearId-${store.item.id}`"
          name="studyYearId"
          label="ឆ្នាំសិក្សា"
        >
          <DropdownList
            id="study-year-id"
            v-model="store.item.studyYearId"
            data-testid="study-year-id-select-field"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`type-${store.item.id}`"
          name="type"
          label="ប្រភេទសេវាកម្ម"
        >
          <DropdownList
            id="type"
            v-model="store.item.type"
            data-testid="type-select-field"
            :graphql-query="ListLocalizedServiceTypesDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
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
        <UFormField label="សេវាកម្ម">
          <UCard
            class="w-full"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed card-table">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[175px]">
                    ឈ្មោះសេវាកម្ម
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.serviceDetails"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`serviceNameId-${row.id}`"
                      :name="`serviceDetails.${index}.serviceNameId`"
                    >
                      <DropdownList
                        :id="`serviceDetails.${index}.serviceNameId`"
                        v-model="row.serviceNameId"
                        :data-testid="`service-detail.service-name-${index}`"
                        :graphql-query="ListServiceNameSettingDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :disabled="store.item.serviceDetails.length === 1"
                      :data-testid="`remove-service-detail-${index}`"
                      @click="store.removeServiceDetail(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="flex flex-wrap justify-end items-center">
                <PlusButton
                  data-testid="add-service-detail-btn"
                  @click="store.addServiceDetail"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField label="តម្លៃសិក្សា">
          <UCard
            class="w-full"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed card-table">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    ចំនួនធ្វើឡើងវិញ
                  </TableHead>
                  <TableHead>
                    តម្លៃ($)
                  </TableHead>
                  <TableHead>
                    បញ្ចុះតម្លៃ(%)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.serviceFees"
                  :key="row.id"
                >
                  <TableCell>
                    <span :data-testid="`service-fees.month-repeat-${index}`">
                      {{ row.monthRepeat }} ខែ
                    </span>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`price-${row.id}`"
                      :name="`serviceFees.${index}.price`"
                    >
                      <UInput
                        :id="`serviceFees.${index}.price`"
                        v-model="row.price"
                        type="number"
                        :data-testid="`service-fees.price-${index}`"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`fixedDiscount-${row.id}`"
                      :name="`serviceFees.${index}.fixedDiscount`"
                    >
                      <UInput
                        :id="`serviceFees.${index}.fixedDiscount`"
                        v-model="row.fixedDiscount"
                        type="number"
                        :data-testid="`service-fees.fixed-discount-${index}`"
                      />
                    </UFormField>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
