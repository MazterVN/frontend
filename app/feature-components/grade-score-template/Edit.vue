<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useGradeScoreTemplateStore()
const { gradeScoreTemplateDetailRef } = storeToRefs(store)
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')

const sourceGradeScoreTemplateDetailRef = ref<HTMLElement | null>(null)
const sync = syncRefs(sourceGradeScoreTemplateDetailRef, gradeScoreTemplateDetailRef)
onUnmounted(() => {
  sync.stop()
})
emit('init')
</script>

<template>
  <BaseModal
    title="កែប្រែ"
    submit-title="រក្សាទុក"
    :is-ready="store.isReady"
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
      <div class="sm:col-span-6">
        <UFormField
          name="name"
          label="ឈ្មោះខ្មែរ"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-6">
        <UFormField
          name="nameEn"
          label="ឈ្មោះអង់គ្លេស"
        >
          <UInput
            v-model="store.item.nameEn"
            data-testid="name-en"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-12">
        <UFormField
          name="note"
          label="សំគាល់"
        >
          <UTextarea
            :model-value="store.item.note ?? ''"
            data-testid="note"
            @update:model-value="(value) => store.item.note = value as string"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-6">
        <UFormField
          name="subjectGrouping.studyYearId"
          label="ឆ្នាំសិក្សា"
        >
          <DropdownList
            id="subjectGrouping-studyYearId"
            v-model="store.item.subjectGrouping.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @change="interactedChanged($event, () => store.item.subjectGroupingId = '')"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-6">
        <UFormField
          :key="`subjectGroupingId-${store.item.subjectGrouping.studyYearId}`"
          name="subjectGroupingId"
          label="ក្រុមមុខវិជ្ជា"
        >
          <DropdownList
            id="subjectGroupingId"
            v-model="store.item.subjectGroupingId"
            data-testid="subject-grouping-id"
            :graphql-query="ListSubjectGroupingDropdownDocument"
            :fields="{ text: 'nameCalc', value: 'id' }"
            :enabled="!!store.item.subjectGrouping.studyYearId"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.item.subjectGrouping.studyYearId))"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="លម្អិត">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[30px]" />
                  <TableHead>
                    ខែ
                  </TableHead>
                  <TableHead class="w-[200px]">
                    ប្រភេទ
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody ref="sourceGradeScoreTemplateDetailRef">
                <TableRow
                  v-for="(row, index) in store.item.gradeScoreTemplateDetails"
                  :key="row.id"
                >
                  <TableCell class="handle cursor-pointer">
                    <UFormField
                      :name="`gradeScoreTemplateDetails.${index}.sortOrder`"
                    >
                      <i class="icon-[material-symbols--drag-indicator] w-3 h-3" />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`gradeScoreTemplateDetails-${row.id}-monthsOfYearId`"
                      :name="`gradeScoreTemplateDetails.${index}.monthsOfYearId`"
                    >
                      <DropdownList
                        :id="`gradeScoreTemplateDetails-${index}-monthsOfYearId`"
                        v-model="row.monthsOfYearId"
                        :data-testid="`months-of-year-id-${index}`"
                        :graphql-query="ListMonthsOfYearDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell>
                    <UFormField
                      :key="`gradeScoreTemplateDetails-${row.id}-type`"
                      :name="`gradeScoreTemplateDetails.${index}.type`"
                    >
                      <DropdownList
                        :id="`gradeScoreTemplateDetails-${index}-type`"
                        v-model="row.type"
                        :data-testid="`type-${index}`"
                        :graphql-query="ListExamTypeDocument"
                        :fields="{ text: 'text', value: 'valueUpper' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-detail-${index}`"
                      @click="store.removeDetail(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-relative-btn"
                  @click="store.addDetail"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
