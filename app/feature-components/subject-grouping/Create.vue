<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useSubjectGroupingStore()
const { subjectGroupingDetailRef } = storeToRefs(store)
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')

emit('init')
const sourceSubjectGroupingDetailRef = ref<HTMLElement | null>(null)
const sync = syncRefs(sourceSubjectGroupingDetailRef, subjectGroupingDetailRef)
onUnmounted(() => {
  sync.stop()
})
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
          name="studyYearId"
          label="ឆ្នាំសិក្សា"
        >
          <DropdownList
            id="studyYearId"
            v-model="store.item.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @change="interactedChanged($event, (event) => store.studyYearChanged(event))"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-4">
        <UFormField
          name="gpaConditionId"
          label="GPA Condition"
        >
          <DropdownList
            id="gpaConditionId"
            v-model="store.item.gpaConditionId"
            data-testid="gpa-condition-id"
            :graphql-query="ListGpaConditionDropdownDocument"
            :fields="{ text: 'name', value: 'id' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-4">
        <UFormField
          name="gpa"
          label="GPA"
        >
          <UInput
            v-model="store.item.gpa"
            data-testid="gpa"
            type="number"
            min="0"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField
          name="note"
          label="ចំណាំ"
        >
          <UTextarea
            v-model="store.item.note"
            data-testid="note"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="សេវាកម្ម">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[250px]">
                    សេវាកម្ម
                  </TableHead>
                  <TableHead class="w-[250px]">
                    សេវាកម្ម
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.subjectGroupingServiceDetails"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`${row.id}-${store.item.studyYearId}-serviceDetail-serviceId`"
                      :name="`subjectGroupingServiceDetails.${index}.serviceDetail.serviceId`"
                    >
                      <DropdownList
                        :id="`subjectGroupingServiceDetails-${index}-serviceDetail-serviceId`"
                        v-model="row.serviceDetail.serviceId"
                        :data-testid="`service-detail-service-id-${index}`"
                        :graphql-query="ListServiceDropdownDocument"
                        :enabled="!!store.item.studyYearId"
                        :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.item.studyYearId))"
                        :fields="{ text: 'name', value: 'id' }"
                        @change="interactedChanged($event, () => row.serviceDetailId = '')"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`${row.id}-${row.serviceDetail.serviceId}-serviceDetailId`"
                      :name="`subjectGroupingServiceDetails.${index}.serviceDetailId`"
                    >
                      <DropdownList
                        :id="`subjectGroupingServiceDetails-${index}-serviceDetailId`"
                        v-model="row.serviceDetailId"
                        :data-testid="`service-detail-id-${index}`"
                        :enabled="!!row.serviceDetail.serviceId"
                        :predicate="predicateMemoize(new Predicate('serviceId', 'equal', row.serviceDetail.serviceId ?? ''))"
                        :graphql-query="ListServiceDetailDropdownDocument"
                        :fields="{ text: 'serviceNameCalc', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-service-detail-${index}`"
                      @click="store.removeServiceDetail(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
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
        <UFormField label="មុខវិជ្ជា">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[20px]" />
                  <TableHead class="w-[250px]">
                    មុខវិជ្ជា
                  </TableHead>
                  <TableHead class="w-[250px]">
                    ប្រភេទពិន្ទុ
                  </TableHead>
                  <TableHead class="w-[150px]">
                    ពិន្ទុអតិបរមា
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody ref="sourceSubjectGroupingDetailRef">
                <TableRow
                  v-for="(row, index) in store.item.subjectGroupingDetails"
                  :key="row.id"
                >
                  <TableCell class="handle cursor-pointer">
                    <UFormField
                      :name="`subjectGroupingDetails.${index}.sortOrder`"
                    >
                      <i class="icon-[material-symbols--drag-indicator] w-3 h-3" />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`subjectGroupingDetails.${index}.subjectId`"
                    >
                      <DropdownList
                        :id="`subjectGroupingDetails-${index}-subjectId`"
                        v-model="row.subjectId"
                        :data-testid="`subject-id-${index}`"
                        :graphql-query="ListSubjectDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`subjectGroupingDetails.${index}.scoreTypeId`"
                    >
                      <DropdownList
                        :id="`subjectGroupingDetails-${index}-scoreTypeId`"
                        v-model="row.scoreTypeId"
                        :data-testid="`score-type-id-${index}`"
                        :graphql-query="ListScoreTypeDropdownDocument"
                        :fields="{ text: 'value', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`subjectGroupingDetails.${index}.maxScore`"
                    >
                      <UInput
                        v-model="row.maxScore"
                        :data-testid="`max-score-${index}`"
                        type="number"
                        min="0"
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
                  data-testid="add-detail-btn"
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
