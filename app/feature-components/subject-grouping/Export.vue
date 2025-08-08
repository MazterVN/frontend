<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useSubjectGroupingStore()
const { isLoading } = useLoadingIndicator()
const emit = defineEmits(['export', 'error', 'close', 'init'])
function exportCommand(command: SubjectGroupingExportCommand) {
  emit('export', command)
}
emit('init')
withDefaults(defineProps<{
  subjectGroupingId: string
}>(), {})
</script>

<template>
  <BaseModal
    title="នាំចេញ"
    @close="() => emit('close')"
  >
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12">
      <div class="sm:col-span-full">
        <UFormField
          name="serviceDetailId"
          label="សេវាកម្ម"
        >
          <DropdownList
            id="serviceDetailId"
            v-model="store.exportParam.serviceDetailId"
            data-testid="service-detail-id"
            :enabled="!!subjectGroupingId"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', subjectGroupingId))"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="monthsOfYearId"
          label="ខែ"
        >
          <DropdownList
            id="monthsOfYearId"
            v-model="store.exportParam.monthsOfYearId"
            data-testid="months-of-year-id"
            :graphql-query="ListMonthsOfYearDropdownDocument"
            :enabled="!!store.exportParam.serviceDetailId"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
      </div>
    </div>
    <template #footer>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <UButton
            icon="lets-icons:export-duotone"
            data-testid="export-btn"
            :disabled="!store.exportParam.serviceDetailId || !store.exportParam.monthsOfYearId"
            :loading="isLoading"
          >
            នាំចេញ
          </UButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 z-[1105]">
          <DropdownMenuGroup>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-certificate"
              @click="exportCommand('score-monthly-certificate')"
            >
              <span>បណ្ណសរសើរ</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-transcript"
              @click="exportCommand('score-monthly-transcript')"
            >
              <span>ព្រឹត្តិបត្តិពិន្ទុ</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-ranking-table"
              @click="exportCommand('score-monthly-ranking-table')"
            >
              <span>តារាងចំណាត់ថ្នាក់</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-ranking-table-excel"
              @click="exportCommand('score-monthly-ranking-table-excel')"
            >
              <span>តារាងចំណាត់ថ្នាក់ (Excel)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-check-list"
              @click="exportCommand('score-monthly-check-list')"
            >
              <span>បញ្ជីផ្ទៀងផ្ទាត់ពិន្ទុសិស្ស</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-check-list-template"
              @click="exportCommand('score-monthly-check-list-template')"
            >
              <span>គំរូបំពេញពិន្ទុសិស្ស</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-monthly-honor-list"
              @click="exportCommand('score-monthly-honor-list')"
            >
              <span>តារាងកិត្ដិយស</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </BaseModal>
</template>
