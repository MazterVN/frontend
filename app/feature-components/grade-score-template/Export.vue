<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useGradeScoreTemplateStore()
const { isLoading } = useLoadingIndicator()
const emit = defineEmits(['export', 'error', 'close', 'init'])
function exportCommand(command: GradeScoreTemplateExportCommand) {
  emit('export', command)
}
emit('init')
withDefaults(defineProps<{
  gradeScoreTemplateId: string
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
            :enabled="!!gradeScoreTemplateId"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :predicate="predicateMemoize(new Predicate('subjectGrouping.gradeScoreTemplate.id', 'equal', gradeScoreTemplateId))"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
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
            :disabled="!store.exportParam.serviceDetailId"
            :loading="isLoading"
          >
            នាំចេញ
          </UButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-72 z-[1105]">
          <DropdownMenuGroup>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-list"
              @click="exportCommand('score-semester-list')"
            >
              <span>បញ្ជីសម្រង់ពិន្ទុ និងចំណាត់ថ្នាក់តាមមុខវិជ្ជា</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-list-summary"
              @click="exportCommand('score-semester-list-summary')"
            >
              <span>តារាងចំណាត់ថ្នាក់</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-list-summary-xlsx"
              @click="exportCommand('score-semester-list-summary-xlsx')"
            >
              <span>តារាងចំណាត់ថ្នាក់ (Excel)</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-certificate"
              @click="exportCommand('score-semester-certificate')"
            >
              <span>បណ្ណសរសើរ</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-certificate-formal"
              @click="exportCommand('score-semester-certificate-formal')"
            >
              <span>បណ្ណសរសើរផ្លូវការ</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-transcript"
              @click="exportCommand('score-semester-transcript')"
            >
              <span>ព្រឹត្តិបត្តិពិន្ទុ</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="export-score-semester-honor-list"
              @click="exportCommand('score-semester-honor-list')"
            >
              <span>តារាងកិត្តិយស</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </BaseModal>
</template>
