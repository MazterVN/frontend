<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const { isLoading } = useLoadingIndicator()
const emit = defineEmits(['export', 'error', 'close', 'init', 'export'])
const store = useStudentStore()
emit('init')

withDefaults(defineProps<{
  selectedCount?: number
}>(), {
  selectedCount: 0,
})
function exportCommand(command: StudentExportCommand) {
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
            នាំចេញ
          </UButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 z-[1105]">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                class="cursor-pointer"
                data-testid="student-card"
              >
                <span>កាតសិស្ស</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent class="z-[1105]">
                  <DropdownMenuItem
                    class="cursor-pointer"
                    data-testid="student-card-66x97"
                    @click="exportCommand('student-card-66x97')"
                  >
                    <span>66x97mm</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    class="cursor-pointer"
                    data-testid="student-card-54x85"
                    @click="exportCommand('student-card-54x85')"
                  >
                    <span>54x85mm</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              class="cursor-pointer"
              data-testid="new-student-info"
              @click="exportCommand('new-student-info')"
            >
              <span>សាលាកបត្រ</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </BaseModal>
</template>
