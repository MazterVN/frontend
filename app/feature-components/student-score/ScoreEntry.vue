<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useStudentScoreStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
emit('init')
withDefaults(defineProps<{
  subjectGroupingId: string
}>(), {})
</script>

<template>
  <BaseModal
    title="ពិន្ទុ"
    submit-title="រក្សាទុក"
    :no-footer="true"
    @close="() => emit('close')"
  >
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6">
      <div class="sm:col-span-1">
        <UFormField label="ថ្នាក់/សេវាកម្ម">
          <DropdownList
            id="serviceDetailId"
            v-model="store.filterParam.serviceDetailId"
            data-testid="service-detail-id"
            :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
            :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', subjectGroupingId))"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-4">
        <UFormField label="មុខវិជ្ជា">
          <MultiDropdownList
            id="subjectGroupingDetailId"
            v-model="store.filterParam.subjectGroupingDetailIds"
            data-testid="subject-grouping-detail-id"
            :enabled="!!store.filterParam.serviceDetailId"
            :graphql-query="ListSubjectGroupingDetailDropdownDocument"
            :fields="{ text: 'fullSubjectCalc', value: 'id' }"
            :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', subjectGroupingId))"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-1">
        <UFormField label="ខែ">
          <DropdownList
            id="monthOfYearId"
            v-model="store.filterParam.monthOfYearId"
            data-testid="months-of-year-id"
            :enabled="!!store.filterParam.subjectGroupingDetailIds.length"
            :graphql-query="ListMonthsOfYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <EjsGrid
          id="scoreGrid"
          v-bind="objectMemoize(store.scoreGridConfig())"
          :ref="store.setScoreGrid"
          :data-source="store.studentServices"
          :toolbar="toolbarMemoize(
            [
              'Update', 'Cancel',
              {
                text: 'Refresh',
                prefixIcon: 'icon-[heroicons--arrow-path-20-solid] !w-4 !h-4',
                disabled: store.studentServices.length === 0 || store.isLoading,
                id: 'refresh',
                click: async () => {
                  await store.refreshScoreGrid()
                },
              },
              'Search',
            ],

          )"
        >
          <EColumns>
            <EColumn
              field="id"
              header-text="#"
              :is-primary-key="true"
              text-align="Center"
              width="35"
              :template="'index'"
              :allow-searching="false"
              :is-frozen="true"
              :allow-editing="false"
            >
              <template #index="{ data }">
                {{ +data.index + 1 }}
              </template>
            </EColumn>
            <EColumn
              field="student.latin"
              header-text=""
              text-align="Left"
              width="80"
              :template="'profile'"
              :is-frozen="true"
              :allow-editing="false"
            >
              <template #profile="{ data }">
                <NuxtImg
                  provider="cloudfront"
                  placeholder
                  class="w-[70px] h-[70px]"
                  :src="data?.student?.s3ProfileUri ?? S3_URI_IMAGE_PLACEHOLDER"
                  :modifiers="{
                    edits: {
                      resize: { width: 200, height: 200, fit: 'cover' },
                    },
                  }"
                />
              </template>
            </EColumn>
            <EColumn
              field="student.name"
              header-text="ឈ្មោះសិស្ស"
              text-align="Left"
              width="170"
              :template="'studentName'"
              :is-frozen="true"
              :allow-editing="false"
            >
              <template #studentName="{ data }">
                <div class="flex flex-col gap-y-2">
                  <div>
                    {{ data.student.name }}
                  </div>
                  <div>
                    {{ data.student.latin }}
                  </div>
                </div>
              </template>
            </EColumn>
            <EColumn
              field="newTotalScore"
              header-text="Total"
              text-align="Left"
              type="number"
              format="###.##"
              :auto-fit="true"
              :is-frozen="true"
            />
            <EColumn
              field="newGpa"
              header-text="GPA"
              text-align="Left"
              type="number"
              format="###.##"
              :auto-fit="true"
              :is-frozen="true"
            />
            <EColumn
              field="newRank"
              header-text="Rank"
              text-align="Left"
              type="number"
              format="###.##"
              :auto-fit="true"
              :is-frozen="true"
            />
            <EColumn
              v-for="(score, index) in store.scoreHeaders"
              :key="score.id"
              :field="`scores.${index}.score`"
              :header-text="score.fullSubjectCalc ?? ''"
              text-align="Left"
              width="100"
              :edit-type="'numericEdit'"
              type="number"
              format="###.##"
              :data-testid="`score-field-#{index}`"
              :validation-rules="{
                required: true,
                min: 0,
                max: score.maxScore,
              }"
            />
          </EColumns>
        </EjsGrid>
      </div>
    </div>
  </BaseModal>
</template>
