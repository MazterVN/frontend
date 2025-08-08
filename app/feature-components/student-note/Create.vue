<script setup lang="ts">
const store = useStudentNoteStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')

emit('init')
</script>

<template>
  <BaseModal
    title="បន្ថែម"
    :is-ready="store.isReady"
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
      <div class="sm:col-span-9">
        <UFormField
          name="title"
          label="ឈ្មោះកំណត់ហេតុ"
        >
          <UInput
            v-model="store.item.title"
            data-testid="title"
          />
        </UFormField>
      </div>

      <div
        data-testid="date-time"
        class="sm:col-span-3"
      >
        <UFormField
          name="noteAt"
          label="កាលបរិច្ឆេទ"
        >
          <ElDatePickerExtended
            id="date-time"
            v-model="store.item.noteAt"
            type="datetime"
            format="ddd, DD/MM/YYYY hh:mm A"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField
          name="note"
          label="កំណត់ហេតុ"
        >
          <CherryMD
            :key="store.item.id"
            v-model="store.item.note"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="ឯកសារ">
          <UCard
            class="w-full"
            :ui="{
              body: '',
              footer: '!px-2 py-1',
              header: '!px-2 py-1',
            }"
          >
            <Table class="table-fixed">
              <TableHeader
                class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0"
              >
                <TableRow>
                  <TableHead> ឯកសារ </TableHead>
                  <TableHead class="w-[400px]">
                    ប្រភេទ
                  </TableHead>
                  <TableHead class="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody
                class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0"
              >
                <TableRow
                  v-for="(attachment, index) in store.item.attachments"
                  :key="attachment.id"
                >
                  <TableCell>
                    <UButton
                      class="w-full"
                      variant="ghost"
                      size="sm"
                      color="neutral"
                      :data-testid="`attachment-key-btn-${index}`"
                      @click="store.attachFile(attachment.id)"
                    >
                      <i
                        v-if="!attachment.key"
                        class="icon-[heroicons--paper-clip]"
                      />
                      <div
                        v-else
                        class="text-right truncate"
                        dir="rtl"
                      >
                        {{ getFileNameFromS3URI(attachment.key) || "......" }}
                      </div>
                    </UButton>
                  </TableCell>
                  <TableCell>
                    <DropdownList
                      v-model="attachment.type"
                      :data-testid="`attachment-type-${index}`"
                      :graphql-query="AttachmentTypeTypeDocument"
                      :fields="{ text: 'text', value: 'valueUpper' }"
                    />
                  </TableCell>
                  <TableCell>
                    <TrashButton
                      :data-testid="`remove-attachment-btn-${index}`"
                      @click="store.removeAttachment(attachment.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="flex justify-end">
                <PlusButton
                  data-testid="add-attachment-btn"
                  @click="store.addAttachment"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField label="សិស្ស">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[250px]">
                    សិស្ស
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.studentNoteStudentServices"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`studentNoteStudentServices-${row.id}-studentServiceId`"
                      :name="`studentNoteStudentServices.${index}.studentServiceId`"
                    >
                      <DropdownList
                        :id="`studentNoteStudentServices-${index}-studentServiceId`"
                        v-model="row.studentServiceId"
                        :data-testid="`student-service-id-${index}`"
                        :graphql-query="ListStudentServiceDropdownDocument"
                        :fields="{ text: 'withStudentCalc', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-student-service-{index}`"
                      @click="store.removeStudentService(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-student-service-btn"
                  @click="store.addStudentService"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="អាណាព្យាបាល">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[250px]">
                    អាណាព្យាបាល
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.studentNoteStudentParents"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`studentNoteStudentParents-${row.id}-studentParentId`"
                      :name="`studentNoteStudentParents.${index}.studentParentId`"
                    >
                      <DropdownList
                        :id="`studentNoteStudentParents-${index}-studentParentId`"
                        v-model="row.studentParentId"
                        :data-testid="`student-parent-id-${index}`"
                        :graphql-query="ListStudentParentDropdownDocument"
                        :fields="{ text: 'parent.nameLocalized', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell class="text-center">
                    <TrashButton
                      :data-test="`remove-student-parent-${index}`"
                      @click="store.removeStudentParent(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-student-parent-btn"
                  @click="store.addStudentParent"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="បុគ្គលិក">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[250px]">
                    បុគ្គលិក
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.studentNoteEmployees"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`studentNoteEmployees-${row.id}-employeeId`"
                      :name="`studentNoteEmployees.${index}.employeeId`"
                    >
                      <DropdownList
                        :id="`studentNoteEmployees-${index}-employeeId`"
                        v-model="row.employeeId"
                        :data-testid="`student-note-employee-${index}`"
                        :graphql-query="ListEmployeeDropdownDocument"
                        :fields="{ text: 'employeeCalc', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-employee-${index}`"
                      @click="store.removeEmployee(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-employee-btn"
                  @click="store.addEmployee"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
