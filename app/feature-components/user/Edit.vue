<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useUserStore()
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
          name="active"
          label="Active?"
        >
          <UCheckbox
            v-model="store.item.active"
            data-testid="active-checkbox"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="superUser"
          label="Super user?"
        >
          <UCheckbox
            v-model="store.item.superUser"
            data-testid="super-user-checkbox"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="fullName"
          label="នាមខ្លួន"
        >
          <UInput
            :model-value="store.item.fullName || ''"
            data-testid="first-name-input-field"
            @input="store.item.fullName = $event.target.value"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`employeeId-${store.item.id}`"
          name="employeeId"
          label="បុគ្គលិក"
        >
          <DropdownList
            id="employee-id"
            v-model="store.item.employeeId"
            data-testid="employee-id-select-field"
            :graphql-query="ListEmployeeDropdownDocument"
            :fields="{ text: 'employeeCalc', value: 'id' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-3">
        <UFormField
          :key="`studentId-${store.item.id}`"
          name="studentId"
          label="សិស្ស"
        >
          <DropdownList
            id="student-id"
            v-model="store.item.studentId"
            data-testid="student-id-select-field"
            :graphql-query="ListStudentDropdownDocument"
            :fields="{ text: 'nameCalc', value: 'id' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-3">
        <UFormField
          :key="`bucket-${store.item.id}`"
          name="bucket"
          label="Storage"
        >
          <DropdownList
            id="bucket"
            v-model="store.item.bucket"
            data-testid="bucket-select-field"
            :graphql-query="ListLocalizedS3BucketTypeDocument"
            :fields="{ text: 'text', value: 'text' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-3">
        <UFormField
          :key="`bucketFolder-${store.item.id}-${store.item.bucket}`"
          name="bucketFolder"
          label="Storage Folder"
        >
          <DropdownList
            id="bucket-folder"
            v-model="store.item.bucketFolder"
            data-testid="bucket-folder-select-field"
            :predicate="predicateMemoize(new Predicate('namespace', 'equal', toSnakeCase(store.item.bucket)))"
            :enabled="!!store.item.bucket"
            :graphql-query="ListLocalizedTypeDocument"
            :fields="{ text: 'text', value: 'text' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="សិទ្ធប្រើប្រាស់">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    សិទ្ធ
                  </TableHead>
                  <TableHead>
                    Is Default?
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.userRoles"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`userRoles.${index}.roleId`"
                      :name="`userRoles.${index}.roleId`"
                    >
                      <DropdownList
                        :id="`userRoles.${index}.roleId`"
                        v-model="row.roleId"
                        :data-testid="`user-roles.${index}.role-id`"
                        :graphql-query="ListRoleDropdownDocument"
                        :fields="{ text: 'name', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`userRoles.${index}.isDefault`">
                      <UCheckbox
                        v-model="row.isDefault"
                        :data-testid="`user-roles.${index}.is-default`"
                        @input="store.defaultRoleChanged($event, row.id)"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :disabled="store.item.userRoles.length === 1"
                      :data-testid="`user-role-remove-row-${index}`"
                      @click="store.removeUserRole(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-user-role-btn"
                  @click="store.addUserRole"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
