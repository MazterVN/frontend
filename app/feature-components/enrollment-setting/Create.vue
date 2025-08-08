<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useEnrollmentSettingStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')

emit('init')
</script>

<template>
  <BaseModal
    title="បន្ថែម"
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
      <div class="sm:col-span-12">
        <UFormField
          name="name"
          label="ឈ្មោះ"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-6">
        <UFormField
          name="sourceStudyYearId"
          label="កម្រិតសិក្សាប្រភព"
        >
          <DropdownList
            id="sourceStudyYearId"
            v-model="store.item.sourceStudyYearId"
            data-testid="sourceStudyYearId"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"

            @change="interactedChanged($event, (event) => store.sourceStudyYearChanged(event))"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-6">
        <UFormField
          name="destinationStudyYearId"
          label="កម្រិតសិក្សាគោលដៅ"
        >
          <DropdownList
            id="destinationStudyYearId"
            v-model="store.item.destinationStudyYearId"
            data-testid="destinationStudyYearId"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"

            @change="interactedChanged($event, (event) => store.destinationStudyYearChanged(event))"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-12">
        <UFormField
          name="seatDatetimeStart"
          label="ពេលជ្រើសរើសកៅអី"
        >
          <ElDatePickerExtended
            v-model:start-at="store.item.seatDatetimeStart"
            v-model:end-at="store.item.seatDatetimeEnd"
            data-testid="date-range-picker-field"
            type="datetimerange"
            format="ddd, DD/MM/YYYY hh:mm A"
            value-format="YYYY-MM-DDTHH:mm:ss[Z]"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="ប្រភព">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[250px]">
                    ក្រុមមុខវិជ្ជា
                  </TableHead>
                  <TableHead class="w-[250px]">
                    សេវាកម្ម
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.enrollmentSettingSources"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`enrollmentSettingSources-${row.id}-${row.studyYearId}-subjectGroupingId`"
                      :name="`enrollmentSettingSources.${index}.subjectGroupingId`"
                    >
                      <DropdownList
                        :id="`enrollmentSettingSources-${index}-subjectGroupingId`"
                        v-model="row.subjectGroupingId"
                        :data-testid="`source-subject-grouping-dropdown-${index}`"
                        :enabled="!!row.studyYearId"
                        :graphql-query="ListSubjectGroupingDropdownDocument"
                        :fields="{ text: 'nameCalc', value: 'id' }"
                        :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', row.studyYearId || null))"

                        @change="interactedChanged($event, () => row.serviceDetailId = '')"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`enrollmentSettingSources-${row.id}-${row.subjectGroupingId}-serviceDetailId`"
                      :name="`enrollmentSettingSources.${index}.serviceDetailId`"
                    >
                      <DropdownList
                        :id="`enrollmentSettingSources-${index}-serviceDetailId`"
                        v-model="row.serviceDetailId"
                        :data-testid="`source-service-detail-dropdown-${index}`"
                        :enabled="!!row.subjectGroupingId"
                        :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
                        :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
                        :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', row.subjectGroupingId || null))"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-source-detail-${index}`"
                      @click="store.removeSourceDetail(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-source-btn"
                  @click="store.addSourceDetail"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>

      <div class="sm:col-span-full">
        <UFormField label="គោលដៅ">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[200px]">
                    ក្រុមមុខវិជ្ជា
                  </TableHead>
                  <TableHead class="w-[200px]">
                    សេវាកម្ម
                  </TableHead>
                  <TableHead class="w-[250px]">
                    បន្ទប់
                  </TableHead>
                  <TableHead class="w-[130px]">
                    កន្លែងអង្គុយអតិបរមា
                  </TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(row, index) in store.item.enrollmentSettingDestinations"
                  :key="row.id"
                >
                  <TableCell>
                    <UFormField
                      :key="`enrollmentSettingDestinations-${row.id}-${row.studyYearId}-subjectGroupingId`"
                      :name="`enrollmentSettingDestinations.${index}.subjectGroupingId`"
                    >
                      <DropdownList
                        :id="`enrollmentSettingDestinations-${index}-subjectGroupingId`"
                        v-model="row.subjectGroupingId"
                        :data-testid="`destination-subject-grouping-dropdown-${index}`"
                        :graphql-query="ListSubjectGroupingDropdownDocument"
                        :enabled="!!row.studyYearId"
                        :fields="{ text: 'nameCalc', value: 'id' }"
                        :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', row.studyYearId || null))"

                        @change="interactedChanged($event, () => row.serviceDetailId = '')"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :key="`enrollmentSettingDestinations-${row.id}-${row.subjectGroupingId}-serviceDetailId`"
                      :name="`enrollmentSettingDestinations.${index}.serviceDetailId`"
                    >
                      <DropdownList
                        :id="`enrollmentSettingDestinations-${index}-serviceDetailId`"
                        v-model="row.serviceDetailId"
                        :data-testid="`destination-service-detail-dropdown-${index}`"
                        :enabled="!!row.subjectGroupingId"
                        :graphql-query="ListSubjectGroupingServiceDetailDropdownDocument"
                        :fields="{ text: 'serviceNameCalc', value: 'serviceDetailId' }"
                        :predicate="predicateMemoize(new Predicate('subjectGroupingId', 'equal', row.subjectGroupingId || null))"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`enrollmentSettingDestinations.${index}.buildingRoomId`"
                    >
                      <DropdownList
                        :id="`enrollmentSettingDestinations-${index}-buildingRoomId`"
                        v-model="row.buildingRoomId"
                        :data-testid="`destination-building-room-dropdown-${index}`"
                        :graphql-query="ListBuildingRoomDropdownDocument"
                        :fields="{ text: 'fullBuildingRoomNameCalc', value: 'id' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField
                      :name="`enrollmentSettingDestinations.${index}.maxSeat`"
                    >
                      <UInput
                        v-model="row.maxSeat"
                        :data-testid="`destination-max-seat-${index}`"
                        type="number"
                        min="0"
                        max="200"
                      />
                    </UFormField>
                  </TableCell>

                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`remove-destination-detail-${index}`"
                      @click="store.removeDestinationDetail(row.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-destination-btn"
                  @click="store.addDestinationDetail"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
