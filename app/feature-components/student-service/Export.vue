<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const emit = defineEmits(['submit', 'error', 'close', 'init', 'export'])
const store = useStudentServiceStore()
const { isLoading } = useLoadingIndicator()
emit('init')

withDefaults(defineProps<{
  selectedCount?: number
}>(), {
  selectedCount: 0,
})
function exportCommand(command: StudentServiceExportCommand) {
  emit('export', command)
}
</script>

<template>
  <BaseModal
    title="នាំចេញ"
    @close="() => emit('close')"
  >
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6">
      <div class="sm:col-span-full">
        <UAlert
          color="warning"
          variant="soft"
          icon="heroicons:information-circle"
        >
          <template #title>
            <div>
              អ្នកអាចរំលង កញ្ចប់សេវាកម្ម និង សេវាកម្ម ប្រសិនបើអ្នកបានជ្រើសរើសសិស្សមួយនាក់ឬច្រើននាក់
            </div>
            <div v-if="store.exportParams.serviceDetailId">
              <UBadge
                color="primary"
                variant="soft"
              >
                អ្នកនឹងនាំចេញសម្រាប់សេវាកម្មដែលបានជ្រើសរើស
              </UBadge>
            </div>
            <div v-else-if="!store.exportParams.serviceDetailId && selectedCount">
              <UBadge
                color="primary"
                variant="soft"
              >
                អ្នកនឹងត្រូវនាំចេញសម្រាប់សិស្សដែលបានជ្រើសរើស
              </UBadge>
            </div>
          </template>
        </UAlert>
      </div>
      <div class="sm:col-span-full">
        <UBadge
          color="primary"
          variant="subtle"
        >
          នាំចេញសិស្ស {{ selectedCount }} នាក់ដែលបានជ្រើសរើស
        </UBadge>
      </div>

      <div class="sm:col-span-3">
        <UFormField label="ឆ្នាំសិក្សា*">
          <DropdownList
            id="study-year-id"
            v-model="store.exportParams.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @change="interactedChanged($event, () => {
              store.exportParams.serviceId = ''
              store.exportParams.serviceDetailId = ''
            })"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.exportParams.studyYearId"
          label="កញ្ចប់សេវាកម្ម"
        >
          <DropdownList
            id="service-id"
            v-model="store.exportParams.serviceId"
            data-testid="service-id"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.exportParams.studyYearId ?? null))"
            :enabled="!!store.exportParams.studyYearId"
            :graphql-query="ListServiceDropdownDocument"
            :fields="{ text: 'name', value: 'id' }"
            @change="interactedChanged($event, () => store.exportParams.serviceDetailId = '')"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.exportParams.serviceId"
          label="សេវាកម្ម"
        >
          <DropdownList
            id="service-detail-id"
            v-model="store.exportParams.serviceDetailId"
            data-testid="service-detail-id"
            :predicate="predicateMemoize(new Predicate('serviceId', 'equal', store.exportParams.serviceId ?? null))"
            :enabled="!!store.exportParams.serviceId"
            :graphql-query="ListServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'id' }"
          />
        </UFormField>
      </div>
    </div>
    <template #footer>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <UButton
            icon="lets-icons:export-duotone"
            data-testid="export-button"
            :disabled="store.disabledExport"
            :loading="isLoading"
          >
            Export
          </UButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 z-[1105]">
          <DropdownMenuGroup>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="new-student-list"
              @click="exportCommand('new-student-list')"
            >
              <span>បញ្ជីសិស្ស</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="bio-check-list"
              @click="exportCommand('bio-check-list')"
            >
              <span>ផ្ទៀងផ្ទាត់ព័ត៌មានសិស្ស</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="certificate-of-education"
              @click="exportCommand('certificate-of-education')"
            >
              <span>វិញ្ញាបនបត្របញ្ជាក់ការសិក្សា</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="student-profile"
              @click="exportCommand('student-profile')"
            >
              <span>ទាញយករូបថតសិស្ស</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </BaseModal>
</template>
