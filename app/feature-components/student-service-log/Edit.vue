<script setup lang="ts">
import {
  ServiceLogType,
} from '#gql/default'

const store = useStudentServiceLogStore()
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
      <div
        data-testid="date-input"
        class="sm:col-span-3"
      >
        <UFormField
          name="date"
          label="ថ្ងៃខែឆ្នាំ"
        >
          <ElDatePickerExtended
            id="date-input"
            v-model="store.item.date"
            type="date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="type"
          label="ប្រភេទ"
        >
          <DropdownList
            v-model="store.item.type"
            data-testid="type-select"
            :graphql-query="ListLocalizedServiceLogTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          label="ហេតុផល"
        >
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.reasons"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      v-if="store.item.type == ServiceLogType.REGISTER"
                      :key="`reasons.${row.id}.registerReasonId`"
                      :name="`reasons.${index}.registerReasonId`"
                    >
                      <DropdownList
                        v-model="row.registerReasonId"
                        :data-testid="`register-reason-id-${index}`"
                        :graphql-query="ListRegisterReasonDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                    <UFormField
                      v-else
                      :key="`reasons.${row.id}.dropReasonId`"
                      :name="`reasons.${index}.dropReasonId`"
                    >
                      <DropdownList
                        v-model="row.dropReasonId"
                        :data-testid="`drop-reason-id-${index}`"
                        :graphql-query="ListDropReasonDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-reason-${index}`"
                      :disabled="store.item.reasons.length === 1"
                      @click="store.removeReason(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton @click="store.addReason" />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
