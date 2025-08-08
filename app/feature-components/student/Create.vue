<script setup lang="ts">
const store = useStudentStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')

emit('init')
</script>

<template>
  <BaseModal
    title="បន្ថែម"
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
      <div class="sm:col-span-4">
        <UFormField
          name="bookId"
          label="អត្តលេខ"
        >
          <UInput
            v-model="store.item.bookId"
            data-testid="bookId"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-4">
        <UFormField
          name="name"
          label="គោត្តនាម-នាម"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-4">
        <UFormField
          name="latin"
          label="គោត្តនាម-ឡាតាំង"
        >
          <UInput
            :model-value="store.item.latin ?? ''"
            data-testid="latin"
            @update:model-value="store.item.latin = $event as string"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-4">
        <UFormField
          name="gender"
          label="ភេទ"
        >
          <DropdownList
            id="gender"
            v-model="store.item.gender"
            :graphql-query="ListLocalizedGenderTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
            data-testid="gender"
          />
        </UFormField>
      </div>

      <div
        class="sm:col-span-4"
        data-testid="dob"
      >
        <UFormField
          name="dob"
          label="ថ្ងៃខែឆ្នាំកំណើត"
        >
          <el-date-picker
            v-model="store.item.dob"
            class="!w-full"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-4">
        <UFormField
          name="tel"
          label="លេខទូរស័ព្ទ"
        >
          <UInput
            :model-value="store.item.tel ?? ''"
            data-testid="tel"
            @update:model-value="store.item.tel = $event as string"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField label="ទំនាក់ទំនង">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    ប្រភេទ
                  </TableHead>
                  <TableHead />
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.contacts"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`contacts-${row.id}-type`"
                      :name="`contacts.${index}.type`"
                    >
                      <DropdownList
                        :id="`contacts-${index}-type`"
                        v-model="row.type"
                        :graphql-query="ListLocalizedContactTypeDocument"
                        :fields="{ text: 'text', value: 'valueUpper' }"
                        :data-testid="`contacts-${index}-type`"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`contacts-${row.id}-value`"
                      :name="`contacts.${index}.value`"
                    >
                      <UInput
                        v-model="row.value"
                        :data-testid="`contacts.${index}.value`"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-contact-btn-${index}`"
                      @click="store.removeContact(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-contact-btn"
                  @click="store.addContact"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField label="សាច់ញ្ញាត្តិ">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    សិស្ស
                  </TableHead>
                  <TableHead>
                    ត្រូវជា
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.studentRelatives"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`studentRelatives-${row.id}-relatedStudentId`"
                      :name="`studentRelatives.${index}.relatedStudentId`"
                    >
                      <DropdownList
                        :id="`studentRelatives-${index}-relatedStudentId`"
                        v-model="row.relatedStudentId"
                        :graphql-query="ListStudentDropdownDocument"
                        :fields="{ text: 'nameCalc', value: 'id' }"
                        :data-testid="`studentRelatives-${index}-relatedStudentId`"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`studentRelatives-${row.id}-relativeId`"
                      :name="`studentRelatives.${index}.relativeId`"
                    >
                      <DropdownList
                        :id="`studentRelatives-${index}-relativeId`"
                        v-model="row.relativeId"
                        :graphql-query="ListRelativeDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                        :data-testid="`studentRelatives-${index}-relativeId`"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-relative-btn-${index}`"
                      @click="store.removeRelative(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-relative-btn"
                  @click="store.addRelative"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
